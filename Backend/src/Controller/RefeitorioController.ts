import { Request, Response } from "express";
import { RefeitorioService } from "../Service/RefeitorioService";
import { createRefeitorioSchema } from "../Schemas/RefeitorioValidation";
import { validateOrFail } from "../utils/validateOrFail";


export class RefeitorioController {
  static async createRefeitorio(req: Request, res: Response) {
    try {
      const cv = validateOrFail(createRefeitorioSchema, req.body, res);
      if (!cv.ok) return;
      const { name, institutionId, location, freguesia, municipio } = cv.value;

      const refeitorio = await RefeitorioService.createRefeitorio({
        name,
        institutionId,
        location,
        freguesia,
        municipio,
      });

      return res.status(201).json({
        message: "Refeitório criado com sucesso.",
        refeitorio,
      });
    } catch (error: any) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getAllRefeitorios(req: Request, res: Response) {
    try {
      const refeitorios = await RefeitorioService.getAllRefeitorios();
      return res.status(200).json(refeitorios);
    } catch (error: any) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getRefeitorioById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const refeitorio = await RefeitorioService.getRefeitorioById(Number(id));
      return res.status(200).json(refeitorio);
    } catch (error: any) {
      if (error.message === "REFEITORIO_NOT_FOUND") {
        return res.status(404).json({ message: "Refeitório não encontrado." });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

