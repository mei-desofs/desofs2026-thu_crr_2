[Voltar ao README](../README.md)

[Próximo ficheiro](stride.md)

[Ficheiro anterior](security_requirements.md)

---
## Threat Modeling

Threat modeling was performed to identify potential security risks in the system before defining concrete security requirements and countermeasures. This analysis focuses on understanding how the system is structured, where users and external actors interact with it, which assets need protection, and where trust boundaries exist.

The process starts with an information gathering phase, followed by the creation of Data Flow Diagrams (DFDs) and the application of the STRIDE methodology to classify and analyse threats.

### Information Gathering


| Field            | Description                                                                                                                                                                                                                                                                         |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Entry points** | POST `/users/login` authentication<br>POST `/applications` file upload — public<br>All REST API routes under `/api/*` authenticated                                                                                                                                                 |
| **Exit points**  | HTTP JSON responses<br>GET `/uploads/*` static file serving<br>`console.log` output to stdout<br>Application log files                                                                                                                                                              |
| **Assets**       | User credentials and JWT tokens<br>Personal data names, emails — GDPR-sensitive<br>Supplier confidential documents PDFs<br>Menus, meals, recipes and nutritional data<br>KPIs, waste reports and performance statistics<br>Server filesystem `upload` directory<br>MySQL database   |
| **Trust levels** | Level 0 — Unauthenticated/public registration/login<br>Level 1 — Authenticated Customer/Supplier<br>Level 2 — Canteen/Refectory Manager<br>Level 3 — Dietician/Stock Manager<br>Level 4 — Network Admin/full trust                                                                  |---

### Data Flow Diagrams

#### Data Flow Diagram - Level 0

![dfd-level0.png](assets/dfd-level0.png)

#### Data Flow Diagram - Level 1

![dfd-level1.png](assets/dfd-level1.png)

#### Data Flow Diagram - Level 2 - Process 1 (Authentication)

![dfd-level2p1.png](assets/dfd-level2p1.png)

#### Data Flow Diagram - Level 2 - Process 2 (File Upload)

![dfd-level2p2.png](assets/dfd-level2p2.png)

## Trust Boundaries

A Trust Boundary is a logical or physical boundary that separates two contexts with different trust levels. Any data crossing such a boundary must be validated, authenticated, or authorized. It cannot be assumed to come from a trustworthy source.

In the DFD's above, the Trust Boundaries are represented by the dashed lines that divides each diagram, everything on the left side is in a lower trust zone (external/public), everything to the right is inside the application's controlled perimeter.

The following Trust Boundaries were identified in this system:

| ID       | Trust Boundary                           | Separation                                                                                                                                                                                      | DFD Element                                        |
|----------|------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------|
| **TB-1** | Internet → Express API                   | Separates unauthenticated external actors (Level 0) from the application entry point. All inbound traffic must be treated as untrusted.                                                         | External Entity (Candidate / User) → Routes        |
| **TB-2** | Authenticated user → Protected resources | Separates a valid JWT (Level 1–3) from operations that require role-based authorization. Being authenticated does not imply being authorized.                                                   | RBAC Middleware → Business processes (P3–P7)       |
| **TB-3** | Application → MySQL database             | Separates business logic from the data store. No query should reach the database without going through the ORM (Sequelize) layer.                                                               | Controllers → DS-1 MySQL                           |
| **TB-4** | Application → Filesystem (`/uploads`)    | Separates the controlled upload pipeline (`multer → diskStorage`) from the file data store. Files written here are potentially reachable via `express.static` without any authentication check. | `diskStorage` / `express.static` → DS-5 `/uploads` |

---
[Voltar ao README](../README.md)

[Próximo ficheiro](stride.md)

[Ficheiro anterior](security_requirements.md)