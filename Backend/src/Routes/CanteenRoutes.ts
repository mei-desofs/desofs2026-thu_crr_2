import { Router } from "express";
import { CanteenController } from "../Controller/CanteenController";
import { ReservationQuantitiesCanteenController } from "../Controller/ReservationQuantitiesCanteenController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { Role, RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

const canteenRead = authorizeRoles(
  ...RoleGroups.NUTRITION,
  ...RoleGroups.CANTEEN_MGMT,
  Role.Student,
  Role.Supplier,
);

router.post("/", authorizeRoles(...RoleGroups.ADMIN_WRITE), CanteenController.createCanteen);
router.get("/", canteenRead, CanteenController.getAllCanteens);
router.get("/:canteenId/refeitorios", canteenRead, CanteenController.getCanteenRefeitorios);
router.get(
  "/:canteenId/production-statistics",
  authorizeRoles(...RoleGroups.CANTEEN_MGMT),
  ReservationQuantitiesCanteenController.getCanteenProductionStatistics,
);
router.get(
  "/:canteenId/ingredients-statistics",
  authorizeRoles(...RoleGroups.CANTEEN_MGMT),
  ReservationQuantitiesCanteenController.getCanteenIngredientsStatistics,
);
router.get("/:id", canteenRead, CanteenController.getCanteenById);
router.post(
  "/associate-refeitorio",
  authorizeRoles(...RoleGroups.ADMIN_WRITE),
  CanteenController.associateRefeitorio,
);
router.post(
  "/associate-multiple-refeitorios",
  authorizeRoles(...RoleGroups.ADMIN_WRITE),
  CanteenController.associateMultipleRefeitorios,
);

export default router;
