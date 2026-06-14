import { Router } from "express";
import { MenuController } from "../Controller/MenuController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { Role, RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post("/", authorizeRoles(...RoleGroups.NUTRITION), MenuController.createMenu);
router.get(
  "/week/current",
  authorizeRoles(...RoleGroups.MENU_READ),
  MenuController.getCurrentWeekMenu,
);
router.get("/", authorizeRoles(...RoleGroups.NUTRITION, ...RoleGroups.CANTEEN_MGMT), MenuController.listMenus);
router.get("/:id", authorizeRoles(...RoleGroups.NUTRITION, ...RoleGroups.MENU_READ), MenuController.getMenu);
router.put("/:id", authorizeRoles(...RoleGroups.NUTRITION), MenuController.updateMenuStatus);
router.get(
  "/canteen/:canteenId",
  authorizeRoles(...RoleGroups.NUTRITION, ...RoleGroups.CANTEEN_MGMT),
  MenuController.getMenusByCanteen,
);

export default router;
