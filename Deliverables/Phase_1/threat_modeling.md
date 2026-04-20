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

---
[Voltar ao README](../README.md)

[Próximo ficheiro](stride.md)

[Ficheiro anterior](security_requirements.md)