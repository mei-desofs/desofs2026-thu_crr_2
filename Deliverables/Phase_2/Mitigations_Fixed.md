# Mitigations Implemented

This document summarises what was done for each mitigation, which files were changed, and what was **not** applicable to this project.

---

## R1 - Insufficient access control (Very High)

### MT1 - Auth middleware on sensitive routes (deny-by-default)
**Mitigation:** Apply `authMiddleware` on every route that reads or changes sensitive data, with deny-by-default for new routes until protected.

**Behaviour:** JWT authentication is required via `authMiddleware` (`src/middlewares/authMiddleware.ts`). Each router applies `router.use(authMiddleware)` immediately after `const router = Router()`, so new routes inherit protection by default. Explicit exceptions only where required (e.g. register and login).

**Files changed:** every route file under `src/Routes/`
- `router.use(authMiddleware)` added right after `const router = Router()` in each routes module.
- **`UserRoutes.ts`:** public `POST /register` and `POST /login` are registered **before** `router.use(authMiddleware)`; all other user routes require a valid JWT.

**Expected behaviour:**
- No token - `401`
- Invalid or expired token - `403`
- Valid token (with `id` and `role` in the payload) → access according to business rules

### MT2 - Not addressed in this cycle
Role and resource ownership checks beyond “has a valid token” remain follow-on work.

### MT3 - Not addressed in this cycle
No formal maintained list of public routes beyond the `UserRoutes` pattern above.

---

## R5 - No rate limiting on login; long-lived JWT without revocation (Medium)

### MT10 - Rate limiting on login

**Mitigation:** Apply rate limiting to `POST /users/login` (and similar) per IP, with generic responses to callers.

#### Phase 1 (partial) — branch `R1_Mitigation_MT1` (CodeQL)

While implementing **MT1**, the pipeline **CODEQL** stage failed with `js/missing-rate-limiting` and suggested adding rate limiting to API routes — the same direction as **MT10**. `apiRateLimiter` was added on that branch to unblock the pipeline.

- **`src/middlewares/authMiddleware.ts`:** `apiRateLimiter` — 1000 requests / 15 min per IP (satisfies CodeQL; too high for brute-force on login).
- **Route files:** `router.use(apiRateLimiter)` on each router, including before `POST /login` in `UserRoutes.ts`.

#### Phase 2 (complete) — branch `R5_Mitigation_MT10`

After Phase 1, **MT10** was still only partial: login was rate-limited, but with a **global, permissive** cap. Branch **`R5_Mitigation_MT10`** adds a **dedicated, stricter** limiter on login only.

**Files changed:**
- **`src/middlewares/authMiddleware.ts`:** `loginRateLimiter` — **10** attempts / **15 min** per IP, generic message ( "Demasiadas tentativas de login. Tente novamente mais tarde" when `max` is exceeded).
- **`src/Routes/UserRoutes.ts`:** `POST /login` uses `loginRateLimiter` in addition to `apiRateLimiter` on the router.
- **`src/Controller/UserController.ts`:** login failures return `401` with `"Credenciais inválidas."` (no distinction between wrong email and wrong password).

**Example (`UserRoutes.ts`):**
```typescript
router.use(apiRateLimiter);

router.post("/register", UserController.register);
router.post("/login", loginRateLimiter, UserController.login);
```

**Limiter settings:**
```typescript
// CodeQL / general API (unchanged from Phase 1)
export const apiRateLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 1000, ... });

// MT10 — brute-force on credentials
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Demasiadas tentativas de login. Tente novamente mais tarde." },
  ...
});
```

**Expected behaviour:** from the same IP, the 11th and any further `POST /login` within a 15-minute window receive **429** with `{ "message": "Demasiadas tentativas de login. Tente novamente mais tarde." }` (returned by `express-rate-limit` when `loginRateLimiter` exceeds `max: 10`). After the window resets, login is allowed again. The global `apiRateLimiter` (1000 requests / 15 min) stays on all routers for CodeQL and general API abuse.

### MT11 - Not addressed in this cycle
Shorter access token lifetime / refresh tokens not implemented.

### MT12 - Not addressed in this cycle
Logout and server-side token denylist not implemented.

---

## R2 - Inconsistent or weak JWT secrets (Medium High)

### MT7 - Single secret source for sign and verify
**Mitigation:** Use one environment variable and one shared module for both signing and verifying JWTs so the secret cannot drift between files.

**Files changed:**
- **`src/middlewares/authMiddleware.ts`:** `jwtSecret` exported from `process.env.JWT_SECRET` (single source of truth; process refuses to start if unset).
- **`src/Controller/UserController.ts`:** `jwt.sign` uses `jwtSecret` imported from the middleware (removed `SECRET_KEY` and the `"minha_chave_secreta"` fallback).
- **`src/Service/UserService.ts`:** removed duplicate unused `SECRET_KEY` constant.

**Expected behaviour:** tokens issued at login are validated with the same secret in `authMiddleware`.

### MT8 - Refuse to start without secret
Covered by the startup check in `authMiddleware.ts` when `JWT_SECRET` is missing. (MT8 solved by MT7 branch)

### MT9 - Not addressed in this cycle
Secret generation policy (cryptographic randomness, secrets manager) is operational/deployment concern; not implemented in code.

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

## R9 - Debug logging with request data (Low)

### MT25 - No full `req.body` in production logs
**Mitigation:** Do not log full `req.body` (or equivalent) in production; log identifiers only where debug is needed.

**File created:** `src/utils/safeDebugLog.ts`
- `logRequestIdentifiers` logs only method, URL, `params`, and **names** of body keys (never values).
- In production (`NODE_ENV=production`) this function does not write request debug logs.
- `logErrorSafe` in production logs only the error message (no full stack/object).

**File changed:** `src/Controller/MenuController.ts`
- Removed `console.log(..., req.body)` in `createMenu`.
- Replaced with `logRequestIdentifiers("MenuController.createMenu", req)`.

**How to verify:**
1. Set `NODE_ENV=development` (or omit `NODE_ENV`), start the backend (`npm run dev` in `Backend`).
2. Call the menu creation `POST` with a test body.
3. Console should show `bodyKeys=...` (key names only), not passwords or the full payload.
4. Set `NODE_ENV=production`, restart, repeat the request: no `[M25][MenuController.createMenu]` log line.

### MT26 - Not addressed in this cycle
Structured logging with field redaction not implemented.

### MT27 - Partially covered
Verbose request debug is suppressed in production via `safeDebugLog`; no dedicated debug flag beyond `NODE_ENV`.

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

## Mitigations not addressed in this cycle

| Risk | Mitigation | Reason |
|---|---|---|
| R1 - Insufficient access control | MT2 | Authorization by role and resource ownership beyond “has a valid token” not implemented |
| R1 - Insufficient access control | MT3 | No formal maintained list of public routes (only the `UserRoutes` pattern) |
| R2 - Inconsistent or weak JWT secrets | MT9 | Secret generation policy (cryptographic randomness, secrets manager) — operational/deployment; not in code |
| R5 - No rate limiting / long-lived JWT | MT11 | Shorter access token lifetime / refresh tokens not implemented |
| R5 - No rate limiting / long-lived JWT | MT12 | Logout and server-side token denylist not implemented |
| R9 - Debug logging with request data | MT26 | Structured logging with field redaction not implemented |
| R9 - Debug logging with request data | MT27 | Partially covered only (`NODE_ENV` via `safeDebugLog`); no dedicated debug flag |
