[Voltar ao README](../README.md)

---

# Input Validation - Schemas in Endpoints & Operations

## 1. Validation Architecture

Input validation was implemented using **Joi** and applied in **two layers** (defence in depth). The flow per request:

```
Request
 ├── apiRateLimiter           ← rate limiting (15 min / 1000 req)
 ├── authMiddleware           ← JWT verification
 ├── validate(schema, source) ← LAYER 1: route middleware (early reject)
 ├── authorizeRoles(...)      ← role-based access control
 └── Controller.handler
      └── validateOrFail(...) ← LAYER 2: in-controller (depth)
           └── service.xxx()
```

- **Layer 1** (`validate` middleware) is the canonical line of defence. It rejects malformed input before it reaches the controller, the service, the database, or any business logic.
- **Layer 2** (`validateOrFail` helper) protects against:
    - A route being added without the middleware (developer mistake)
    - Direct controller invocation from tests or internal flows
    - Bypass of the express router (extremely rare, but cheap to defend)

Both layers share the **same schemas** and produce **the same error shape**, so error handling on the client is consistent regardless of which layer rejects.

---

## 2. Implemented Files

### `src/middlewares/validate.ts` - Reusable Validation Middleware

Middleware that takes a Joi schema and a source (`"body" | "params" | "query"`), validates the request, and either passes control to the next handler or returns a `400 Validation failed` response.

**Behaviour:**

| Joi option | Value | Reason |
|---|---|---|
| `abortEarly` | `false` | Returns **all** errors at once, not just the first - better UX for forms |
| `convert` | `true` | Auto-coerces compatible types (e.g. `"42"` → `42`) so controllers receive clean values |
| Unknown keys | **rejected by default** (Joi's `.object()` default) | Mitigates mass-assignment (OWASP API8) |

**Behaviour per source:**

- `body`: re-assigns the coerced value back to `req.body`
- `params`: applies coerced values into `req.params` via `Object.assign`
- `query`: validates but does **not** reassign (Express 5's `req.query` is read-only)

**Error response shape:**
```json
{
  "error": "Validation failed",
  "details": [
    { "field": "name", "message": "\"name\" is required" },
    { "field": "email", "message": "\"email\" must be a valid email" }
  ]
}
```

---

### `src/utils/validateOrFail.ts` - In-Controller Validation Helper

Lightweight wrapper around `schema.validate()` that returns either `{ ok: true, value }` or `{ ok: false }` after writing a `400` response. Used inside controllers as a second line of defence.

**Typical usage:**
```ts
const v = validateOrFail(createBatchSchema, req.body, res);
if (!v.ok) return;
const result = await service.createBatch(v.value);
```

Same error shape as the middleware - the client sees the same `{ error, details }` payload regardless of which layer rejects.

---

### `src/Schemas/common.validation.ts` - Reusable Building Blocks

Shared schemas used across multiple routes for path parameters:

| Schema | Used by |
|---|---|
| `idParamSchema` | All `/:id` endpoints (numeric, positive) |
| `userIdParamSchema` | `/users/:userId`, `/notifications/user/:userId` |
| `applicationIdParamSchema` | `/applications/:applicationId/*` |
| `canteenIdParamSchema` | `/canteens/:canteenId/*` |
| `mealIdParamSchema` | `/waste-reports/meal/:mealId` |
| `applicationDocumentParamSchema` | `/applications/:applicationId/documents/:filename` (filename restricted to `^[A-Za-z0-9._-]+$` to mitigate path traversal) |

---

### `src/Schemas/UserValidation.ts` - Role-Conditional Validation

The most expressive schema in the project. Uses Joi `.when()` to enforce **business rules at the validation layer**:

| Role | `refeitorioId` | `canteenId` |
|---|---|---|
| `Student`, `NursingHome`, `Visitor`, `Supplier`, `NetworkManager` | forbidden | forbidden |
| `RefectoryManager`, `RefectoryStaff` | **required** | forbidden |
| `CanteenManager` | forbidden | **required** |

This means an attacker (or buggy client) cannot register a `Student` with a `refeitorioId` to gain access to a refectory's resources - the schema rejects it before any business logic runs.

Other constraints enforced:
- `password`: 8-128 characters
- `email`: valid format, max 150 chars
- `role`: must be one of the values in the `Role` enum from `Config/roles.ts`

---

### Per-Domain Schemas

Each business domain has its own schema file:

| File | Purpose |
|---|---|
| `BatchValidation.ts` | Stock batches (expiration > now, positive quantities) |
| `DishValidation.ts` | Dish creation with main products array |
| `IngredientValidation.ts` | Ingredients with unit + quantity |
| `MealValidation.ts` | Meals with future date constraint |
| `MenuValidation.ts` | Weekly menus + `updateMenuStatusSchema` for status transitions |
| `ParishValidation.ts` | Parishes (name only) |
| `RecipeValidation.ts` | Recipes with description length bounds |
| `StockValidation.ts` | Stock with min/max capacity invariants |
| `product.validation.ts` | Products with nutrition and allergens arrays |
| `ReservationValidation.ts` | Reservations + status enum + ticket lifting |
| `OrderValidation.ts` | Orders + status transitions enum |
| `NeededProductValidation.ts` | Procurement needs |
| `WasteReportValidation.ts` | Waste reports + statistics query filters |
| `NotificationValidation.ts` | Push notifications (title/body length caps) |
| `CanteenValidation.ts` | Canteens + refectory associations |
| `InstitutionValidation.ts` | Institutions |
| `RefeitorioValidation.ts` | Refectories |
| `StatisticsValidation.ts` | Query parameter filters for performance/producer statistics |
| `ApplicationValidation.ts` | Farmer applications (consolidated from inline schema) |
| `AuxiliarValidation.ts` | Generic type / unit creators (consolidated from inline) |
| `FarmerProductValidation.ts` | Weekly farmer product bundles (consolidated from inline) |

---

## 3. Validation Coverage

Applied to **all 23 routes** in the application:

| Routes | Body | Params | Query |
|---|:---:|:---:|:---:|
| ApplicationRoutes (multipart - body validated in controller) | ✓ | ✓ | — |
| AuxiliarRoutes | ✓ | — | — |
| BatchRoutes | ✓ | ✓ | — |
| CanteenRoutes | ✓ | ✓ | — |
| DishRoutes | ✓ | ✓ | — |
| FarmerProductRoutes | ✓ | ✓ | — |
| IngredientRoutes | ✓ | ✓ | — |
| InstitutionRoutes | ✓ | ✓ | — |
| MealRoutes | ✓ | ✓ | ✓ |
| MenuRoutes | ✓ | ✓ | ✓ |
| NeededProductRoutes | ✓ | ✓ | — |
| NotificationRoutes | ✓ | ✓ | ✓ |
| OrderRoutes | ✓ | ✓ | — |
| ParishRoute | ✓ | ✓ | — |
| PerformanceRoutes | — | — | ✓ |
| ProducerStatisticsRoutes | — | — | ✓ |
| ProductRoutes | ✓ | ✓ | — |
| RecipeRoutes | ✓ | ✓ | — |
| RefeitorioRoutes | ✓ | ✓ | — |
| ReservationRoutes | ✓ | ✓ | ✓ |
| StatisticsRoutes | — | — | — |
| StockRoutes | ✓ | ✓ | — |
| UserRoutes | ✓ | ✓ | — |
| WasteReportRoutes | ✓ | ✓ | ✓ |

In total: **18 controllers** were refactored to use `validateOrFail` in addition to the middleware layer.

---

## 4. Threat Mitigations

Complete reference of attack classes mitigated by this layer:

| Threat | Mitigation | Example |
|---|---|---|
| **Injection (OWASP A03)** | Strong type enforcement on every input. Numeric IDs must pass `Joi.number().integer().positive()` - rejects `?id=1' OR '1'='1` before it reaches the ORM. | `GET /api/batches/abc` → `400 Validation failed` |
| **Mass Assignment (OWASP API8)** | Joi's `.object()` rejects unknown keys by default. A client cannot inject extra fields like `isAdmin`, `status`, `createdBy`, etc. | `POST /api/users/register` with `{ ..., isAdmin: true }` → `400` rejecting `isAdmin` |
| **Path Traversal** | The `filename` param in `/applications/:applicationId/documents/:filename` is constrained to `^[A-Za-z0-9._-]+$`. Slashes and `..` cannot pass. | `GET /api/applications/1/documents/../../etc/passwd` → `400 Validation failed` |
| **Type Confusion** | Schemas reject string-where-number, undefined-where-required, etc. Controllers receive validated/coerced values via `req.body` re-assignment. | `quantity: "abc"` → `400`; `quantity: "3"` → coerced to `3` |
| **Business Rule Bypass** | Role-conditional schemas (`.when()`) enforce domain constraints at the validation layer, not as scattered `if` checks across controllers. | `Student` with `refeitorioId` → `400 "refeitorioId is not allowed"` |
| **Payload-based DoS** | Length caps on strings and arrays - `name` ≤ 150 chars, `body` ≤ 2000 chars, `quantity` ≤ 1000, `meals[]` ≤ N items. | `POST /api/notifications` with 10MB body → `400` |
| **Past-date Inputs** | `Joi.date().greater("now")` on critical dates. | Creating a `Batch` with past `expirationDate` → `400` |
| **Enum Bypass** | Status fields validated against fixed enums (no more manual `allowedStatus.includes(...)` checks that could drift). | `PATCH /api/orders/:id/status` with `{ status: "weird" }` → `400` |

---

## 5. Testing

Three new test files were added under `test/UnitTests/validation/`:

| File | Tests | Coverage |
|---|---:|---|
| `validate.middleware.test.ts` | 6 | success path, all-errors aggregation, unknown key rejection, params coercion, invalid params, query read-only safety |
| `user.schema.test.ts` | 14 | every role's required/forbidden combinations, email format, password length, unknown role, unknown keys |
| `reservation.schema.test.ts` | 12 | minimal/full payloads, negative IDs, unknown status enum values, quantity bounds (0, 1001) |

Pre-existing schema tests (`dish.schema.test.ts`, `meal.schema.test.ts`, `menu.schema.test.ts`) and all 16 controller integration tests continue to pass unchanged.

**Final result:** `314 / 314` tests pass with `JWT_SECRET="test" npx vitest run`.

---

## 6. Error Response Reference

Examples of what the client receives for each rejection type:

**Missing required fields:**
```json
POST /api/batches
{ "productId": 1 }

→ 400
{
  "error": "Validation failed",
  "details": [
    { "field": "expirationDate", "message": "\"expirationDate\" is required" },
    { "field": "quantity", "message": "\"quantity\" is required" },
    { "field": "unitId", "message": "\"unitId\" is required" },
    { "field": "bio", "message": "\"bio\" is required" }
  ]
}
```

**Unknown keys (mass assignment attempt):**
```json
POST /api/products
{ "name": "Pão", "typeId": 1, "unitId": 1, "nutrition": [...], "allergens": [...], "isAdmin": true }

→ 400
{
  "error": "Validation failed",
  "details": [
    { "field": "isAdmin", "message": "\"isAdmin\" is not allowed" }
  ]
}
```

**Role-conditional rejection:**
```json
POST /api/users/register
{ "name": "X", "email": "x@x.pt", "password": "12345678", "role": "RefectoryManager" }

→ 400 { "message": "refeitorioId é obrigatório para RefectoryManager e RefectoryStaff." }
```

> Note: `UserController.register` keeps its original Portuguese messages for compatibility with the frontend and existing tests, but the full Joi validation still runs underneath.

**Invalid path parameter:**
```json
GET /api/batches/abc

→ 400
{
  "error": "Validation failed",
  "details": [
    { "field": "id", "message": "\"id\" must be a number" }
  ]
}
```

---

## 7. Migration Notes

Before this delivery, validation was inconsistent across the codebase:

- Some endpoints used `Joi.validate(req.body)` inline in the controller (≈9 schemas)
- Some used manual checks: `if (!campo)`, `if (typeof x !== "number")`
- Some used hard-coded arrays: `if (!allowedStatus.includes(status))`
- Path parameters were validated with ad-hoc `isNaN(id)` checks

After this delivery:

- **All input validation is declarative** in `Backend/src/Schemas/`
- **All routes** apply the middleware uniformly
- **All controllers** use the same helper (`validateOrFail`) for defence in depth
- Error responses are consistent across the entire API
- Adding a new endpoint requires writing a schema - it cannot accidentally ship without validation

The `MenuValidation.ts` file was also extended with `updateMenuStatusSchema` and `currentWeekMenuQuerySchema`, fixing a pre-existing compilation error (`MenuRoutes.ts` was importing schemas that did not exist).

---

[Voltar ao README](../README.md)