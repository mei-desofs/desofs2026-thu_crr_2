import { Router } from "express";

import { NeededProductController } from "../Controller/NeededProductController";

import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

import { authorizeRoles } from "../middlewares/authorizeRoles";

import { RoleGroups } from "../Config/roles";



const router = Router();



router.use(apiRateLimiter);

router.use(authMiddleware);



router.post("/", authorizeRoles(...RoleGroups.STOCK, ...RoleGroups.NUTRITION), NeededProductController.create);

router.put("/:id", authorizeRoles(...RoleGroups.STOCK), NeededProductController.update);

router.delete("/:id", authorizeRoles(...RoleGroups.STOCK), NeededProductController.delete);



export default router;


