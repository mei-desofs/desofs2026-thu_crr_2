import { Request, Response } from "express";
import { CanteenService } from "../Service/CanteenService";
import { createCanteenSchema, associateRefeitorioSchema, associateMultipleRefeitoriosSchema } from "../Schemas/CanteenValidation";
import { validateOrFail } from "../utils/validateOrFail";

export class CanteenController {
  static async createCanteen(req: Request, res: Response) {
    try {
      const cv = validateOrFail(createCanteenSchema, req.body, res);
      if (!cv.ok) return;
      const { name, institutionId, idmenutype, location, freguesia, municipio } = cv.value;

      const canteen = await CanteenService.createCanteen({
        name,
        institutionId,
        idmenutype,
        location,
        freguesia,
        municipio,
      });
      return res.status(201).json({
        message: "Cantina criada com sucesso.",
        canteen,
      });
    } catch (error: any) {
      if (error.message === "MENU_TYPE_NOT_FOUND") {
        return res.status(404).json({ message: "MenuType não encontrado." });
      }
      return res.status(500).json({
        message: "Erro ao criar cantina.",
        error: error.message,
      });
    }
  }

  static async getAllCanteens(req: Request, res: Response) {
    try {
      const canteens = await CanteenService.getAllCanteens();
      return res.status(200).json(canteens);
    } catch (error: any) {
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getCanteenRefeitorios(req: Request, res: Response) {
    const canteenId = Number(req.params.canteenId);
    if (isNaN(canteenId) || canteenId <= 0) {
      return res.status(400).json({ message: "canteenId inválido." });
    }

    try {
      const refeitorios = await CanteenService.getCanteenRefeitorios(canteenId);
      res.json(refeitorios);
    } catch (err: any) {
      if (err.message === "CANTEEN_NOT_FOUND") {
        return res.status(404).json({ message: "Cantina não encontrada." });
      }
      res.status(500).json({ message: "Erro interno do servidor." });
    }
  }

  static async getCanteenById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const canteen = await CanteenService.getCanteenById(Number(id));
      return res.status(200).json(canteen);
    } catch (error: any) {
      if (error.message === "CANTEEN_NOT_FOUND") {
        return res.status(404).json({ message: "Cantina não encontrada." });
      }
      return res.status(500).json({
        message: "Erro ao buscar cantina.",
        error: error.message,
      });
    }
  }

  static async associateRefeitorio(req: Request, res: Response) {
    try {
      const av = validateOrFail(associateRefeitorioSchema, req.body, res);
      if (!av.ok) return;
      const { canteenId, refeitorioId } = av.value;

      const result = await CanteenService.associateRefeitorio(
          Number(canteenId),
          Number(refeitorioId)
      );

      return res.status(201).json(result);
    } catch (error: any) {
      if (error.message === "CANTEEN_NOT_FOUND") {
        return res.status(404).json({ message: "Cantina não encontrada." });
      }
      if (error.message === "REFEITORIO_NOT_FOUND") {
        return res.status(404).json({ message: "Refeitório não encontrado." });
      }
      if (error.message === "ASSOCIATION_ALREADY_EXISTS") {
        return res.status(409).json({ message: "Associação já existe." });
      }
      return res.status(500).json({
        message: "Erro ao associar cantina com refeitório.",
        error: error.message,
      });
    }
  }

  static async associateMultipleRefeitorios(req: Request, res: Response) {
    try {
      const mv = validateOrFail(associateMultipleRefeitoriosSchema, req.body, res);
      if (!mv.ok) return;
      const { canteenId, refeitorioIds } = mv.value;

      const result = await CanteenService.associateMultipleRefeitorios(
          Number(canteenId),
          refeitorioIds.map((id: any) => Number(id))
      );

      return res.status(201).json(result);
    } catch (error: any) {
      if (error.message === "CANTEEN_NOT_FOUND") {
        return res.status(404).json({ message: "Cantina não encontrada." });
      }
      if (error.message === "INVALID_REFEITORIO_IDS") {
        return res.status(400).json({ message: "Lista de refeitórios inválida ou vazia." });
      }
      return res.status(500).json({
        message: "Erro ao associar cantina com refeitórios.",
        error: error.message,
      });
    }
  }
}


