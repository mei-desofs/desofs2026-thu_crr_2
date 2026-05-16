[Voltar ao README](../README.md)

---
# Group Code Practices

This document defines the coding conventions adopted across the project. All team members followed these standards to ensure consistency, readability, and maintainability throughout the codebase.

---

## 1. Self-Explanatory Method Names

Method names must clearly describe what they do - no abbreviations, no vague names like `handle`, `process`, or `doStuff`. A reader should understand the method's purpose without reading its body.

**Good examples from our codebase:**

```ts
// UserService.ts
static async findByEmail(email: string) { ... }
static async startQuarantine(id: number) { ... }

// MenuService.ts
async getCurrentWeekMenuDetailed(menuTypeId?: number, weekOffset: number = 0) { ... }
async updateMenuStatus(id: number, status: "published" | "aproved" | "pending") { ... }
```

**Reference files:**
- [`/Backend/src/Service/UserService.ts`](/ Backend/src/Service/UserService.ts)
- [`/Backend/src/Service/MenuService.ts`](/Backend/src/Service/MenuService.ts)

---

## 2. Self-Explanatory Variable Names

Variables must be named after what they represent. Avoid single letters (except loop indexes like `i`), cryptic abbreviations, or generic names like `data`, `temp`, or `x`.

**Good examples from our codebase:**

```ts
// MenuService.ts
const mondayOfCurrentWeek = new Date(today);
const allergenNames = new Set<string>();
const nutritionAgg = new Map<number, number>();

// DishService.ts
const recommendationList: { dish: any; score: number }[] = [];
let productsCounter = 0;
```

**Reference files:**
- [`/Backend/src/Service/MenuService.ts`](/Backend/src/Service/MenuService.ts)
- [`/Backend/src/Service/DishService.ts`](/Backend/src/Service/DishService.ts)

---

## 3. Service Naming Convention - `<Model>Service`

Every service file must be named after the model it manages, following the pattern `<Model>Service`. The class inside must follow the same name.

```
Model: Menu      → Service: MenuService      (MenuService.ts)
Model: User      → Service: UserService      (UserService.ts)
Model: Dish      → Service: DishService      (DishService.ts)
Model: Order     → Service: OrderService     (OrderService.ts)
```

**Good examples from our codebase:**

```ts
// MenuService.ts
export class MenuService { ... }

// UserService.ts
export class UserService { ... }
```

**Reference files:**
- [`/Backend/src/Service/MenuService.ts`](/Backend/src/Service/MenuService.ts)
- [`/Backend/src/Service/UserService.ts`](/Backend/src/Service/UserService.ts)

---

## 4. Controller Naming Convention - `<Model>Controller`

Every controller must be named after the model it handles, following the pattern `<Model>Controller`. The controller imports and uses the corresponding service.

```
Model: Menu  → Controller: MenuController  (MenuController.ts)
Model: Dish  → Controller: DishController  (DishController.ts)
```

**Good examples from our codebase:**

```ts
// MenuController.ts
import { MenuService } from "../Service/MenuService";
export class MenuController { ... }

// DishController.ts
import { DishService } from "../Service/DishService";
export class DishController { ... }
```

**Reference files:**
- [`/Backend/src/Controller/MenuController.ts`](/Backend/src/Controller/MenuController.ts)
- [`/Backend/src/Controller/DishController.ts`](/Backend/src/Controller/DishController.ts)

---

## 5. Routes Naming Convention - `<Model>Routes`

Route files must follow the same naming pattern: `<Model>Routes`. Each route file must import only the corresponding controller.

```
Model: Menu  → Routes: MenuRoutes  (MenuRoutes.ts)
Model: User  → Routes: UserRoutes  (UserRoutes.ts)
Model: Dish  → Routes: DishRoutes  (DishRoutes.ts)
```

**Good examples from our codebase:**

```ts
// MenuRoutes.ts
import { MenuController } from "../Controller/MenuController";
router.post("/", MenuController.createMenu);
router.get("/", MenuController.listMenus);

// UserRoutes.ts
import { UserController } from "../Controller/UserController";
router.post("/register", UserController.register);
router.post("/login", UserController.login);
```

**Reference files:**
- [`/Backend/src/Routes/MenuRoutes.ts`](/Backend/src/Routes/MenuRoutes.ts)
- [`/Backend/src/Routes/UserRoutes.ts`](/Backend/src/Routes/UserRoutes.ts)

---

## 6. Model Naming Convention

Model files must be named after the entity they represent (PascalCase, singular). The Sequelize class and interface must share the same name.

```
Entity: Menu  → File: Menu.ts  → Class: Menu
Entity: User  → File: User.ts  → Class: User
```

**Good examples from our codebase:**

```ts
// Menu.ts
export interface MenuAttributes { ... }
export class Menu extends Model<MenuAttributes, MenuCreationAttributes> { ... }

// User.ts
interface UserAttributes { ... }
export class User extends Model<UserAttributes, UserCreationAttributes> { ... }
```

**Reference files:**
- [`/Backend/src/Model/Menu.ts`](/Backend/src/Model/Menu.ts)
- [`/Backend/src/Model/User.ts`](/Backend/src/Model/User.ts)

---

## 7. Controller Methods Call the Corresponding Service

A controller method must never contain business logic. It handles the HTTP layer only - reading request data, calling the service, and sending the response. All logic lives in the service.

**Good examples from our codebase:**

```ts
// MenuController.ts
static async getMenu(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid ID" });
    try {
        const menu = await service.getMenuById(id); // delegates to service
        res.json(menu);
    } catch (err: any) {
        if (err.message === "MENU_NOT_FOUND")
            return res.status(404).json({ error: "Menu not found" });
        res.status(500).json({ error: "Internal server error" });
    }
}

// UserController.ts
static async login(req: Request, res: Response) {
    try {
        const { email, password } = req.body;
        const user = await UserService.login(email, password); // delegates to service
        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1d" });
        res.json({ message: "Login bem-sucedido", user, token });
    } catch (err: any) {
        res.status(400).json({ message: err.message || "Erro ao fazer login" });
    }
}
```

**Reference files:**
- [`/Backend/src/Controller/MenuController.ts`](/Backend/src/Controller/MenuController.ts)
- [`/Backend/src/Controller/UserController.ts`](/Backend/src/Controller/UserController.ts)

---

## 8. Error Handling - Throw in Service, Catch in Controller

Services must throw meaningful string errors (e.g., `"MENU_NOT_FOUND"`). Controllers must catch those errors and map them to appropriate HTTP status codes. Never return HTTP responses from inside a service.

**Good examples from our codebase:**

```ts
// MenuService.ts - throws a descriptive error
async getMenuById(id: number) {
    const menu = await Menu.findByPk(id);
    if (!menu) throw new Error("MENU_NOT_FOUND");
    return menu;
}

// MenuController.ts - maps the error to HTTP
} catch (err: any) {
    if (err.message === "MENU_NOT_FOUND")
        return res.status(404).json({ error: "Menu not found" });
    res.status(500).json({ error: "Internal server error" });
}
```

**Reference files:**
- [`/Backend/src/Service/DishService.ts`](/Backend/src/Service/DishService.ts)
- [`/Backend/src/Controller/DishController.ts`](/Backend/src/Controller/DishController.ts)

---

## 9. Middleware Naming and Single Responsibility

Middleware files must be named after their responsibility and do one thing only. Authentication and authorization are separated into different files.

**Good examples from our codebase:**

```ts
// authMiddleware.ts - verifies the JWT token
export const authMiddleware = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token não fornecido" });
    // ...verifies and attaches user to req
    next();
};

// authorizeRoles.ts - checks if the user has the required role
export const authorizeRoles = (...roles: string[]) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role))
            return res.status(403).json({ message: "Sem permissão para aceder" });
        next();
    };
};
```

**Reference files:**
- [`/Backend/src/middlewares/authMiddleware.ts`](/Backend/src/middlewares/authMiddleware.ts)
- [`/Backend/src/middlewares/authorizeRoles.ts`](/Backend/src/middlewares/authorizeRoles.ts)

---

## 10. Consistent File Structure

Every domain entity must have its own set of files following this exact structure:

```
/Backend/src/
├── Model/         → <Model>.ts
├── Service/       → <Model>Service.ts
├── Controller/    → <Model>Controller.ts
└── Routes/        → <Model>Routes.ts
```

The layer dependency goes in one direction only:

```
Routes → Controller → Service → Model
```

No layer should skip or reverse this chain.

**Reference files:**
- [`/Backend/src/Model/Menu.ts`](/Backend/src/Model/Menu.ts) / [`/Backend/src/Service/MenuService.ts`](/Backend/src/Service/MenuService.ts) / [`/Backend/src/Controller/MenuController.ts`](/Backend/src/Controller/MenuController.ts) / [`/Backend/src/Routes/MenuRoutes.ts`](/Backend/src/Routes/MenuRoutes.ts)
- [`/Backend/src/Model/User.ts`](/Backend/src/Model/User.ts) / [`/Backend/src/Service/UserService.ts`](/Backend/src/Service/UserService.ts) / [`/Backend/src/Controller/UserController.ts`](/Backend/src/Controller/UserController.ts) / [`/Backend/src/Routes/UserRoutes.ts`](/Backend/src/Routes/UserRoutes.ts)
---
[Voltar ao README](../README.md)