import { Router } from "express";
import { RecipeController } from "../Controller/RecipeController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

// CRUD Products
router.post("/", RecipeController.createRecipe);
router.get("/", RecipeController.listRecipes);
router.get("/:id", RecipeController.getRecipe);

export default router;
