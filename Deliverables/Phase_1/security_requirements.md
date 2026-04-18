[Voltar ao README](../README.md)

[Próximo ficheiro](threat_modeling.md)

[Ficheiro anterior](f_nf_requirements.md)

---
## 4.3 Security Requirements

In this md file will be presented all security requirements justified (best practice, from threats identified,
regulatory, ...) and following a specified nomenclature e.g: **SR-xx**

### Authentication & access control

| Field           | Description                                                                                        |
|-----------------|----------------------------------------------------------------------------------------------------|
| **Identifier**  | SR-01                                                                                              |
| **Requirement** | Object-level access control                                                                        |
| **Definition**  | The system must enforce object-level access control to every request when accessing user resources |

| Field           | Description                                                               |
|-----------------|---------------------------------------------------------------------------|
| **Identifier**  | SR-02                                                                     |
| **Requirement** | Ownership validation                                                      |
| **Definition**  | The system must verify if the user owns or has permissions to modify data |

| Field           | Description                                                       |
|-----------------|-------------------------------------------------------------------|
| **Identifier**  | SR-03                                                             |
| **Requirement** | Server-side RBAC                                                  |
| **Definition**  | The system must have Role Based Access Control on the server side |

| Field           | Description                                                                         |
|-----------------|-------------------------------------------------------------------------------------|
| **Identifier**  | SR-04                                                                               |
| **Requirement** | Server-side JWT validation                                                          |
| **Definition**  | The system must validate the token to ensure that the user can perform that request |

### Data security

| Field           | Description                                                                                      |
|-----------------|--------------------------------------------------------------------------------------------------|
| **Identifier**  | SR-07                                                                                            |
| **Requirement** | File isolation                                                                                   |
| **Definition**  | All uploaded files must be stored in a safe location and without any permissions besides reading |

### Communication

| Field           | Description                  |
|-----------------|------------------------------|
| **Identifier**  | SR-13                        |
| **Requirement** | HTTPS Usage                  |
| **Definition**  | Every request must use https |

### Input validation and data handling

| Field           | Description                                                                                                        |
|-----------------|--------------------------------------------------------------------------------------------------------------------|
| **Identifier**  | SR-06                                                                                                              |
| **Requirement** | Upload validation                                                                                                  |
| **Definition**  | The system must validate uploaded data to ensure that it meets the requirements needed (type, size, content, etc.) |

| Field           | Description                                                                                            |
|-----------------|--------------------------------------------------------------------------------------------------------|
| **Identifier**  | SR-08                                                                                                  |
| **Requirement** | Input sanitization                                                                                     |
| **Definition**  | The system must validate every input to ensure that matches domain logic before storing that same data |

| Field           | Description                                                                         |
|-----------------|-------------------------------------------------------------------------------------|
| **Identifier**  | SR-09                                                                               |
| **Requirement** | Output encoding                                                                     |
| **Definition**  | The system must encode all output data to the correct format (e.g: JSON, XML, etc.) |

### Third-party component

| Field           | Description                                                                                                                                                                       |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Identifier**  | SR-14                                                                                                                                                                             |
| **Requirement** | Secret detection                                                                                                                                                                  |
| **Definition**  | The system must scan code repositories, configuration files, and other resources for sensitive information such as passwords, API keys, cryptographic keys, and other credentials |

### Logging and monitoring

| Field           | Description                                           |
|-----------------|-------------------------------------------------------|
| **Identifier**  | SR-05                                                 |
| **Requirement** | Audit log                                             |
| **Definition**  | The system must log all relevant and important events |

### Availability

| Field           | Description                                                 |
|-----------------|-------------------------------------------------------------|
| **Identifier**  | SR-10                                                       |
| **Requirement** | Rate limiting                                               |
| **Definition**  | The system must enforce rate limiting on critical endpoints |

| Field           | Description                                           |
|-----------------|-------------------------------------------------------|
| **Identifier**  | SR-11                                                 |
| **Requirement** | Async for heavy operations                            |
| **Definition**  | Intensive operations must be processed asynchronously |

---

[Voltar ao README](../README.md)

[Próximo ficheiro](threat_modeling.md)

[Ficheiro anterior](f_nf_requirements.md)