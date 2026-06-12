import { Router } from "express";
import { InstitutionController } from "../Controller/InstitutionController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { Role, RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post("/", authorizeRoles(...RoleGroups.ADMIN_WRITE), InstitutionController.createInstitution);
router.get("/", authorizeRoles(...RoleGroups.CANTEEN_MGMT), InstitutionController.getAllInstitutions);
router.get(
  "/:id",
  authorizeRoles(Role.Supplier, ...RoleGroups.CANTEEN_MGMT),
  InstitutionController.getInstitutionById,
);

export default router;
