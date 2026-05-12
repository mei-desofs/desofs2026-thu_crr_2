import { Router } from "express";
import { ApplicationController } from "../Controller/ApplicationController";
import multer from "multer";
import path from "path";

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
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB por ficheiro
    files: 10,                  // máximo 10 ficheiros por pedido
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Apenas PDFs são permitidos!"));
    }
    cb(null, true);
  },
});

const router = Router();

// Criar nova aplicação com FarmerProducts e documentos PDF
router.post("/", upload.array("documents"), ApplicationController.createApplicationWithFiles);

// Atualizar uma aplicação com FarmerProducts e documentos PDF
router.put("/:applicationId", upload.array("documents"), ApplicationController.updateApplicationWithFiles);

// Listar todas as aplicações
router.get("/", ApplicationController.listApplications);

// Get document of one application
router.get('/:applicationId/documents/:filename', ApplicationController.getDocument);

// Obter aplicação por userId
router.get("/user/:userId", ApplicationController.getApplicationByUser);

// Aceitar uma aplicação
router.post("/:applicationId/accept", ApplicationController.acceptApplication);

// Rejeitar uma aplicação
router.post("/:applicationId/reject", ApplicationController.rejectApplication);

export default router;
