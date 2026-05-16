import { Router } from "express";
import { NotificationController } from "../Controller/NotificationController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

// criar notificação
router.post("/", NotificationController.create);

// "delete" = marcar como vista
router.put("/:id", NotificationController.markAsSeen);

// GET /notifications/user/:userId
router.get("/user/:userId", NotificationController.getByUserId);

export default router;
