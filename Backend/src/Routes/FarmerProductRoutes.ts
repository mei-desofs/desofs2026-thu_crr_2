import { Router } from "express";
import { FarmerProductController } from "../Controller/FarmerProductController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { Role, RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post(
  "/",
  authorizeRoles(...RoleGroups.APPLICANT, ...RoleGroups.NETWORK),
  FarmerProductController.create,
);

router.get(
  "/",
  authorizeRoles(...RoleGroups.NETWORK, ...RoleGroups.CANTEEN_MGMT),
  FarmerProductController.list,
);

router.get(
  "/application/:applicationId",
  authorizeRoles(...RoleGroups.APPLICANT, ...RoleGroups.CANTEEN_MGMT),
  FarmerProductController.getByApplication,
);

export default router;
