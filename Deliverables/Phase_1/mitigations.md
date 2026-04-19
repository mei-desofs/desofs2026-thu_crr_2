[Back to README](../README.md)

[Next file](asvs.md)

[Previous file](risk_assessment.md)

---

## Mitigations

This document lists **possible** mitigations for risks **R1–R9** in [risk_assessment.md](risk_assessment.md). The goal is to propose **solution directions** that fit the **Node.js / Express** style of the service (middleware, JWT, static files, *multer*). **Nothing here is mandatory.** For each risk, options are listed where applicable; any of them may **stay as proposed, be adjusted, or be dropped** as the project progresses and priorities and constraints become clearer.


### Priority focus (from [risk_assessment.md](risk_assessment.md))

| Priority | Risk                   | Level (matrix) | Role in this document      |
|----------|------------------------|----------------|----------------------------|
| 1        | R1                     | Very High      | **Tier 1** — primary focus |
| 2        | R7                     | Very High      | **Tier 1** — primary focus |
| 3        | R2                     | Medium High    | **Tier 1** — primary focus |
| 4–9      | R5, R4, R6, R8, R3, R9 | Medium / Low   | **Tier 2** — follow-on     |

---

### Tier 1 — Primary mitigation focus (R1, R7, R2)

These three risks carry the highest scores in the risk table (**R1** and **R7** are *Very High*; **R2** is Medium High). The mitigations below (**MT1**–**MT9**) should be the first candidates for design reviews, implementation backlog, and security test planning, so effort matches severity before work spreads to lower-ranked items.

---

### R1 — Insufficient access control (Very High)

**Risk:** unauthenticated or unauthorized use of API operations.

**Possible mitigations:**

- MT1-Solution: Apply `authMiddleware` (or equivalent) on every route that reads or changes sensitive data, with **deny-by-default** for new routes until protected.
- MT2-Solution: After authentication, enforce **authorization** (role and resource ownership, e.g. user id / supplier id), not only “has a valid token”.
- MT3-Solution: Maintain an explicit list of **public** routes (e.g. login/register) and review it when adding endpoints so sensitive actions are never left anonymous by mistake.

---

### R7 — Confidentiality in transit — HTTP without TLS (Very High)

**Risk:** passwords and JWTs readable on the network in cleartext.

**Possible mitigations:**

- MT4-Solution: Terminate **HTTPS/TLS** at a reverse proxy or load balancer (or enable TLS on the Node process in production) and redirect HTTP to HTTPS.
- MT5-Solution: Configure **HSTS** and modern TLS settings at the edge suitable for your deployment.
- MT6-Solution: Send credentials and JWTs only in **headers or body**, never in URL **query strings**, so they are less likely to leak via `Referer`, proxies, or access logs even when HTTPS is used.

---

### R2 — Inconsistent or weak JWT secrets (Medium High)

**Risk:** signing and verification out of sync, or predictable secrets.

**Possible mitigations:**

- MT7-Solution: Use **one** environment variable and **one** shared module for both signing and verifying JWTs so the secret cannot drift between files.
- MT8-Solution: **Remove** hardcoded fallbacks; **refuse to start** or refuse login if the secret is missing in production.
- MT9-Solution: Generate the secret with **cryptographic randomness** and sufficient length; keep it in env or a secrets manager, not in the repository.

---

### Tier 2 — Further mitigations (medium / lower priority)

The risks below are still valid and should be tracked, but they rank below Tier 1 in the assessment. They fit follow-on work, parallel tasks if the team has capacity, or verification passes once core controls for **R1**, **R7**, and **R2** are defined.

---

### R5 — No rate limiting on login; long-lived JWT without revocation (Medium)

**Risk:** brute force on login; stolen token valid for a long time.

**Possible mitigations:**

- MT10-Solution: Apply **rate limiting** to `POST /users/login` (and similar) per IP and/or account, with generic responses to callers.
- MT11-Solution: Shorten **access token lifetime**; if users need long sessions, add **refresh tokens** with rotation.
- MT12-Solution: Add **logout** and, if the product requires it, a **server-side denylist** or token version so stolen tokens can be invalidated.

---

### R4 — Files exposed on `/uploads` via static hosting (Medium)

**Risk:** anyone with a URL can fetch uploaded PDFs or other files.

**Possible mitigations:**

- MT13-Solution: Do not serve confidential uploads through **public** `express.static`; reserve static hosting for assets that are intentionally public.
- MT14-Solution: Serve sensitive files through an **authenticated** route that checks ownership or role before streaming.
- MT15-Solution: Store files under **unpredictable names** (e.g. UUID) and resolve access via database checks instead of guessable paths.

---

### R6 — PDF upload with MIME-only validation (Medium)

**Risk:** non-PDF or harmful content stored as if it were a PDF.

**Possible mitigations:**

- MT16-Solution: Validate **magic bytes** (PDF signature) after upload, not only the `Content-Type` header.
- MT17-Solution: Enforce a **maximum file size** with `express`/`multer` limits suited to real use cases.
- MT18-Solution: For higher assurance deployments, add **async antivirus** or content scanning (optional, cost-dependent).

---

### R8 — JSON body without explicit limit (Medium)

**Risk:** huge JSON bodies exhausting memory (DoS).

**Possible mitigations:**

- MT19-Solution: Set `express.json({ limit: '...' })` (and `urlencoded` if used) to a limit justified by the largest legitimate request.
- MT20-Solution: Enforce a matching **maximum body size** at the reverse proxy or load balancer so oversized payloads are rejected before the app.
- MT21-Solution: Set a reasonable **request timeout** at the proxy or Express so slow oversized uploads cannot tie up workers indefinitely.

---

### R3 — Information disclosure in HTTP 500 errors (Medium)

**Risk:** internal errors and stacks returned to the client.

**Possible mitigations:**

- MT22-Solution: Use a central error handler in production: generic message to the client, full detail only in server logs.
- MT23-Solution: Standardize error responses to a safe shape (example: code + short message) and avoid returning raw `err` objects.
- MT24-Solution: Review `catch` blocks across controllers so exception text and stack traces never leak in JSON responses.

---

### R9 — Debug logging with request data (Low)

**Risk:** sensitive data in server logs (separate channel from R3).

**Possible mitigations:**

- MT25-Solution: Do not log full **`req.body`** (or similar) in production; log identifiers only where possible.
- MT26-Solution: Use structured logging with redaction of sensitive fields in production.
- MT27-Solution: Restrict verbose or debug logging to non-production environments (e.g. `NODE_ENV` or a dedicated flag).

---

[Back to README](../README.md)

[Next file](asvs.md)

[Previous file](risk_assessment.md)
