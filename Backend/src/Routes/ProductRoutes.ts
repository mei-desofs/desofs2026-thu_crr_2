import { Router } from "express";
import { ProductController } from "../Controller/ProductController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post("/", authorizeRoles(...RoleGroups.ADMIN_WRITE), ProductController.createProduct);
router.get("/", authorizeRoles(...RoleGroups.CATALOG_READ), ProductController.listProducts);
router.get("/:id", authorizeRoles(...RoleGroups.CATALOG_READ), ProductController.getProduct);

export default router;
