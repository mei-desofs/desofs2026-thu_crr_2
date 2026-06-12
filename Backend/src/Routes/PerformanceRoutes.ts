import { Router } from "express";
import { PerformanceController } from "../Controller/PerformanceController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.get(
  "/waste",
  authorizeRoles(...RoleGroups.REFECTORY_STATS),
  PerformanceController.getWastePercentage,
);

export default router;
