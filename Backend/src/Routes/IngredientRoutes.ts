import { Router } from "express";
import { IngredientController } from "../Controller/IngredientController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

// CRUD Products
router.post("/", IngredientController.createIngredient);
router.get("/", IngredientController.listIngredients);
router.get("/:id", IngredientController.getIngredient);

export default router;
