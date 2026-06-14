import { Router } from "express";
import { OrderController } from "../Controller/OrderController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { requireSelfOrRoles } from "../middlewares/requireSelfOrRoles";
import { RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post("/", authorizeRoles(...RoleGroups.STOCK), OrderController.create);
router.put("/:id", authorizeRoles(...RoleGroups.STOCK), OrderController.update);
router.patch("/:id/status", authorizeRoles(...RoleGroups.ORDERS), OrderController.updateStatus);
router.delete("/:id", authorizeRoles(...RoleGroups.STOCK), OrderController.delete);
router.get(
  "/:userid",
  requireSelfOrRoles("userid", ...RoleGroups.STOCK),
  OrderController.getByUserId,
);
router.get("/", authorizeRoles(...RoleGroups.STOCK), OrderController.getAll);

export default router;
