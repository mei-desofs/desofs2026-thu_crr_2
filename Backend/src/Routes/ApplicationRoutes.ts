import { Router } from "express";
import { ApplicationController } from "../Controller/ApplicationController";
import multer from "multer";
import path from "path";
import { authMiddleware } from "../middlewares/authMiddleware";

// Configuração do multer para PDFs com nomes únicos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // pasta onde os PDFs serão guardados
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // nome único
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Apenas PDFs são permitidos!"));
    }
    cb(null, true);
  },
});

const router = Router();

router.use(authMiddleware);

// Criar nova aplicação com FarmerProducts e documentos PDF
router.post("/", upload.array("documents"), ApplicationController.createApplicationWithFiles);

// Atualizar uma aplicação com FarmerProducts e documentos PDF
router.put("/:applicationId", upload.array("documents"), ApplicationController.updateApplicationWithFiles);

// Listar todas as aplicações
router.get("/", ApplicationController.listApplications);

// Get document of one application
// MT14-Solution: authenticated route - only logged-in users can fetch documents (R4)
router.get('/:applicationId/documents/:filename', ApplicationController.getDocument);

// Obter aplicação por userId
router.get("/user/:userId", ApplicationController.getApplicationByUser);

// Aceitar uma aplicação
router.post("/:applicationId/accept", ApplicationController.acceptApplication);

// Rejeitar uma aplicação
router.post("/:applicationId/reject", ApplicationController.rejectApplication);

export default router;
