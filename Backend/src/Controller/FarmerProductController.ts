import { Request, Response } from "express";
import { FarmerProductService } from "../Service/FarmerProductsService";
import { createFarmerProductsSchema } from "../Schemas/FarmerProductValidation";
import { validateOrFail } from "../utils/validateOrFail";

const service = new FarmerProductService();

export class FarmerProductController {

  static async create(req: Request, res: Response) {
    const cv = validateOrFail(createFarmerProductsSchema, req.body, res);
    if (!cv.ok) return;
    const { userId, applicationId, farmerProducts } = cv.value;

    try {
      const result = await service.createFarmerProducts(userId, applicationId, farmerProducts);
      res.json(result);
    } catch (err: any) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async list(req: Request, res: Response) {
    const result = await service.listFarmerProducts();
    res.json(result);
  }

  static async getByApplication(req: Request, res: Response) {
    const applicationId = Number(req.params.applicationId);
    if (isNaN(applicationId) || applicationId <= 0) return res.status(400).json({ error: "Invalid applicationId" });

    const result = await service.getByApplication(applicationId);
    res.json(result);
  }
}
