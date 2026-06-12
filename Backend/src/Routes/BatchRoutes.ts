import { Router } from "express";
import { BatchController } from "../Controller/BatchController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

router.post("/", authorizeRoles(...RoleGroups.STOCK), BatchController.createBatch);
router.get("/", authorizeRoles(...RoleGroups.STOCK), BatchController.listBatches);
router.get("/:id", authorizeRoles(...RoleGroups.STOCK), BatchController.getBatch);

export default router;
