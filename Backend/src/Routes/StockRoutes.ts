import { Router } from "express";
import { StockController } from "../Controller/StockController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

// CRUD Products
router.post("/", StockController.createStock);
router.get("/", StockController.listStocks);
router.get("/:id", StockController.getStock);

export default router;
