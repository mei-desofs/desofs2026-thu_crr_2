import { Router } from "express";
import { ProductController } from "../Controller/ProductController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

// CRUD Products
router.post("/", ProductController.createProduct);
router.get("/", ProductController.listProducts);
router.get("/:id", ProductController.getProduct);

export default router;
