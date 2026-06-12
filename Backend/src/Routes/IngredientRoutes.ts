import { Router } from "express";
import { IngredientController } from "../Controller/IngredientController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post("/", authorizeRoles(...RoleGroups.ADMIN_WRITE, ...RoleGroups.NUTRITION), IngredientController.createIngredient);
router.get("/", authorizeRoles(...RoleGroups.NUTRITION, ...RoleGroups.REFECTORY), IngredientController.listIngredients);
router.get(
  "/:id",
  authorizeRoles(...RoleGroups.REFECTORY_STATS, ...RoleGroups.NUTRITION),
  IngredientController.getIngredient,
);

export default router;
