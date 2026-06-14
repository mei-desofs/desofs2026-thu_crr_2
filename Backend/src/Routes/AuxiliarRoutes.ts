import { Router } from "express";
import { AuxiliarController } from "../Controller/AuxiliarController";
import { apiRateLimiter, authMiddleware } from "../middlewares/authMiddleware";
import { authorizeRoles } from "../middlewares/authorizeRoles";
import { RoleGroups } from "../Config/roles";

const router = Router();

router.use(apiRateLimiter);
router.use(authMiddleware);

const adminWrite = authorizeRoles(...RoleGroups.ADMIN_WRITE);
const canteenRead = authorizeRoles(...RoleGroups.CANTEEN_MGMT);

router.post("/unit", adminWrite, AuxiliarController.createUnit);
router.get("/unit", canteenRead, AuxiliarController.listUnits);

router.post("/allergen", adminWrite, AuxiliarController.createAllergen);
router.get("/allergen", canteenRead, AuxiliarController.listAllergens);

router.post("/nutrition", adminWrite, AuxiliarController.createNutritionType);
router.get("/nutrition", canteenRead, AuxiliarController.listNutritionTypes);

router.post("/product-type", adminWrite, AuxiliarController.createProductType);
router.get("/product-type", canteenRead, AuxiliarController.listProductTypes);

router.post("/dish-type", adminWrite, AuxiliarController.createDishType);
router.get("/dish-type", canteenRead, AuxiliarController.listDishTypes);

router.post("/meal-type", adminWrite, AuxiliarController.createMealType);
router.get("/meal-type", canteenRead, AuxiliarController.listMealTypes);

router.post("/menu-type", adminWrite, AuxiliarController.createMenuType);
router.get("/menu-type", canteenRead, AuxiliarController.listMenuTypes);

router.get(
  "/ordered-suppliers",
  canteenRead,
  AuxiliarController.listOrderedSuppliers,
);

export default router;
