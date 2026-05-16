import { Router } from "express";
import { RefeitorioController } from "../Controller/RefeitorioController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post("/", RefeitorioController.createRefeitorio);
router.get("/", RefeitorioController.getAllRefeitorios);
router.get("/:id", RefeitorioController.getRefeitorioById);

export default router;

