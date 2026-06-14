import { Router } from "express";
import { ProducerStatisticsController } from "../Controller/ProducerStatisticsController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.get(
  "/",
  authorizeRoles(...RoleGroups.NETWORK),
  ProducerStatisticsController.getProducerStatistics,
);

export default router;
