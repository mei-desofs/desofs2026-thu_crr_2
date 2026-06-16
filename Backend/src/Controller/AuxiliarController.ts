import { Request, Response } from "express";
import { AuxiliarService } from "../Service/AuxiliarService";
import { createGenericTypeSchema, createUnitSchema } from "../Schemas/AuxiliarValidation";
import { validateOrFail } from "../utils/validateOrFail";

const service = new AuxiliarService();

export class AuxiliarController {

    // -------------------
    // ALLERGENS
    // -------------------
    static async createAllergen(req: Request, res: Response) {
        const v = validateOrFail(createGenericTypeSchema, req.body, res);
        if (!v.ok) return;

        try {
            const result = await service.createAllergen(v.value);
            res.json(result);
        } catch (err: any) {
            if (err.message === "ALLERGEN_ALREADY_EXISTS")
                return res.status(409).json({ error: "Allergen already exists" });
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async listAllergens(req: Request, res: Response) {
        const result = await service.listAllergens();
        res.json(result);
    }

    // -------------------
    // NUTRITION TYPES
    // -------------------
    static async createNutritionType(req: Request, res: Response) {
        const v = validateOrFail(createGenericTypeSchema, req.body, res);
        if (!v.ok) return;

        try {
            const result = await service.createNutritionType(v.value);
            res.json(result);
        } catch (err: any) {
            if (err.message === "NUTRITION_TYPE_ALREADY_EXISTS")
                return res.status(409).json({ error: "Nutrition type already exists" });
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async listNutritionTypes(req: Request, res: Response) {
        const result = await service.listNutritionTypes();
        res.json(result);
    }

    // -------------------
    // PRODUCT TYPES
    // -------------------
    static async createProductType(req: Request, res: Response) {
        const v = validateOrFail(createGenericTypeSchema, req.body, res);
        if (!v.ok) return;

        try {
            const result = await service.createProductType(v.value);
            res.json(result);
        } catch (err: any) {
            if (err.message === "PRODUCT_TYPE_ALREADY_EXISTS")
                return res.status(409).json({ error: "Product type already exists" });
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async listProductTypes(req: Request, res: Response) {
        const result = await service.listProductTypes();
        res.json(result);
    }

    // -------------------
    // UNITS
    // -------------------
    static async createUnit(req: Request, res: Response) {
        const v = validateOrFail(createUnitSchema, req.body, res);
        if (!v.ok) return;

        try {
            const result = await service.createUnit(v.value);
            res.json(result);
        } catch (err: any) {
            if (err.message === "UNIT_ALREADY_EXISTS")
                return res.status(409).json({ error: "Unit already exists" });
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async listUnits(req: Request, res: Response) {
        const result = await service.listUnits();
        res.json(result);
    }

    // -------------------
    // DISH TYPES
    // -------------------
    static async createDishType(req: Request, res: Response) {
        const v = validateOrFail(createGenericTypeSchema, req.body, res);
        if (!v.ok) return;

        try {
            const result = await service.createDishType(v.value);
            res.json(result);
        } catch (err: any) {
            if (err.message === "DISH_TYPE_ALREADY_EXISTS")
                return res.status(409).json({ error: "Dish type already exists" });
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async listDishTypes(req: Request, res: Response) {
        const result = await service.listDishTypes();
        res.json(result);
    }

    // -------------------
    // MEAL TYPES
    // -------------------
    static async createMealType(req: Request, res: Response) {
        const v = validateOrFail(createGenericTypeSchema, req.body, res);
        if (!v.ok) return;

        try {
            const result = await service.createMealType(v.value);
            res.json(result);
        } catch (err: any) {
            if (err.message === "MEAL_TYPE_ALREADY_EXISTS")
                return res.status(409).json({ error: "Meal type already exists" });
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async listMealTypes(req: Request, res: Response) {
        const result = await service.listMealTypes();
        res.json(result);
    }

    // -------------------
    // MENU TYPES
    // -------------------
    static async createMenuType(req: Request, res: Response) {
        const v = validateOrFail(createGenericTypeSchema, req.body, res);
        if (!v.ok) return;

        try {
            const result = await service.createMenuType(v.value);
            res.json(result);
        } catch (err: any) {
            if (err.message === "MENU_TYPE_ALREADY_EXISTS")
                return res.status(409).json({ error: "Menu type already exists" });
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async listMenuTypes(req: Request, res: Response) {
        const result = await service.listMenuTypes();
        res.json(result);
    }

    static async listOrderedSuppliers(req: Request, res: Response) {
        try {
            const result = await service.listOrderedSuppliers();
            res.json(result);
        } catch (err: any) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}