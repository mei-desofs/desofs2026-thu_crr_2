import { Router } from "express";
import { UserController } from "../Controller/UserController";
import {
  apiRateLimiter,
  authMiddleware,
  loginRateLimiter,
} from "../middlewares/authMiddleware";
import { loginLogger, onRateLimitHit } from "../middlewares/securityLogger";

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

router.get("/:id", UserController.getById);
router.patch("/startQuarantine/:id", UserController.startQuarantine);
router.patch("/endQuarantine/:id", UserController.endQuarantine);

export default router;