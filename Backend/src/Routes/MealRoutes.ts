import { Router } from "express";
import { MealController } from "../Controller/MealController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { Role, RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post("/", authorizeRoles(...RoleGroups.NUTRITION), MealController.createMeal);
router.get("/", authorizeRoles(...RoleGroups.NUTRITION, ...RoleGroups.CANTEEN_MGMT), MealController.listMeals);
router.get(
  "/canteen/:canteenId/statistics",
  authorizeRoles(...RoleGroups.CANTEEN_MGMT),
  MealController.getCanteenStatistics,
);
router.get(
  "/:id",
  authorizeRoles(...RoleGroups.NUTRITION, ...RoleGroups.MENU_READ),
  MealController.getMeal,
);

export default router;
