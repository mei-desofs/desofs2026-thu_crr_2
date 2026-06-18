import { Router } from "express";

import { RecipeController } from "../Controller/RecipeController";

import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";

import { authorizeRoles } from "../middlewares/authorizeRoles";

import { RoleGroups } from "../Config/roles";

import { validate } from "../middlewares/validate";
import { createRecipeSchema } from "../Schemas/RecipeValidation";
import { idParamSchema } from "../Schemas/common.validation";


const router = Router();



router.use(apiRateLimiter);

router.use(authMiddleware);

router.post(
    "/",
    validate(createRecipeSchema),
    authorizeRoles(...RoleGroups.NUTRITION),
    RecipeController.createRecipe,
);
router.get(
    "/",
    authorizeRoles(...RoleGroups.NUTRITION),
    RecipeController.listRecipes,
);
router.get(
    "/:id",
    validate(idParamSchema, "params"),
    authorizeRoles(...RoleGroups.NUTRITION),
    RecipeController.getRecipe,
);

export default router;



