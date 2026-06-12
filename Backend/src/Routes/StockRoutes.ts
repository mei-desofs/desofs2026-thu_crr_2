import { Router } from "express";
import { StockController } from "../Controller/StockController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post("/", authorizeRoles(...RoleGroups.STOCK), StockController.createStock);
router.get("/", authorizeRoles(...RoleGroups.STOCK), StockController.listStocks);
router.get("/:id", authorizeRoles(...RoleGroups.STOCK), StockController.getStock);

export default router;
