import { Router } from "express";
import { NeededProductController } from "../Controller/NeededProductController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", NeededProductController.create);
router.put("/:id", NeededProductController.update);
router.delete("/:id", NeededProductController.delete);

export default router;
