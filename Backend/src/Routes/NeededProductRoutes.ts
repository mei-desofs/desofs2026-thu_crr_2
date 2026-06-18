import { Router } from "express";

import { NeededProductController } from "../Controller/NeededProductController";

import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

import { authorizeRoles } from "../middlewares/authorizeRoles";

import { RoleGroups } from "../Config/roles";

import { validate } from "../middlewares/validate";
import {
    createNeededProductSchema,
    updateNeededProductSchema,
} from "../Schemas/NeededProductValidation";
import { idParamSchema } from "../Schemas/common.validation";


const router = Router();



router.use(apiRateLimiter);

router.use(authMiddleware);

router.post(
    "/",
    validate(createNeededProductSchema),
    authorizeRoles(...RoleGroups.STOCK, ...RoleGroups.NUTRITION),
    NeededProductController.create,
);
router.put(
    "/:id",
    validate(idParamSchema, "params"),
    validate(updateNeededProductSchema),
    authorizeRoles(...RoleGroups.STOCK),
    NeededProductController.update,
);
router.delete(
    "/:id",
    validate(idParamSchema, "params"),
    authorizeRoles(...RoleGroups.STOCK),
    NeededProductController.delete,
);

export default router;


