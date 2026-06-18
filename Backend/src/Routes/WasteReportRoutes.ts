import { Router } from "express";

import { WasteReportController } from "../Controller/WasteReportController";

import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

import { authorizeRoles } from "../middlewares/authorizeRoles";

import { RoleGroups } from "../Config/roles";

import { validate } from "../middlewares/validate";
import {
    createWasteReportSchema,
    wasteReportDateQuerySchema,
    wasteReportStatisticsQuerySchema,
} from "../Schemas/WasteReportValidation";
import { mealIdParamSchema } from "../Schemas/common.validation";

const router = Router();

router.use(apiRateLimiter);

router.use(authMiddleware);

router.post(
    "/",
    validate(createWasteReportSchema),
    authorizeRoles(...RoleGroups.REFECTORY),
    WasteReportController.createWasteReport,
);
router.get(
    "/meal/:mealId",
    validate(mealIdParamSchema, "params"),
    authorizeRoles(...RoleGroups.REFECTORY_STATS),
    WasteReportController.getWasteReportsByMeal,
);
router.get(
    "/date",
    validate(wasteReportDateQuerySchema, "query"),
    authorizeRoles(...RoleGroups.REFECTORY_STATS),
    WasteReportController.getWasteReportsByDate,
);
router.get(
    "/consumed-meals",
    validate(wasteReportDateQuerySchema, "query"),
    authorizeRoles(...RoleGroups.REFECTORY_STATS),
    WasteReportController.getWasteReportsForConsumedMeals,
);
router.get(
    "/statistics",
    validate(wasteReportStatisticsQuerySchema, "query"),
    authorizeRoles(...RoleGroups.REFECTORY_STATS),
    WasteReportController.getWasteReportStatistics,
);

export default router;