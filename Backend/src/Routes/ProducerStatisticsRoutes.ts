import { Router } from "express";
import { ProducerStatisticsController } from "../Controller/ProducerStatisticsController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.get("/", ProducerStatisticsController.getProducerStatistics);

export default router;

