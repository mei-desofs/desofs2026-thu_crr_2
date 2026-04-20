[Voltar ao README](../README.md)

[Próximo ficheiro](security_requirements.md)

[Ficheiro anterior](system_overview.md)

---
## Requirements

This section defines, in a structured manner, the behavior and constraints of the BioCantinas system.

The requirements are organized into functional and non-functional requirements, each uniquely identified and described using verifiable language.

---

## Functional Requirements

Functional requirements describe the behavior of the BioCantinas system, identifying the actors involved and the data manipulated.

### FR1 – User Authentication
**Actor:** User (all profiles)  
**Description:** The system must allow a user to authenticate using valid credentials (email and password).  
**Data:** access credentials, session token

---

### FR2 – User and Profile Management
**Actor:** Network Manager  
**Description:** The system must allow the creation, editing, consultation and deactivation of users and their respective profiles (dietician, supplier, manager, etc.).  
**Data:** name, email, profile, account status

---

### FR3 – Supplier Management
**Actor:** Network Manager  
**Description:** The system must allow the management of suppliers, including approval, editing, quarantine and consultation.  
**Data:** supplier data, location (parish), status (active/quarantine)

---

### FR4 – Product and Ingredient Management
**Actor:** Supplier / Stock Manager  
**Description:** The system must allow the registration, update and consultation of available products and ingredients.  
**Data:** product name, quantity, unit, origin, organic indicator

---

### FR5 – Menu and Meal Management
**Actor:** Dietician  
**Description:** The system must allow the creation, editing, approval and publication of menus and meals.  
**Data:** menu, meals, recipes, ingredients, menu status

---

### FR6 – Reservation Submission and Update
**Actor:** Customer (school/nursing home)  
**Description:** The system must allow the creation, update and cancellation of meal reservations.  
**Data:** user, meal, date, quantity

---

### FR7 – Order and Planning Management
**Actor:** Stock Manager  
**Description:** The system must calculate product requirements and generate orders based on planning and reservations.  
**Data:** planning, stock, products, quantities

---

### FR8 – Indicator Calculation and Consultation (equivalent to "classification")
**Actor:** Canteen Manager / Network Manager  
**Description:** The system must calculate and provide KPIs, including food waste, percentage of organic products and operational performance.  
**Data:** meals, ingredients, waste, aggregated metrics

---

### FR9 – Persistent Data and File Management
**Actor:** System  
**Description:** The system must store and organize persistent data in a database, including records of menus, reservations, suppliers and statistics.  
**Data:** all system data

---

Each functional requirement is defined so as to allow traceability with use cases, DFDs and abuse cases.

---

## Non-Functional Requirements

Non-functional requirements define properties and constraints of the system that influence its design and implementation.

---

### NFR1 – API-Based Architecture
The system must be based on a service architecture exposed through REST APIs, enabling communication between frontend and backend.

---

### NFR2 – Relational Database Persistence
The system must use a relational database to ensure data consistency and integrity.

---

### NFR3 – Component-Based Organisation
The system must be structured into well-defined components (frontend, backend, services, database), ensuring separation of concerns.

---

### NFR4 – Documentary Clarity and Traceability
The system documentation must be clear, structured and enable traceability between requirements, DFDs, threats and tests.

---

### NFR5 – Consistency Between Artefacts
All produced artifacts (requirements, diagrams, code and tests) must be consistent with one another.

---

### NFR6 – Correct Notation in DFDs
DFDs must use formal and consistent notation, allowing the correct representation of data flows.

---

### NFR7 – Repository Organisation
The project repository must be clearly structured, including code, documentation and execution instructions.

---

[Voltar ao README](../README.md)

[Próximo ficheiro](security_requirements.md)

[Ficheiro anterior](system_overview.md)