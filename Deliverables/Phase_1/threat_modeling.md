[Voltar ao README](../README.md)

[Próximo ficheiro](stride.md)

[Ficheiro anterior](security_requirements.md)

---
## Threat Modeling

### Information Gathering


| Field            | Description                                                                                                                                                                                                                                                                         |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Entry points** | POST `/users/login` authentication<br>POST `/applications` file upload — public<br>All REST API routes under `/api/*` authenticated                                                                                                                                                 |
| **Exit points**  | HTTP JSON responses<br>GET `/uploads/*` static file serving<br>`console.log` output to stdout<br>Application log files                                                                                                                                                              |
| **Assets**       | User credentials and JWT tokens<br>Personal data names, emails — GDPR-sensitive<br>Supplier confidential documents PDFs<br>Menus, meals, recipes and nutritional data<br>KPIs, waste reports and performance statistics<br>Server filesystem `upload` directory<br>MySQL database   |
| **Trust levels** | Level 0 — Unauthenticated/public registration/login<br>Level 1 — Authenticated Customer/Supplier<br>Level 2 — Canteen/Refectory Manager<br>Level 3 — Dietician/Stock Manager<br>Level 4 — Network Admin/full trust                                                                  |---

### Data Flow Diagrams

[Voltar ao README](../README.md)

[Próximo ficheiro](stride.md)

[Ficheiro anterior](security_requirements.md)