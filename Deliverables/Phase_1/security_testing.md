[Voltar ao README](../README.md)

[Ficheiro anterior](asvs.md)

---

## Security Testing Planning

This document defines the security testing plan for the system. In Phase 1, testing is **planned as verification intent**, not executed. Execution will take place in Phases 2 and 3 as the implementation matures.

The plan maps each test to the relevant security requirement, threat (STRIDE matrix), abuse case, mitigation, and ASVS 5.0 item, ensuring full traceability across all security artefacts produced in Phase 1.

---

### Validation Objectives

The primary goal of security testing is to verify that implemented controls are effective, correctly scoped, and aligned with the risk profile identified during threat modelling. Specifically, the plan aims to:

- Confirm that all identified threats (TH-01 to TH-23) are mitigated by verifiable controls;
- Validate that abuse cases (AC-01 to AC-09) cannot be successfully executed against the implemented system;
- Assess compliance with the ASVS 5.0 items selected in the tracker, particularly those with status "In Progress";
- Verify that security requirements (SR-01 to SR-17) are enforced end-to-end at the API layer;
- Produce evidence artefacts (HTTP responses, log entries, screenshots) that can be reviewed in the threat modelling review process.

### 1. Authentication

#### ST-01 — Brute-force protection on login endpoint

| Field | Value |
|---|---|
| **Identifier** | ST-01 |
| **Category** | Authentication |
| **Description** | Send more than N consecutive failed login attempts to `POST /users/login` from the same IP and verify that the endpoint applies rate limiting or account lockout after the threshold. |
| **Security Requirement** | SR-03 Server-side RBAC; SR-16 Login attempt protection |
| **Threat** | TH-04 — DoS / brute-force on `POST /users/login` |
| **Abuse Case** | AC-07 (DoS on critical operations) |
| **Mitigation** | MT10 — Rate limiting on login per IP/account |
| **ASVS** | V6.1.1 — Rate limiting and anti-automation documented and enforced |
| **Expected Evidence** | HTTP 429 response after threshold; `Retry-After` header or equivalent; no successful login via credential stuffing |

---

#### ST-02 — JWT signature validation

| Field | Value |
|---|---|
| **Identifier** | ST-02 |
| **Category** | Authentication |
| **Description** | Submit requests with a JWT whose payload has been modified (e.g. role field changed) without re-signing, and with a JWT signed using an arbitrary/unknown secret. Verify rejection in both cases. |
| **Security Requirement** | SR-04 Server-side JWT validation |
| **Threat** | TH-02 — JWT tampering; TH-10 — JWT forgery with guessable secret |
| **Abuse Case** | AC-02 |
| **Mitigation** | MT7, MT8, MT9 — Single JWT secret module; no hardcoded fallback; cryptographically random secret |
| **ASVS** | V9.1.1 — Token validated via signature/MAC before use; V9.1.2 — Only allowlisted algorithms accepted |
| **Expected Evidence** | HTTP 401 for tampered token; HTTP 401 for token signed with wrong secret; server log showing rejection reason |

---

#### ST-03 — Information disclosure in login error responses

| Field | Value |
|---|---|
| **Identifier** | ST-03 |
| **Category** | Authentication |
| **Description** | Attempt login with a valid email and wrong password, then with a non-existent email. Verify that both responses return identical messages and HTTP status codes, revealing no information about account existence. |
| **Security Requirement** | SR-08 Input sanitization |
| **Threat** | TH-03 — Login error responses reveal registered email status |
| **Abuse Case** | AC-01 |
| **Mitigation** | MT22, MT23 — Generic error messages; no raw error objects in response |
| **ASVS** | V6.1.1 |
| **Expected Evidence** | Identical response body and HTTP status (e.g. 401) for both cases; no stack trace or internal detail in response |

---

#### ST-04 — Token invalidation on logout

| Field | Value |
|---|---|
| **Identifier** | ST-04 |
| **Category** | Authentication |
| **Description** | Log in, capture JWT, log out, then attempt to use the captured JWT on a protected endpoint. Verify the token is rejected after logout. |
| **Security Requirement** | SR-17 Token session invalidation |
| **Threat** | TH-01 — JWT replay attack |
| **Abuse Case** | AC-02 |
| **Mitigation** | MT12 — Server-side denylist or token version invalidation |
| **ASVS** | V7.1.1 — Session lifetime and inactivity timeout defined and enforced |
| **Expected Evidence** | HTTP 401 when using a post-logout JWT; token not accepted after explicit logout |

---

#### ST-05 — Password stored as hash

| Field | Value |
|---|---|
| **Identifier** | ST-05 |
| **Category** | Authentication |
| **Description** | Register a user and inspect the `users` table in MySQL directly. Verify that no plaintext password is stored and that a recognised hashing algorithm (bcrypt, argon2) is used. |
| **Security Requirement** | SR-15 Secure password storage |
| **Threat** | TH-08 — Password hashes or PII exposed via SQL injection |
| **Abuse Case** | AC-01 |
| **Mitigation** | MT1, MT2 |
| **ASVS** | V6.1.1 |
| **Expected Evidence** | Database record shows hashed value; hash format matches bcrypt (`$2b$`) or argon2 (`$argon2`) prefix |

---

### 2. Authorisation

#### ST-06 — Unauthenticated access to protected endpoints

| Field | Value |
|---|---|
| **Identifier** | ST-06 |
| **Category** | Authorisation |
| **Description** | Send requests to all routes under `/api/*` without an `Authorization` header. Verify that every protected route returns HTTP 401. Compile the list of routes from `Bootstrap.ts` and route files. |
| **Security Requirement** | SR-03 Server-side RBAC; SR-04 Server-side JWT validation |
| **Threat** | TH-09 — Missing auth middleware on active routes |
| **Abuse Case** | AC-02 |
| **Mitigation** | MT1, MT3 — `authMiddleware` on every route; explicit public route allowlist |
| **ASVS** | V8.1.1 — Authorisation rules restrict function-level access |
| **Expected Evidence** | HTTP 401 for every `/api/*` request without token; public routes (login, register, `POST /applications`) return expected responses |

---

#### ST-07 — Role-based access control enforcement

| Field | Value |
|---|---|
| **Identifier** | ST-07 |
| **Category** | Authorisation |
| **Description** | For each privileged endpoint (e.g. `POST /suppliers/:id/quarantine`, `PUT /menus/:id/approve`, KPI endpoints), invoke the endpoint with tokens from roles below the required level (Customer, Supplier). Verify HTTP 403 in all cases. |
| **Security Requirement** | SR-03 Server-side RBAC |
| **Threat** | TH-09 — Elevation of privilege via missing role check; TH-06 — Self-elevation via PUT `/users/:id` |
| **Abuse Case** | AC-02, AC-08 |
| **Mitigation** | MT2 — Role and ownership enforcement after authentication |
| **ASVS** | V8.1.1; V8.1.2 — Field-level access restrictions enforced |
| **Expected Evidence** | HTTP 403 for each cross-role invocation; no state change in database |

---

#### ST-08 — IDOR on user-owned resources

| Field | Value |
|---|---|
| **Identifier** | ST-08 |
| **Category** | Authorisation |
| **Description** | Authenticate as User A. Attempt `GET` and `PUT` on resources owned by User B (e.g. `/api/reservations/:id`, `/api/orders/:id`) by replacing IDs in the URL. Verify HTTP 403 and no data leakage. |
| **Security Requirement** | SR-01 Object-level access control; SR-02 Ownership validation |
| **Threat** | TH-11 — Cross-canteen menu modification; TH-18 — KPI tampering |
| **Abuse Case** | AC-01, AC-03 |
| **Mitigation** | MT2 — Ownership checked against JWT claims, not only URL parameter |
| **ASVS** | V8.1.1; V8.1.2 |
| **Expected Evidence** | HTTP 403 for all cross-user resource access; response body contains no data belonging to User B |

---

#### ST-09 — Quarantine bypass prevention

| Field | Value |
|---|---|
| **Identifier** | ST-09 |
| **Category** | Authorisation |
| **Description** | Authenticate as a Supplier that is in quarantine state. Attempt `PUT /api/suppliers/:id` with `{"quarantine": false}` in the request body. Verify that the quarantine field is immutable by the Supplier role. |
| **Security Requirement** | SR-03 Server-side RBAC |
| **Threat** | TH-22 — Supplier removes own quarantine |
| **Abuse Case** | AC-08 |
| **Mitigation** | MT2 — Quarantine field changes restricted to Network Admin / Canteen Manager |
| **ASVS** | V8.1.2 |
| **Expected Evidence** | HTTP 403; quarantine status unchanged in database after request |

---

#### ST-10 — Role self-elevation via user update

| Field | Value |
|---|---|
| **Identifier** | ST-10 |
| **Category** | Authorisation |
| **Description** | Authenticate as a Customer or Supplier. Send `PUT /users/:id` with `{"role": "NetworkAdmin"}` in the body. Verify that the role field cannot be modified by the user themselves. |
| **Security Requirement** | SR-03 Server-side RBAC; SR-04 Server-side JWT validation |
| **Threat** | TH-06 — Authenticated user self-elevates via PUT `/users/:id` |
| **Abuse Case** | AC-02 |
| **Mitigation** | MT2 |
| **ASVS** | V8.1.2 |
| **Expected Evidence** | HTTP 403 or 400; database record unchanged; role remains as originally assigned |

---

### 3. Input Validation

#### ST-11 — SQL injection on API endpoints

| Field | Value |
|---|---|
| **Identifier** | ST-11 |
| **Category** | Input Validation |
| **Description** | Submit SQL injection payloads (`' OR 1=1--`, `'; DROP TABLE users;--`) in all free-text fields (product name, feedback, application form fields). Verify that Sequelize parameterised queries prevent execution and that no database error is reflected in the response. |
| **Security Requirement** | SR-08 Input sanitization |
| **Threat** | TH-08 — SQL injection exposing credentials or PII |
| **Abuse Case** | AC-06 |
| **Mitigation** | MT22 — Parameterised ORM; MT24 — No raw error objects in responses |
| **ASVS** | V1.1.1 — Input decoded only once; V1.1.2 — Output encoding at interpreter boundary; V2.1.1 — Input validation rules defined |
| **Expected Evidence** | HTTP 400 or generic error; no SQL error message in response body; database records unaffected |

---

#### ST-12 — XSS via stored input fields

| Field | Value |
|---|---|
| **Identifier** | ST-12 |
| **Category** | Input Validation |
| **Description** | Submit XSS payloads (`<script>alert(1)</script>`, `"><img src=x onerror=alert(1)>`) in string fields that are later rendered or returned in API responses. Verify output encoding neutralises the payload. |
| **Security Requirement** | SR-08 Input sanitization; SR-09 Output encoding |
| **Threat** | TH-08 |
| **Abuse Case** | AC-06 |
| **Mitigation** | MT23 — Standardised safe response shape |
| **ASVS** | V1.1.2 — Output encoding as final step before interpreter |
| **Expected Evidence** | Stored value returned as HTML-encoded string; script tag not executable when returned in JSON response |

---

#### ST-13 — Oversized JSON body rejection

| Field | Value |
|---|---|
| **Identifier** | ST-13 |
| **Category** | Input Validation |
| **Description** | Send a `POST` or `PUT` request with a JSON body exceeding the configured `express.json({ limit })` value (e.g. 10 MB body). Verify the server rejects the payload before processing. |
| **Security Requirement** | SR-10 Rate limiting |
| **Threat** | TH-21 — Memory exhaustion via oversized JSON body |
| **Abuse Case** | AC-07 |
| **Mitigation** | MT19 — `express.json({ limit })` configured; MT20 — Reverse proxy body limit |
| **ASVS** | V2.1.1 |
| **Expected Evidence** | HTTP 413 (Payload Too Large); request rejected before reaching controller logic |

---

### 4. Data Protection and Communication

#### ST-14 — HTTPS enforcement

| Field | Value |
|---|---|
| **Identifier** | ST-14 |
| **Category** | Data Protection and Communication |
| **Description** | Attempt to connect to the API via plain HTTP. Verify that the server either rejects the connection or redirects to HTTPS with a 301/308 response. Verify HSTS header is present on HTTPS responses. |
| **Security Requirement** | SR-13 HTTPS Usage |
| **Threat** | TH-20 — API served over plain HTTP exposes credentials to interception |
| **Abuse Case** | — |
| **Mitigation** | MT4 — TLS at reverse proxy; MT5 — HSTS configured |
| **ASVS** | V12.1.1 — Only TLS 1.2/1.3 enabled; V4.1.2 — HTTP to HTTPS redirect for user-facing endpoints only |
| **Expected Evidence** | HTTP requests redirected or rejected; `Strict-Transport-Security` header present; TLS version confirmed as 1.2 or 1.3 via `openssl s_client` |

---

#### ST-15 — Sensitive data not exposed in HTTP error responses

| Field | Value |
|---|---|
| **Identifier** | ST-15 |
| **Category** | Data Protection and Communication |
| **Description** | Trigger server-side errors by sending malformed requests, invalid IDs, and boundary values. Verify that HTTP 500 responses return only a generic message and never include stack traces, internal paths, or ORM query details. |
| **Security Requirement** | SR-08 Input sanitization |
| **Threat** | TH-03 — Stack traces or internal details exposed in error responses |
| **Abuse Case** | AC-01 |
| **Mitigation** | MT22, MT23, MT24 — Central error handler; generic response shape; no raw exception objects |
| **ASVS** | V16.2.1 — Log entries include metadata; errors logged server-side, not client-side |
| **Expected Evidence** | HTTP 500 body contains only `{ "error": "Internal server error" }` or equivalent; full detail only in server log |

---

#### ST-16 — No sensitive data in server logs (`console.log`)

| Field | Value |
|---|---|
| **Identifier** | ST-16 |
| **Category** | Data Protection and Communication |
| **Description** | Execute authenticated requests to `POST /menus`, `POST /users/login`, and file upload endpoints. Review server stdout logs and verify that full request bodies (including passwords, JWT payloads, and PII) are not written to logs. |
| **Security Requirement** | SR-05 Audit log |
| **Threat** | TH-12 — `console.log(req.body)` writes sensitive data to accessible logs |
| **Abuse Case** | AC-09 |
| **Mitigation** | MT25, MT26, MT27 — No full `req.body` logging in production; structured logging with field redaction |
| **ASVS** | V16.1.1 — Logging inventory defined; V16.2.1 — Log entries contain necessary metadata |
| **Expected Evidence** | Server logs contain request identifiers and event types but not raw credentials or JWT tokens; password fields absent from all log output |

---

### 5. Business Rules

#### ST-17 — Cross-canteen menu and KPI modification

| Field | Value |
|---|---|
| **Identifier** | ST-17 |
| **Category** | Business Rules |
| **Description** | Authenticate as a Canteen Manager for Canteen A. Attempt `PUT /menus/:id` and `PUT /statistics/:id` using IDs belonging to Canteen B. Verify the operations are blocked. |
| **Security Requirement** | SR-01 Object-level access control; SR-02 Ownership validation |
| **Threat** | TH-11 — Cross-canteen menu modification; TH-18 — KPI tampering |
| **Abuse Case** | AC-03 |
| **Mitigation** | MT2 — Canteen scoping enforced from JWT claims |
| **ASVS** | V8.1.2 |
| **Expected Evidence** | HTTP 403; database records for Canteen B unchanged after request |

---

#### ST-18 — Rate limiting on computationally heavy endpoints

| Field | Value |
|---|---|
| **Identifier** | ST-18 |
| **Category** | Business Rules |
| **Description** | Send rapid repeated requests to `POST /orders` (weekly planning) and `GET /statistics` (KPI calculation). Verify that rate limiting activates within the threshold and that the server does not degrade or crash. |
| **Security Requirement** | SR-10 Rate limiting; SR-11 Async for heavy operations |
| **Threat** | TH-13 — DoS via repeated planning computation |
| **Abuse Case** | AC-07 |
| **Mitigation** | MT10, MT19, MT21 — Rate limiting; async processing; request timeout |
| **ASVS** | V15.1.3 — Time-consuming functionality identified and protected against overuse |
| **Expected Evidence** | HTTP 429 after threshold; response time remains stable for legitimate requests; server memory and CPU metrics within normal bounds during burst |

---

### 6. Files and Resources

#### ST-19 — Malicious file upload rejection

| Field | Value |
|---|---|
| **Identifier** | ST-19 |
| **Category** | Files and Resources |
| **Description** | Submit the following payloads to `POST /applications`: (a) a file with `.pdf` extension but PHP/JS webshell content; (b) a file with path traversal in the filename (`../../etc/passwd.pdf`); (c) a file exceeding the size limit; (d) a file with `Content-Type: application/pdf` but non-PDF magic bytes. Verify all are rejected. |
| **Security Requirement** | SR-06 Upload validation; SR-07 File isolation |
| **Threat** | TH-15 — Webshell upload or path traversal via filename |
| **Abuse Case** | AC-04 |
| **Mitigation** | MT16 — Magic bytes validation; MT17 — File size limit; MT18 — Content scanning |
| **ASVS** | V5.1.1 — Permitted file types, extensions, and max size defined; V5.2.1 — Only files within acceptable size range accepted |
| **Expected Evidence** | HTTP 400 or 422 for all four cases; no file written to `/uploads`; filename normalised or rejected when path separators detected |

---

#### ST-20 — Unauthenticated access to uploaded files via `express.static`

| Field | Value |
|---|---|
| **Identifier** | ST-20 |
| **Category** | Files and Resources |
| **Description** | Without an `Authorization` header, attempt `GET /uploads/suppliers/1/doc.pdf` (and other predictable paths). Verify that the file is not served without authentication. |
| **Security Requirement** | SR-07 File isolation; SR-01 Object-level access control |
| **Threat** | TH-16 — `express.static` exposes uploaded documents without authentication |
| **Abuse Case** | AC-05 |
| **Mitigation** | MT13 — No public `express.static` for confidential uploads; MT14 — Authenticated route for file serving; MT15 — Unpredictable filenames (UUID) |
| **ASVS** | V5.1.1; V8.1.1 |
| **Expected Evidence** | HTTP 401 or 403 for unauthenticated file access; file not returned in response body |

---

#### ST-21 — IDOR on file download (supplier document enumeration)

| Field | Value |
|---|---|
| **Identifier** | ST-21 |
| **Category** | Files and Resources |
| **Description** | Authenticate as Supplier A. Enumerate file download URLs by incrementing supplier IDs (`/uploads/suppliers/1/`, `/uploads/suppliers/2/`, etc.). Verify that documents belonging to other suppliers are not accessible. |
| **Security Requirement** | SR-01 Object-level access control; SR-07 File isolation |
| **Threat** | TH-17 — IDOR on supplier document download |
| **Abuse Case** | AC-05 |
| **Mitigation** | MT14, MT15 — Authenticated serving with ownership check; UUID filenames |
| **ASVS** | V8.1.1; V8.1.2 |
| **Expected Evidence** | HTTP 403 for access to another supplier's document; filenames stored as UUIDs not guessable from sequential IDs |

---

### 7. Logging and Monitoring

#### ST-22 — Audit log completeness for sensitive operations

| Field | Value |
|---|---|
| **Identifier** | ST-22 |
| **Category** | Logging and Monitoring |
| **Description** | Execute the following operations and verify that a corresponding log entry is generated: (a) quarantine state change; (b) role change on a user; (c) menu approval; (d) KPI data modification; (e) file upload acceptance and rejection. Verify each entry includes user ID, timestamp, action type, and affected resource ID. |
| **Security Requirement** | SR-05 Audit log |
| **Threat** | TH-07 — User management without audit trail; TH-19 — KPI modification without audit trail; TH-23 — Quarantine removal without log |
| **Abuse Case** | AC-09 |
| **Mitigation** | MT25, MT26 — Structured logging with event metadata; no sensitive field values in log body |
| **ASVS** | V16.1.1 — Logging inventory defined; V16.2.1 — Each entry includes who, what, when, where |
| **Expected Evidence** | Log entries present for all listed operations; entries contain `userId`, `action`, `resourceId`, `timestamp`; password or token values absent from log |

---

#### ST-23 — Log immutability

| Field | Value |
|---|---|
| **Identifier** | ST-23 |
| **Category** | Logging and Monitoring |
| **Description** | Verify that log storage is write-once or append-only. Attempt to delete or modify a log entry via the application API and via direct database access (if logs are stored in MySQL). Verify modification is rejected or detected. |
| **Security Requirement** | SR-12 Log immutability |
| **Threat** | TH-07; TH-19; TH-23 |
| **Abuse Case** | AC-09 |
| **Mitigation** | MT26 — Structured logging with access-controlled storage |
| **ASVS** | V16.1.1 |
| **Expected Evidence** | No API endpoint exposes log deletion; direct DB modification attempt rejected by permissions; log hash or external append-only store confirms integrity |

---

### 8. Application and API Configuration

#### ST-24 — Secret detection in repository

| Field | Value |
|---|---|
| **Identifier** | ST-24 |
| **Category** | Application and API Configuration |
| **Description** | Run a secret scanning tool (e.g. `trufflehog`, `gitleaks`) against the repository. Verify no JWT secrets, database credentials, API keys, or other sensitive values are committed in source code or configuration files. |
| **Security Requirement** | SR-14 Secret detection |
| **Threat** | TH-02 — Weak or hardcoded JWT secret; TH-10 — JWT forgery via leaked secret |
| **Abuse Case** | — |
| **Mitigation** | MT7, MT8, MT9 — JWT secret from env; cryptographic randomness; no hardcoded fallback |
| **ASVS** | V11.1.1 — Key management policy defined; V15.1.2 — Third-party library inventory maintained |
| **Expected Evidence** | Zero findings from secret scanner in repository history; `.env` file absent from version control; `JWT_SECRET` loaded exclusively from environment variable |

---

#### ST-25 — Dependency vulnerability scan

| Field | Value |
|---|---|
| **Identifier** | ST-25 |
| **Category** | Application and API Configuration |
| **Description** | Run `npm audit` against `Backend/package.json`. Verify that no high or critical CVEs are present in direct or transitive dependencies. Document findings and remediation plan for any identified vulnerabilities. |
| **Security Requirement** | SR-14 Secret detection |
| **Threat** | TH-15 — Exploitation via vulnerable multer or express version |
| **Abuse Case** | — |
| **Mitigation** | MT16, MT17 — Up-to-date upload handling library |
| **ASVS** | V15.1.1 — Risk-based remediation timeframes for vulnerable components; V15.1.2 — SBOM maintained |
| **Expected Evidence** | `npm audit` output showing zero high/critical vulnerabilities, or a documented remediation plan with timeline for any found |

---

#### ST-26 — Content-Type header validation on API responses

| Field | Value |
|---|---|
| **Identifier** | ST-26 |
| **Category** | Application and API Configuration |
| **Description** | Inspect HTTP responses from all API endpoints. Verify that every response with a body includes a `Content-Type: application/json; charset=utf-8` header and that no endpoint serves HTML or mixed content on error paths. |
| **Security Requirement** | SR-09 Output encoding |
| **Threat** | TH-03 — Information disclosure via error response format |
| **Abuse Case** | — |
| **Mitigation** | MT23 — Standardised safe response shape |
| **ASVS** | V4.1.1 — Every HTTP response with body includes a Content-Type matching actual content |
| **Expected Evidence** | All responses include correct `Content-Type`; no HTML error pages returned from REST endpoints |

---

### Traceability Summary

| Test | Security Req. | Threat | Abuse Case | Mitigation | ASVS |
|------|--------------|--------|-----------|-----------|------|
| ST-01 | SR-03, SR-16 | TH-04 | AC-07 | MT10 | V6.1.1 |
| ST-02 | SR-04 | TH-02, TH-10 | AC-02 | MT7, MT8, MT9 | V9.1.1, V9.1.2 |
| ST-03 | SR-08 | TH-03 | AC-01 | MT22, MT23 | V6.1.1 |
| ST-04 | SR-17 | TH-01 | AC-02 | MT12 | V7.1.1 |
| ST-05 | SR-15 | TH-08 | AC-01 | MT1, MT2 | V6.1.1 |
| ST-06 | SR-03, SR-04 | TH-09 | AC-02 | MT1, MT3 | V8.1.1 |
| ST-07 | SR-03 | TH-09, TH-06 | AC-02, AC-08 | MT2 | V8.1.1, V8.1.2 |
| ST-08 | SR-01, SR-02 | TH-11, TH-18 | AC-01, AC-03 | MT2 | V8.1.1, V8.1.2 |
| ST-09 | SR-03 | TH-22 | AC-08 | MT2 | V8.1.2 |
| ST-10 | SR-03, SR-04 | TH-06 | AC-02 | MT2 | V8.1.2 |
| ST-11 | SR-08 | TH-08 | AC-06 | MT22, MT24 | V1.1.1, V2.1.1 |
| ST-12 | SR-08, SR-09 | TH-08 | AC-06 | MT23 | V1.1.2 |
| ST-13 | SR-10 | TH-21 | AC-07 | MT19, MT20 | V2.1.1 |
| ST-14 | SR-13 | TH-20 | — | MT4, MT5 | V12.1.1, V4.1.2 |
| ST-15 | SR-08 | TH-03 | AC-01 | MT22, MT23, MT24 | V16.2.1 |
| ST-16 | SR-05 | TH-12 | AC-09 | MT25, MT26, MT27 | V16.1.1, V16.2.1 |
| ST-17 | SR-01, SR-02 | TH-11, TH-18 | AC-03 | MT2 | V8.1.2 |
| ST-18 | SR-10, SR-11 | TH-13 | AC-07 | MT10, MT19, MT21 | V15.1.3 |
| ST-19 | SR-06, SR-07 | TH-15 | AC-04 | MT16, MT17, MT18 | V5.1.1, V5.2.1 |
| ST-20 | SR-07, SR-01 | TH-16 | AC-05 | MT13, MT14, MT15 | V5.1.1, V8.1.1 |
| ST-21 | SR-01, SR-07 | TH-17 | AC-05 | MT14, MT15 | V8.1.1, V8.1.2 |
| ST-22 | SR-05 | TH-07, TH-19, TH-23 | AC-09 | MT25, MT26 | V16.1.1, V16.2.1 |
| ST-23 | SR-12 | TH-07, TH-19, TH-23 | AC-09 | MT26 | V16.1.1 |
| ST-24 | SR-14 | TH-02, TH-10 | — | MT7, MT8, MT9 | V11.1.1, V15.1.2 |
| ST-25 | SR-14 | TH-15 | — | MT16, MT17 | V15.1.1, V15.1.2 |
| ST-26 | SR-09 | TH-03 | — | MT23 | V4.1.1 |

---

[Voltar ao README](../README.md)

[Ficheiro anterior](asvs.md)
