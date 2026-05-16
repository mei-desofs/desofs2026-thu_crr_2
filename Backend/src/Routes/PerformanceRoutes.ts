import { Router } from "express";
import { PerformanceController } from "../Controller/PerformanceController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.get("/waste", PerformanceController.getWastePercentage);

export default router;

