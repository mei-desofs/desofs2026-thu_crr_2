import { Router } from "express";
import { StatisticsController } from "../Controller/StatisticsController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

// CRUD Products
router.get("/", StatisticsController.getBioProductsPercentageForRecipe);

export default router;
