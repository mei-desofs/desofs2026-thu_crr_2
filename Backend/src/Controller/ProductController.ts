import { Request, Response } from "express";
import { ProductService } from "../Service/ProductService";
import { createProductSchema } from "../Schemas/product.validation";
import { validateOrFail } from "../utils/validateOrFail";


const service = new ProductService();

export class ProductController {

  static async createProduct(req: Request, res: Response) {
    const v = validateOrFail(createProductSchema, req.body, res);
    if (!v.ok) return;

    try {
      const result = await service.createProduct(v.value);
      res.json(result);
    } catch (err: any) {
      switch (err.message) {
        case "PRODUCT_ALREADY_EXISTS":
          return res.status(409).json({ error: "Product already exists" });
        case "PRODUCT_TYPE_NOT_FOUND":
          return res.status(404).json({ error: "Product type not found" });
        case "UNIT_NOT_FOUND":
          return res.status(404).json({ error: "Unit not found" });
        default:
          if (err.message.startsWith("NUTRITION_TYPE_NOT_FOUND"))
            return res.status(404).json({ error: err.message });
          if (err.message.startsWith("ALLERGEN_NOT_FOUND"))
            return res.status(404).json({ error: err.message });
          return res.status(500).json({ message: "Internal server error" });
      }
    }
  }

  static async listProducts(req: Request, res: Response) {
    const result = await service.listProducts();
    res.json(result);
  }

  static async getProduct(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) return res.status(400).json({ error: "Invalid ID" });

    try {
      const product = await service.getProductById(id);
      res.json(product);
    } catch (err: any) {
      if (err.message === "PRODUCT_NOT_FOUND")
        return res.status(404).json({ error: "Product not found" });
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
