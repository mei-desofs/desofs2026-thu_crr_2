import { Router } from "express";
import { MealController } from "../Controller/MealController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

// CRUD Products
router.post("/", MealController.createMeal);
router.get("/", MealController.listMeals);
router.get("/canteen/:canteenId/statistics", MealController.getCanteenStatistics);
router.get("/:id", MealController.getMeal);

export default router;
