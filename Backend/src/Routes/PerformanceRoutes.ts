import { Router } from "express";

import { PerformanceController } from "../Controller/PerformanceController";

import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

import { authorizeRoles } from "../middlewares/authorizeRoles";

import { RoleGroups } from "../Config/roles";

import { validate } from "../middlewares/validate";
import { performanceWasteQuerySchema } from "../Schemas/StatisticsValidation";


const router = Router();



router.use(apiRateLimiter);

router.use(authMiddleware);


router.get(
    "/waste",
    validate(performanceWasteQuerySchema, "query"),
    authorizeRoles(...RoleGroups.REFECTORY_STATS),
    PerformanceController.getWastePercentage,
);

export default router;



