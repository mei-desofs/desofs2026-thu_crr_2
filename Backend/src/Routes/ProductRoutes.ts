import { Router } from "express";
import { ProductController } from "../Controller/ProductController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

// CRUD Products
router.post("/", ProductController.createProduct);
router.get("/", ProductController.listProducts);
router.get("/:id", ProductController.getProduct);

export default router;
