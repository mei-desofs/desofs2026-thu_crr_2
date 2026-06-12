import { Router } from "express";
import { DishController } from "../Controller/DishController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post("/", authorizeRoles(...RoleGroups.ADMIN_WRITE, ...RoleGroups.NUTRITION), DishController.createDish);
router.get("/", authorizeRoles(...RoleGroups.NUTRITION, ...RoleGroups.REFECTORY), DishController.listDishes);
router.get(
  "/recipe/:id",
  authorizeRoles(...RoleGroups.REFECTORY_STATS),
  DishController.getDishByRecipe,
);
router.get(
  "/recommendationsList/:date",
  authorizeRoles(...RoleGroups.NUTRITION),
  DishController.getDishRecommendations,
);
router.get("/:id", authorizeRoles(...RoleGroups.NUTRITION, ...RoleGroups.REFECTORY), DishController.getDish);

export default router;
