import { Router } from "express";
import { RefeitorioController } from "../Controller/RefeitorioController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", RefeitorioController.createRefeitorio);
router.get("/", RefeitorioController.getAllRefeitorios);
router.get("/:id", RefeitorioController.getRefeitorioById);

export default router;

