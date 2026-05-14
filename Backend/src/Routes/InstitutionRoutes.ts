import { Router } from "express";
import { InstitutionController } from "../Controller/InstitutionController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.post("/", InstitutionController.createInstitution);
router.get("/", InstitutionController.getAllInstitutions);
router.get("/:id", InstitutionController.getInstitutionById);

export default router;

