import {MenuService} from "../Service/MenuService";
import {Request, Response} from "express";
import {createMenuSchema} from "../Schemas/MenuValidation";
import { logRequestIdentifiers } from "../utils/safeDebugLog";
import { updateMenuStatusSchema } from "../Schemas/MenuValidation";
import { validateOrFail } from "../utils/validateOrFail";

const service = new MenuService()

export class MenuController {

    static async createMenu(req: Request, res: Response) {
        const v = validateOrFail(createMenuSchema, req.body, res);
        if (!v.ok) return;

        try {
            logRequestIdentifiers("MenuController.createMenu", req); // MT25

            const menuData = {
                ...v.value,
            };

            const result = await service.createMenu(menuData);
            res.json(result);
        } catch (err: any) {
            switch (err.message) {
                case "FINAL_DATE_MUST_BE_GREATER_THAN_INITIAL_DATE":
                    return res.status(409).json({ error: "Final date must be greater than initial date" });
                case "MENU_TYPE_NOT_FOUND":
                    return res.status(404).json({ error: "Menu type not found" });
                case "MEAL_NOT_FOUND":
                    return res.status(404).json({ error: "Meal not found" });
                case "CANTEEN_NOT_FOUND":
                    return res.status(404).json({ error: "Canteen not found" });
                case "MEAL_CANTEEN_MISMATCH":
                    return res.status(400).json({ error: "Uma ou mais meals não pertencem à cantina especificada" });
                default:
                    return res.status(500).json({ message: "Internal server error" });
            }
        }
    }

    static async listMenus(req: Request, res: Response) {
        const result = await service.listMenus();
        res.json(result);
    }

    static async getMenu(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id) || id <= 0) return res.status(400).json({ error: "Invalid ID" });

        try {
            const menu = await service.getMenuById(id);
            res.json(menu);
        } catch (err: any) {
            if (err.message === "MENU_NOT_FOUND")
                return res.status(404).json({ error: "Menu not found" });
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getCurrentWeekMenu(req: Request, res: Response) {
        try {
            const menuTypeId = req.query.menuTypeId ? Number(req.query.menuTypeId) : undefined;
            const weekOffset = req.query.weekOffset ? Number(req.query.weekOffset) : 0;

            if (menuTypeId !== undefined && isNaN(menuTypeId)) {
                return res.status(400).json({ error: "Invalid menuTypeId" });
            }
            if (isNaN(weekOffset)) {
                return res.status(400).json({ error: "Invalid weekOffset" });
            }

            const menu = await service.getCurrentWeekMenuDetailed(menuTypeId, weekOffset);
            res.json(menu);
        } catch (err: any) {
            if (err.message === "MENU_NOT_FOUND") {
                return res.status(404).json({ error: "Menu not found" });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async updateMenuStatus(req: Request, res: Response) {
        const id = Number(req.params.id);
        const sv = validateOrFail(updateMenuStatusSchema, req.body, res);
        if (!sv.ok) return;
        const { status } = sv.value;
        if (isNaN(id) || id <= 0) return res.status(400).json({ error: "Invalid ID" });
        if (!["published", "aproved", "pending"].includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }
        try {
            const updatedMenu = await service.updateMenuStatus(id, status);
            res.json(updatedMenu);
        } catch (err: any) {
            if (err.message === "MENU_NOT_FOUND") {
                return res.status(404).json({ error: "Menu not found" });
            }
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getMenusByCanteen(req: Request, res: Response) {
        const canteenId = Number(req.params.canteenId);
        if (isNaN(canteenId) || canteenId <= 0) return res.status(400).json({ error: "Invalid canteen ID" });
        try {
            const menus = await service.getMenusByCanteen(canteenId);
            res.json(menus);
        }
        catch (err: any) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}