import { Router } from "express";
import { NeededProductController } from "../Controller/NeededProductController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post("/", NeededProductController.create);
router.put("/:id", NeededProductController.update);
router.delete("/:id", NeededProductController.delete);

export default router;
