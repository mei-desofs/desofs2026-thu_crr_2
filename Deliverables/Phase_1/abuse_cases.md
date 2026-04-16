[Voltar ao README](../README.md)

[Próximo ficheiro](risk_assessment.md)

[Ficheiro anterior](stride.md)

---
## Abuse Cases

### AC-01 — Access to another user's data via ID manipulation

| Field                     | Description                                                                                                                                                    |
|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Identifier**            | AC-01                                                                                                                                                          |
| **Malicious actor**       | Authenticated user (any role)                                                                                                                                  |
| **Preconditions**         | User has a valid session; other users' resources exist in the database                                                                                         |
| **Abuse flow**            | Attacker replaces resource ID in a GET/PUT request (e.g., /api/reservations/42 → /api/reservations/99) to access or modify another user's or canteen's data    |
| **Affected asset**        | Reservations, KPIs, menus, orders                                                                                                                              |
| **Impact**                | Exposure of third-party data; unauthorized modification of records                                                                                             |
| **Mitigations**           | Object-level authorization (IDOR protection): always verify that the resource belongs to the user/canteen from the JWT token; never trust only the received ID |
| **Security requirements** | SR-01 Object-level access control; SR-02 Ownership validation                                                                                                  |
| **Planned tests**         | Test GET/PUT of resources with a token from a user different from the owner; verify 403 response                                                               |

---

### AC-02 — Privilege escalation via API without role validation

| Field                     | Description                                                                                                                                                                                                                  |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Identifier**            | AC-02                                                                                                                                                                                                                        |
| **Malicious actor**       | Authenticated Supplier or Customer                                                                                                                                                                                           |
| **Preconditions**         | User has a valid JWT token with a low-privilege role                                                                                                                                                                         |
| **Abuse flow**            | Attacker invokes endpoints reserved for Network Admin or Canteen Manager (e.g., POST /api/suppliers/:id/quarantine, PUT /api/menus/:id/approve) using their own token, exploiting the absence of role checking in middleware |
| **Affected asset**        | Supplier management, menus, KPIs, quarantines                                                                                                                                                                                |
| **Impact**                | Critical operations performed by unauthorized actors; compromise of operational integrity                                                                                                                                    |
| **Mitigations**           | Role-based authorization middleware on all sensitive endpoints; principle of least privilege; review of exposed routes                                                                                                       |
| **Security requirements** | SR-03 Server-side RBAC; SR-04 Server-side JWT validation                                                                                                                                                                     |
| **Planned tests**         | Invoke each privileged endpoint with tokens from lower roles; verify 403 in all cases                                                                                                                                        |

---

### AC-03 — Unauthorized alteration of KPI results or menus

| Field                     | Description                                                                                                                                                              |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Identifier**            | AC-03                                                                                                                                                                    |
| **Malicious actor**       | Canteen Manager or user with incorrectly configured role                                                                                                                 |
| **Preconditions**         | Authenticated user with read access to KPIs or menus from another canteen                                                                                                |
| **Abuse flow**            | Attacker sends a PUT/PATCH request to a menu or KPI data belonging to another canteen, altering waste values, organic percentage, or menu status (e.g., forced approval) |
| **Affected asset**        | Menus, KPIs, waste data                                                                                                                                                  |
| **Impact**                | Tampering with operational and reporting data; incorrect decisions based on manipulated data                                                                             |
| **Mitigations**           | Mandatory canteen scoping for write operations; audit log of all changes with user, timestamp, and before/after values                                                   |
| **Security requirements** | SR-01 Object-level access control; SR-05 Audit log                                                                                                                       |
| **Planned tests**         | Attempt PUT on a menu from another canteen; verify 403 and no change in the database                                                                                     |

---

### AC-04 — Malicious file upload during application process

| Field                     | Description                                                                                                                                                                                                           |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Identifier**            | AC-04                                                                                                                                                                                                                 |
| **Malicious actor**       | Farmer / external candidate (unauthenticated or newly registered)                                                                                                                                                     |
| **Preconditions**         | Document upload endpoint accessible during the application process                                                                                                                                                    |
| **Abuse flow**            | Attacker submits a file with a .pdf extension but executable content (webshell, script), or a file with path traversal in the name (../../etc/passwd), for execution on the server or access to protected directories |
| **Affected asset**        | File server, server filesystem, application integrity                                                                                                                                                                 |
| **Impact**                | Remote code execution; access to server files; complete platform compromise                                                                                                                                           |
| **Mitigations**           | MIME type and magic bytes validation; filename sanitization (no path separators); storage outside webroot; size limits; content scanning                                                                              |
| **Security requirements** | SR-06 Upload validation; SR-07 File isolation                                                                                                                                                                         |
| **Planned tests**         | Upload files with incorrect extension, path traversal in name, and non-PDF content; verify rejection and no writing on the server                                                                                     |

---

### AC-05 — Unauthorized access to other suppliers' files

| Field                     | Description                                                                                                                    |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| **Identifier**            | AC-05                                                                                                                          |
| **Malicious actor**       | Authenticated Supplier                                                                                                         |
| **Preconditions**         | Document download endpoint exposes a predictable path (/uploads/suppliers/42/doc.pdf)                                          |
| **Abuse flow**            | Attacker iterates over supplier IDs in the download URL to access PDF documents (contracts, certificates) from other suppliers |
| **Affected asset**        | Confidential supplier documents                                                                                                |
| **Impact**                | Exposure of sensitive third-party data; privacy violation and potential GDPR non-compliance                                    |
| **Mitigations**           | Unpredictable filenames (UUID); ownership verification before download; never directly expose filesystem paths                 |
| **Security requirements** | SR-01 Object-level access control; SR-07 File isolation                                                                        |
| **Planned tests**         | Attempt to download a document with another supplier's ID; verify 403 and no content returned                                  |

---

### AC-06 — Submission of malicious data in inputs (injection)

| Field                     | Description                                                                                                                                          |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Identifier**            | AC-06                                                                                                                                                |
| **Malicious actor**       | Any authenticated user or external candidate                                                                                                         |
| **Preconditions**         | Free-text fields exist in forms (application, feedback, product name, comments)                                                                      |
| **Abuse flow**            | Attacker injects SQL payloads (' OR 1=1--), OS commands, or XSS scripts into input fields that are later processed or displayed without sanitization |
| **Affected asset**        | Database, other users (XSS), server (command injection)                                                                                              |
| **Impact**                | Data exfiltration or corruption; arbitrary code execution; session compromise of other users                                                         |
| **Mitigations**           | Parameterized ORM (Sequelize); backend input validation and sanitization; frontend output encoding; Content Security Policy                          |
| **Security requirements** | SR-08 Input sanitization; SR-09 Output encoding                                                                                                      |
| **Planned tests**         | Submit SQL and XSS payloads in all text fields; verify no execution and proper sanitization in the response                                          |

---

### AC-07 — Denial of service on critical operations

| Field                     | Description                                                                                                                                                            |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Identifier**            | AC-07                                                                                                                                                                  |
| **Malicious actor**       | External attacker or malicious authenticated user                                                                                                                      |
| **Preconditions**         | Weekly planning or order generation endpoints are accessible and lack rate limiting                                                                                    |
| **Abuse flow**            | Attacker sends hundreds of simultaneous requests to computationally heavy endpoints (planning generation, KPI calculation, report export), exhausting server resources |
| **Affected asset**        | Platform availability, critical management operations                                                                                                                  |
| **Impact**                | System unavailability during critical periods (weekly planning, meal reservations)                                                                                     |
| **Mitigations**           | Rate limiting by IP and by user; heavy operations processed in background (queue/cron); request timeouts; load monitoring                                              |
| **Security requirements** | SR-10 Rate limiting; SR-11 Async for heavy operations                                                                                                                  |
| **Planned tests**         | Send bursts of requests to planning and KPI endpoints; measure degradation and verify throttling application                                                           |

---

### AC-08 — Quarantine bypass via direct state manipulation

| Field                     | Description                                                                                                                                                           |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Identifier**            | AC-08                                                                                                                                                                 |
| **Malicious actor**       | Authenticated Supplier                                                                                                                                                |
| **Preconditions**         | Supplier is in active quarantine state; supplier state update endpoint is accessible                                                                                  |
| **Abuse flow**            | Supplier in quarantine tries to directly invoke PUT /api/suppliers/:id with {"quarantine": false} to remove their own quarantine status without manager authorization |
| **Affected asset**        | Sanitary integrity of meal planning                                                                                                                                   |
| **Impact**                | Products from a quarantined supplier enter meal planning; sanitary risk for users                                                                                     |
| **Mitigations**           | Quarantine field immutable by the supplier themselves; sanitary state changes restricted to Network Admin and Canteen Manager; mandatory audit log                    |
| **Security requirements** | SR-03 Server-side RBAC; SR-05 Audit log                                                                                                                               |
| **Planned tests**         | Attempt to change quarantine status with a Supplier token; verify 403 and state invariance                                                                            |

---

### AC-09 — Concealment of actions due to lack of proper logging

| Field                     | Description                                                                                                                                                                                          |
|---------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Identifier**            | AC-09                                                                                                                                                                                                |
| **Malicious actor**       | Internal user with privileges (Network Admin, Canteen Manager)                                                                                                                                       |
| **Preconditions**         | Sensitive operations do not generate audit log entries                                                                                                                                               |
| **Abuse flow**            | Internal user performs sensitive actions (approving an inappropriate supplier, removing quarantine, altering KPI data) without leaving a traceable record of the author, timestamp, and changed data |
| **Affected asset**        | Traceability, compliance, data integrity                                                                                                                                                             |
| **Impact**                | Inability to detect or investigate internal abuses; non-compliance with auditing requirements                                                                                                        |
| **Mitigations**           | Mandatory audit log (user, timestamp, action, before/after values) for all sensitive operations; immutable logs separate from the main database; alerts for anomalous actions                        |
| **Security requirements** | SR-05 Audit log; SR-12 Log immutability                                                                                                                                                              |
| **Planned tests**         | Execute sensitive operations and verify the existence, completeness, and immutability of the generated log entries                                                                                   |

[Voltar ao README](../README.md)

[Próximo ficheiro](risk_assessment.md)

[Ficheiro anterior](stride.md)