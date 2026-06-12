import { Router } from "express";
import { ParishController } from "../Controller/ParishController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post("/", authorizeRoles(...RoleGroups.ADMIN_WRITE), ParishController.createParish);
router.get("/", authorizeRoles(...RoleGroups.CANTEEN_MGMT), ParishController.listParishes);
router.get("/:id", authorizeRoles(...RoleGroups.CANTEEN_MGMT), ParishController.getParish);
router.patch(
  "/quarantineParish/:id",
  authorizeRoles(...RoleGroups.CANTEEN_MGMT),
  ParishController.quarantineParish,
);
router.patch(
  "/takeParishOfQuarantine/:id",
  authorizeRoles(...RoleGroups.CANTEEN_MGMT),
  ParishController.takeParishOfQuarantine,
);

export default router;
