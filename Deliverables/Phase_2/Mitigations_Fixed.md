# Mitigations Implemented

This document summarises what was done for each mitigation, which files were changed, and what was **not** applicable to this project.

---

## R3 - Information disclosure in HTTP 500 errors

### MT22 - Central error handler
**File created:** `src/middlewares/errorHandler.ts`
- 4-argument Express middleware `(err, req, res, next)` that catches all unhandled errors
- Always sends `{ message: "Internal server error" }` to the client
- Logs the full error (message + stack) to the server only via `console.error`
- In development (`NODE_ENV !== "production"`) includes the error message to ease debugging
- `req.method` and `req.path` are sanitized before being written to logs - strips `\r\n` to prevent log injection (newline injection attacks)
- Uses `%s` format specifiers instead of template literals to avoid format string injection

**File changed:** `index.ts`
- Added import of `errorHandler`
- Registered after all routes: `app.use(errorHandler)` - must always be the last middleware

### MT23 - Standardize error responses
- Covered by standardising all 500 responses to `{ message: "Internal server error" }`

### MT24 - Review catch blocks
**Files changed:** all controllers that were leaking internal details:
- `UserController.ts` - removed `error: err` (raw object) and `error.message` × 3
- `NotificationController.ts` - removed `error.message` × 2
- `OrderController.ts` - removed `error.message` × 3
- `NeededProductController.ts` - removed `error.message`
- `ParishController.ts` - removed `error.message` × 2
- `MenuController.ts` - removed `err.message || "..."`

**Rule applied:** only `catch` blocks returning `res.status(500)` with internal details were fixed. Responses 400, 404, and 409 with fixed messages were left untouched - they are legitimate information for the client.

---

## R8 - JSON body without explicit limit

### MT19 - Explicit JSON body size limit
**File changed:** `index.ts`
```typescript
app.use(express.json({ limit: "1mb" }));
```
The 1 MB limit covers the largest payloads in the application (menus, applications with products). Express automatically rejects requests above this limit.

### MT20 - Not applicable
Requires a reverse proxy (nginx, etc.). The project has no proxy configured.

### MT21 - Not applicable
Requires timeout configuration at the proxy level. The project has no proxy configured.

---

## R6 - PDF upload with MIME-only validation

### MT16 - Magic bytes validation + safe filename handling
**File created:** `src/utils/validatePdfMagicBytes.ts`
- Reads the first 4 bytes of the file on disk after upload
- Checks the `%PDF` signature (`0x25 0x50 0x44 0x46`)
- If the check fails, deletes the file from disk immediately (`fs.unlinkSync`)
- Exposes `rejectNonPdfFiles(files)` which returns the list of invalid files

**File created:** `src/utils/sanitizeFilename.ts`
- Sanitizes the original filename before using it on disk to prevent path traversal and injection attacks

**File changed:** `src/Controller/ApplicationController.ts`
- Added magic bytes validation in `createApplicationWithFiles` and `updateApplicationWithFiles`, after the upload and before the rename, returning 400 if any file fails the check
- Added `buildSafeFilePath()` helper that sanitizes the filename and resolves the final path, then guards that the resolved path stays strictly inside the `uploads/` directory - prevents path traversal attacks (e.g. `../../etc/passwd`)
- Invalid filename or path now returns 400 `"Invalid file name."` instead of leaking the error

### MT17 - Maximum file size
**File changed:** `src/Routes/ApplicationRoutes.ts`
```typescript
limits: {
  fileSize: 5 * 1024 * 1024, // 5 MB per file
  files: 10,                  // maximum 10 files per request
}
```
Multer rejects files above the limit before saving them to disk.

### MT18 - Not applicable
Antivirus/content scanning is optional and cost-dependent. Not implemented.

---

## R4 - Files exposed on `/uploads` via static hosting

### MT13 - Remove public static hosting
**File changed:** `index.ts`
- Removed the line `app.use("/uploads", express.static(...))`
- The `uploads/` folder is no longer publicly accessible via direct URL

### MT14 - Authenticated route with ownership check
**File changed:** `src/Routes/ApplicationRoutes.ts`
- Added `authMiddleware` to the route `GET /:applicationId/documents/:filename`
- Requests without a valid token receive 401

**File changed:** `src/Controller/ApplicationController.ts`
- `getDocument` now checks permissions before serving the file:
  - **NetworkManager** → can access any document
  - **Visitor (owner)** → can only access documents from their own application (via `userId`)
  - **Any other role** → 403 Access denied

### MT15 - Unpredictable UUID filenames
**File changed:** `src/Routes/ApplicationRoutes.ts`
- Replaced `Date.now() + "-" + Math.round(Math.random() * 1e9) + extension` with `uuidv4()`
- Files saved to disk have no extension and no predictable pattern
- `uuid` was already listed in `package.json` dependencies - no install needed

---

## R7 - Confidentiality in transit - HTTP without TLS

### MT4 - Not applicable in code
Requires HTTPS/TLS configuration at the reverse proxy or load balancer.

### MT5 - Not applicable in code
Requires HSTS and TLS settings configuration at the proxy/edge.

### MT6 - Already compliant
Verified that no `req.query` usage handles tokens, passwords, or credentials. The `authMiddleware` reads the token exclusively from the `Authorization: Bearer <token>` header.

---

## Risks not addressed in this cycle

| Risk | Mitigations | Reason |
|---|---|---|
| R1 - Insufficient access control | MT1, MT2, MT3 | Not addressed in this cycle |
| R2 - Weak JWT secrets | MT7, MT8, MT9 | Not addressed in this cycle |
| R5 - No rate limiting / long-lived JWT | MT10, MT11, MT12 | Not addressed in this cycle |
| R9 - Debug logging | MT25, MT26, MT27 | Not addressed in this cycle |