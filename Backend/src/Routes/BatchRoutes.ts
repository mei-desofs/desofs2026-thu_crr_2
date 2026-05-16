import { Router } from "express";
import { BatchController } from "../Controller/BatchController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

// CRUD Products
router.post("/", BatchController.createBatch);
router.get("/", BatchController.listBatches);
router.get("/:id", BatchController.getBatch);

export default router;
