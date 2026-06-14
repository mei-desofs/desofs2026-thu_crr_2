import { Router } from "express";
import { StatisticsController } from "../Controller/StatisticsController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.get(
  "/",
  authorizeRoles(...RoleGroups.REFECTORY_STATS),
  StatisticsController.getBioProductsPercentageForRecipe,
);

export default router;
