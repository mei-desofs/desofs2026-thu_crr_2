import { Router } from "express";
import { RecipeController } from "../Controller/RecipeController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post("/", authorizeRoles(...RoleGroups.NUTRITION), RecipeController.createRecipe);
router.get("/", authorizeRoles(...RoleGroups.NUTRITION), RecipeController.listRecipes);
router.get("/:id", authorizeRoles(...RoleGroups.NUTRITION), RecipeController.getRecipe);

export default router;
