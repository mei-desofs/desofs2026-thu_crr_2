import { Router } from "express";
import { MenuController } from "../Controller/MenuController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

// CRUD Products
router.post("/", MenuController.createMenu);
router.get("/week/current", MenuController.getCurrentWeekMenu);
router.get("/", MenuController.listMenus);
router.get("/:id", MenuController.getMenu);
router.put("/:id", MenuController.updateMenuStatus);
router.get("/canteen/:canteenId", MenuController.getMenusByCanteen);

export default router;
