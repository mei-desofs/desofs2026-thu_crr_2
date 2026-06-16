import { Request, Response } from "express";
import { ApplicationService } from "../Service/ApplicationService";
import { rejectNonPdfFiles } from "../utils/validatePdfMagicBytes";
import { applicationSchema } from "../Schemas/ApplicationValidation";
import { sanitizeFilename } from "../utils/sanitizeFilename";
import path from "path";
import fs from "fs";
import logger from "../utils/logger";

const service = new ApplicationService();

const UPLOADS_DIR = path.resolve("uploads");

function buildSafeFilePath(prefix: string, originalname: string): { newFilename: string; newPath: string } {
  const safeName = sanitizeFilename(originalname);
  const newFilename = `${prefix}-${safeName}`;
  const newPath = path.join(UPLOADS_DIR, newFilename);

  const resolvedPath = path.resolve(newPath);
  if (!resolvedPath.startsWith(UPLOADS_DIR + path.sep)) {
    throw new Error("INVALID_FILE_PATH");
  }

  return { newFilename, newPath };
}

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return (Array.isArray(forwarded) ? forwarded[0] : forwarded)
        .split(",")[0]
        .trim();
  }
  return req.ip ?? "unknown";
}

export class ApplicationController {

  // Plain JSON endpoint (currently not wired through ApplicationRoutes).
  // Validates with the shared `applicationSchema` for defence in depth.
  static async createApplication(req: Request, res: Response) {
    const { error } = applicationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message,
        })),
      });
    }

    try {
      const app = await service.createApplication(req.body);
      logger.info("APP:CREATED", {
        applicationId: app?.id,
        userId: req.body.userId,
      });
      res.json(app);
    } catch (err: any) {
      if (err.message === "APPLICATION_ALREADY_EXISTS") {
        logger.warn("APP:DUPLICATE", { userId: req.body.userId });
        return res.status(409).json({ error: "User already has an application" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // :userId validated by validate(userIdParamSchema, "params") middleware.
  static async getApplicationByUser(req: Request, res: Response) {
    const userId = Number(req.params.userId);

    try {
      const app = await service.getApplicationByUser(userId);
      res.json(app);
    } catch (err: any) {
      if (err.message === "APPLICATION_NOT_FOUND")
        return res.status(404).json({ error: "Application not found" });
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async listApplications(req: Request, res: Response) {
    const apps = await service.listApplications();
    res.json(apps);
  }

  // Params validated by validate(applicationDocumentParamSchema, "params") middleware.
  static async getDocument(req: Request, res: Response) {
    const applicationId: number = Number(req.params.applicationId);
    const filename: string = req.params.filename;

    try {
      // MT14-Solution: ownership check (R4)
      const requestingUser = (req as any).user;
      const isNetworkManager = requestingUser.role === "NetworkManager";
      const isCanteenManager = requestingUser.role === "CanteenManager";

      if (!isNetworkManager && !isCanteenManager) {
        const app = await service.getApplicationByUser(requestingUser.id);
        const isOwner = app && Number(app.id) === applicationId;
        if (!isOwner) {
          logger.warn("SECURITY:UNAUTHORIZED_DOCUMENT_ACCESS", {
            requestingUserId: requestingUser.id,
            requestingRole: requestingUser.role,
            targetApplicationId: applicationId,
            filename,
            ip: getClientIp(req),
          });
          return res.status(403).json({ error: "Access denied" });
        }
      }

      const filePath: string = await service
          .getFilePathByApplicationIdAndFileName(applicationId, filename);

      logger.info("APP:DOCUMENT_ACCESSED", {
        applicationId,
        filename,
        userId: requestingUser.id,
      });

      return res.sendFile(filePath);
    } catch (err: any) {
      if (err.message === "APPLICATION_NOT_FOUND")
        return res.status(404).json({ error: "Application not found" });
      logger.error("APP:DOCUMENT_FETCH_ERROR", {
        applicationId,
        filename,
        error: err.message,
      });
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Plain JSON endpoint (currently not wired through ApplicationRoutes).
  // :applicationId validated by middleware; body validated here.
  static async updateApplication(req: Request, res: Response) {
    const applicationId = Number(req.params.applicationId);
    const { error } = applicationSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message,
        })),
      });
    }

    try {
      const updatedApp = await service.updateApplication(applicationId, req.body);
      logger.info("APP:UPDATED", {
        applicationId,
        userId: req.body.userId,
      });
      res.json(updatedApp);
    } catch (err: any) {
      if (err.message === "APPLICATION_NOT_FOUND")
        return res.status(404).json({ error: "Application not found" });
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // :applicationId and body validated by route middleware.
  static async acceptApplication(req: Request, res: Response) {
    const applicationId = Number(req.params.applicationId);
    try {
      const updatedApp = await service.acceptApplication(applicationId, req.body.evaluationComment);
      logger.info("APP:ACCEPTED", {
        applicationId,
        by: (req as any).user?.id,
        evaluationComment: req.body.evaluationComment ?? null,
      });
      res.json(updatedApp);
    } catch (err: any) {
      if (err.message === "APPLICATION_NOT_FOUND")
        return res.status(404).json({ error: "Application not found" });
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // :applicationId and body validated by route middleware.
  static async rejectApplication(req: Request, res: Response) {
    const applicationId = Number(req.params.applicationId);
    try {
      const updatedApp = await service.rejectApplication(applicationId, req.body.evaluationComment);
      logger.info("APP:REJECTED", {
        applicationId,
        by: (req as any).user?.id,
        evaluationComment: req.body.evaluationComment ?? null,
      });
      res.json(updatedApp);
    } catch (err: any) {
      if (err.message === "APPLICATION_NOT_FOUND")
        return res.status(404).json({ error: "Application not found" });
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Multipart endpoint — body validation happens here because farmerProducts
  // arrives as a JSON string and documents come through multer.
  static async createApplicationWithFiles(req: Request, res: Response) {
    try {
      const { userId, businessEmail, businessPhone, name, location, freguesia, municipio, supplierComment, farmerProducts } = req.body;

      const parsedBody = {
        userId: Number(userId),
        businessEmail,
        businessPhone,
        name,
        location,
        freguesia,
        municipio,
        supplierComment,
        documentsSubmitted: [],
        farmerProducts: typeof farmerProducts === "string" ? JSON.parse(farmerProducts) : farmerProducts,
      };

      const { error } = applicationSchema.validate(parsedBody, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.details.map((d) => ({
            field: d.path.join("."),
            message: d.message,
          })),
        });
      }

      const app = await service.createApplication(parsedBody);

      if (!app) return res.status(500).json({ error: "Failed to create application" });

      const applicationId = app.id;
      const rawFiles = req.files;
      const files: Express.Multer.File[] | null =
          rawFiles === undefined
              ? []
              : Array.isArray(rawFiles) &&
              rawFiles.every(
                  (f) =>
                      f &&
                      typeof f === "object" &&
                      typeof (f as Express.Multer.File).originalname === "string" &&
                      typeof (f as Express.Multer.File).path === "string"
              )
                  ? (rawFiles as Express.Multer.File[])
                  : (() => {
                    logger.warn("APP:INVALID_FILES_PAYLOAD", {
                      userId: req.body?.userId,
                      ip: getClientIp(req),
                    });
                    return null;
                  })();
      if (files === null) {
        return res.status(400).json({ error: "Invalid files payload" });
      }

      const uploadsRoot = path.resolve("uploads");
      const safeUserId = sanitizeFilename(String(userId));

      const documents = files.map(f => {
        const safeOriginalName = sanitizeFilename(f.originalname);
        const newFilename = `${safeUserId}-${applicationId}-${safeOriginalName}`;
        const newPath = path.resolve(uploadsRoot, newFilename);

        if (!newPath.startsWith(uploadsRoot + path.sep)) {
          logger.error("SECURITY:PATH_TRAVERSAL_UPLOAD", {
            userId,
            applicationId,
            filename: f.originalname,
            resolvedPath: newPath,
            ip: getClientIp(req),
          });
          throw new Error("INVALID_UPLOAD_PATH");
        }

        fs.renameSync(f.path, newPath);
        return { filename: f.originalname, path: path.join("uploads", newFilename) };
      });

      const updatedApp = await service.updateApplication(applicationId, { documentsSubmitted: documents });

      logger.info("APP:FILES_UPLOADED", {
        applicationId,
        userId,
        fileCount: files.length,
        filenames: files.map(f => f.originalname),
      });

      res.status(201).json(updatedApp);
    } catch (err: any) {
      if (err.message === "APPLICATION_ALREADY_EXISTS") {
        logger.warn("APP:DUPLICATE", { userId: req.body.userId });
        return res.status(409).json({ error: "User already has an application" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // Multipart endpoint — body validation happens here because farmerProducts
  // arrives as a JSON string and documents come through multer.
  // :applicationId is validated by route middleware.
  static async updateApplicationWithFiles(req: Request, res: Response) {
    try {
      const applicationId = Number(req.params.applicationId);

      const existingApp = await service.getApplicationByUser(Number(req.body.userId));

      const rawFiles = req.files;
      if (rawFiles != null && !Array.isArray(rawFiles)) {
        return res.status(400).json({ error: "Invalid files payload" });
      }
      const files: Express.Multer.File[] = Array.isArray(rawFiles) ? rawFiles : [];

      const newDocuments = files.map((f: Express.Multer.File) => {
        const { newFilename, newPath } = buildSafeFilePath(`${existingApp.userId}-${applicationId}`, f.originalname);
        fs.renameSync(f.path, newPath);
        return { filename: f.originalname, path: path.join("uploads", newFilename) };
      });

      const documentsSubmitted = existingApp.documentsSubmitted
          ? [...existingApp.documentsSubmitted, ...newDocuments]
          : newDocuments;

      const bodyData = {
        ...req.body,
        userId: Number(req.body.userId),
        farmerProducts: typeof req.body.farmerProducts === "string"
            ? JSON.parse(req.body.farmerProducts)
            : req.body.farmerProducts,
        documentsSubmitted,
      };

      const { error } = applicationSchema.validate(bodyData, { abortEarly: false });
      if (error) {
        return res.status(400).json({
          error: "Validation failed",
          details: error.details.map((d) => ({
            field: d.path.join("."),
            message: d.message,
          })),
        });
      }

      const updatedApp = await service.updateApplication(applicationId, bodyData);

      if (files.length > 0) {
        logger.info("APP:FILES_UPDATED", {
          applicationId,
          userId: req.body.userId,
          newFileCount: files.length,
          filenames: files.map((f: Express.Multer.File) => f.originalname),
        });
      }

      res.json(updatedApp);
    } catch (err: any) {
      if (err.message === "APPLICATION_NOT_FOUND")
        return res.status(404).json({ error: "Application not found" });
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}