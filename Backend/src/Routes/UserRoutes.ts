import { Router } from "express";
import { UserController } from "../Controller/UserController";
import {
  apiRateLimiter,
  authMiddleware,
  loginRateLimiter,
} from "../middlewares/authMiddleware";
import { loginLogger } from "../middlewares/securityLogger";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { requireSelfOrRoles } from "../middlewares/requireSelfOrRoles";
import { RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);

router.post("/register", UserController.register);

// loginLogger interceta a resposta para registar sucesso/falha
// onRateLimitHit é chamado pelo rate limiter quando o limite é atingido
router.post(
  "/login",
  loginRateLimiter,
  loginLogger,
  UserController.login
);

router.use(authMiddleware);

router.get(
  "/:id",
  requireSelfOrRoles("id", ...RoleGroups.CANTEEN_MGMT, ...RoleGroups.STOCK),
  UserController.getById,
);
router.patch(
  "/startQuarantine/:id",
  authorizeRoles(...RoleGroups.CANTEEN_MGMT),
  UserController.startQuarantine,
);
router.patch(
  "/endQuarantine/:id",
  authorizeRoles(...RoleGroups.CANTEEN_MGMT),
  UserController.endQuarantine,
);

export default router;