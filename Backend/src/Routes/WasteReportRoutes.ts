import { Router } from "express";

import { WasteReportController } from "../Controller/WasteReportController";

import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

import { authorizeRoles } from "../middlewares/authorizeRoles";

import { RoleGroups } from "../Config/roles";



const router = Router();



router.use(apiRateLimiter);

router.use(authMiddleware);



router.post(

  "/",

  authorizeRoles(...RoleGroups.REFECTORY),

  WasteReportController.createWasteReport,

);

router.get(

  "/meal/:mealId",

  authorizeRoles(...RoleGroups.REFECTORY_STATS),

  WasteReportController.getWasteReportsByMeal,

);

router.get(

  "/date",

  authorizeRoles(...RoleGroups.REFECTORY_STATS),

  WasteReportController.getWasteReportsByDate,

);

router.get(

  "/consumed-meals",

  authorizeRoles(...RoleGroups.REFECTORY_STATS),

  WasteReportController.getWasteReportsForConsumedMeals,

);

router.get(

  "/statistics",

  authorizeRoles(...RoleGroups.REFECTORY_STATS),

  WasteReportController.getWasteReportStatistics,

);



export default router;


