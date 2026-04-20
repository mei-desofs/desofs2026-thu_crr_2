[Voltar ao README](../README.md)

[Próximo ficheiro](threat_modeling.md)

[Ficheiro anterior](f_nf_requirements.md)

---
## Security Requirements

In this md file will be presented all security requirements justified (best practice, from threats identified,
regulatory, ...) and following a specified nomenclature e.g: **SR-xx**

### Authentication & access control

| Field             | Description                                                                                                      |
|-------------------|------------------------------------------------------------------------------------------------------------------|
| **Identifier**    | SR-01                                                                                                            |
| **Requirement**   | Object-level access control                                                                                      |
| **Definition**    | The system must enforce object-level access control to every request when accessing user resources               |
| **Justification** | Prevent attacks IDOR(Insecure Direct Object Reference) where users access other user's data by manipulating id's |
| **Linked items**  | TH-11, TH-14, TH-17, TH-18, TH-22, AC-01, AC-05, ASVS -v5.0.0 V2                                                 |

| Field             | Description                                                               |
|-------------------|---------------------------------------------------------------------------|
| **Identifier**    | SR-02                                                                     |
| **Requirement**   | Ownership validation                                                      |
| **Definition**    | The system must verify if the user owns or has permissions to modify data |
| **Justification** | Ensure users only change their own data                                   |
| **Linked items**  | TH-11, TH-18, ASVS -v5.0.0 V2                                             |

| Field             | Description                                                       |
|-------------------|-------------------------------------------------------------------|
| **Identifier**    | SR-03                                                             | 
| **Requirement**   | Server-side RBAC                                                  |
| **Definition**    | The system must have Role Based Access Control on the server side |
| **Justification** | All role verifications are done on the server side                |
| **Linked items**  | TH-01, TH-05, TH-06, TH-09, TH-22, ASVS -v5.0.0 V2                |

| Field             | Description                                                                         |
|-------------------|-------------------------------------------------------------------------------------|
| **Identifier**    | SR-04                                                                               |
| **Requirement**   | Server-side JWT validation                                                          |
| **Definition**    | The system must validate the token to ensure that the user can perform that request |
| **Justification** | Prevent token forgery                                                               |
| **Linked items**  | TH-01, TH-02, TH-06, TH-09, TH-10, ASVS -v5.0.0 V10                                 |

| Field             | Description                                     |
|-------------------|-------------------------------------------------|
| **Identifier**    | SR-15                                           |
| **Requirement**   | Secure password storage                         |
| **Definition**    | The system must never store plaintext passwords |
| **Justification** | Prevent credential theft                        |
| **Linked items**  | ASVS -v5.0.0 V6                                 |

| Field             | Description                                     |
|-------------------|-------------------------------------------------|
| **Identifier**    | SR-16                                           |
| **Requirement**   | Login attempt protection                        |
| **Definition**    | The system must prevent repeated login attempts |
| **Justification** | Prevents brute-force attacks                    |
| **Linked items**  | TH-04, ASVS -v5.0.0 V6                          |

| Field             | Description                                                              |
|-------------------|--------------------------------------------------------------------------|
| **Identifier**    | SR-17                                                                    |
| **Requirement**   | Token session invalidation                                               |
| **Definition**    | The system must revoke or invalidate tokens before their expiration time |
| **Justification** | Prevent continued access after logout                                    |
| **Linked items**  | ASVS -v5.0.0 V7                                                          |

### Data security 

| Field             | Description                                                                                                        |
|-------------------|--------------------------------------------------------------------------------------------------------------------|
| **Identifier**    | SR-06                                                                                                              |
| **Requirement**   | Upload validation                                                                                                  |
| **Definition**    | The system must validate uploaded data to ensure that it meets the requirements needed (type, size, content, etc.) |
| **Justification** | Prevent malicious file uploads                                                                                     |
| **Linked items**  | TH-15, ASVS -v5.0.0 V5                                                                                             |

| Field             | Description                                                                                      |
|-------------------|--------------------------------------------------------------------------------------------------|
| **Identifier**    | SR-07                                                                                            |
| **Requirement**   | File isolation                                                                                   |
| **Definition**    | All uploaded files must be stored in a safe location and without any permissions besides reading |
| **Justification** | Prevent unwanted file executions of untrusted files                                              |
| **Linked items**  | TH-15, TH-16, TH-17, ASVS -v5.0.0 V5                                                             |

### Communication (ASVS 5.0.0 V9, ASVS 5.0.0 V13)

| Field             | Description                    |
|-------------------|--------------------------------|
| **Identifier**    | SR-13                          |
| **Requirement**   | HTTPS Usage                    |
| **Definition**    | Every request must use https   |
| **Justification** | Protect data in transit        |
| **Linked items**  | TH-02, TH-20, ASVS -v5.0.0 V12 |

### Input validation and data handling 

| Field             | Description                                                                                            |
|-------------------|--------------------------------------------------------------------------------------------------------|
| **Identifier**    | SR-08                                                                                                  |
| **Requirement**   | Input sanitization                                                                                     |
| **Definition**    | The system must validate every input to ensure that matches domain logic before storing that same data |
| **Justification** | Prevent injection attacks                                                                              |
| **Linked items**  | TH-08, TH-14, ASVS -v5.0.0 V1                                                                          |

| Field             | Description                                                                         |
|-------------------|-------------------------------------------------------------------------------------|
| **Identifier**    | SR-09                                                                               |
| **Requirement**   | Output encoding                                                                     |
| **Definition**    | The system must encode all output data to the correct format (e.g: JSON, XML, etc.) |
| **Justification** | Prevent Cross-Site Scripting (XSS)                                                  |
| **Linked items**  | ASVS -v5.0.0 V1                                                                     |

### Third-party component

| Field             | Description                                                                                                                                                                       |
|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Identifier**    | SR-14                                                                                                                                                                             |
| **Requirement**   | Secret detection                                                                                                                                                                  |
| **Definition**    | The system must scan code repositories, configuration files, and other resources for sensitive information such as passwords, API keys, cryptographic keys, and other credentials |
| **Justification** | Prevents important credentials being displayed in repositories, etc.                                                                                                              |
| **Linked items**  | ASVS -v5.0.0 V6                                                                                                                                                                   |

### Logging and monitoring

| Field             | Description                                                                              |
|-------------------|------------------------------------------------------------------------------------------|
| **Identifier**    | SR-05                                                                                    |
| **Requirement**   | Audit log                                                                                |
| **Definition**    | The system must log all relevant and important events                                    |
| **Justification** | Enables faster response to incidents and better detection/investigation of possible bugs |
| **Linked items**  | TH-07, TH-12, TH-19, TH-23, ASVS -v5.0.0 V16                                             |

| Field             | Description                                                                 |
|-------------------|-----------------------------------------------------------------------------|
| **Identifier**    | SR-12                                                                       |
| **Requirement**   | Log immutability                                                            |
| **Definition**    | Logs must be protected against modification or deletion after being written |
| **Justification** | Ensure integrity of logs                                                    |
| **Linked items**  | ASVS -v5.0.0 V16                                                            |

### Availability 

| Field             | Description                                                    |
|-------------------|----------------------------------------------------------------|
| **Identifier**    | SR-10                                                          |
| **Requirement**   | Rate limiting                                                  |
| **Definition**    | The system must enforce rate limiting on critical endpoints    |
| **Justification** | Prevent brute force attacks and DOS(Denial-of-Service) attacks |
| **Linked items**  | TH-04, TH-13, TH-21, ASVS -v5.0.0 V4                           |

| Field             | Description                                           |
|-------------------|-------------------------------------------------------|
| **Identifier**    | SR-11                                                 |
| **Requirement**   | Async for heavy operations                            |
| **Definition**    | Intensive operations must be processed asynchronously |
| **Justification** | Stops system blocking                                 |
| **Linked items**  | TH-13, ASVS -v5.0.0 V4                                |

---

[Voltar ao README](../README.md)

[Próximo ficheiro](threat_modeling.md)

[Ficheiro anterior](f_nf_requirements.md)