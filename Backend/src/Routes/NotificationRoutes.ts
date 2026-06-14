import { Router } from "express";
import { NotificationController } from "../Controller/NotificationController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { requireSelfOrRoles } from "../middlewares/requireSelfOrRoles";
import { RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post("/", authorizeRoles(...RoleGroups.STOCK), NotificationController.create);
router.put("/:id", authorizeRoles(...RoleGroups.ORDERS), NotificationController.markAsSeen);
router.get(
  "/user/:userId",
  requireSelfOrRoles("userId"),
  NotificationController.getByUserId,
);

export default router;
