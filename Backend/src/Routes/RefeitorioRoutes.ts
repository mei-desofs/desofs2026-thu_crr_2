import { Router } from "express";
import { RefeitorioController } from "../Controller/RefeitorioController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { Role, RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

const refeitorioRead = authorizeRoles(
  Role.Student,
  Role.NursingHome,
  ...RoleGroups.REFECTORY,
  ...RoleGroups.CANTEEN_MGMT,
);

router.post("/", authorizeRoles(...RoleGroups.ADMIN_WRITE), RefeitorioController.createRefeitorio);
router.get("/", authorizeRoles(...RoleGroups.CANTEEN_MGMT), RefeitorioController.getAllRefeitorios);
router.get("/:id", refeitorioRead, RefeitorioController.getRefeitorioById);

export default router;
