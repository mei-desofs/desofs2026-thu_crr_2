import {MealService} from "../Service/MealService";
import {Request, Response} from "express";
import {createMealSchema} from "../Schemas/MealValidation";
import { validateOrFail } from "../utils/validateOrFail";

const service = new MealService()

export class MealController {

    static async createMeal(req: Request, res: Response) {
        const v = validateOrFail(createMealSchema, req.body, res);
        if (!v.ok) return;

        try {
            const result = await service.createMeal(v.value);
            res.json(result);
        } catch (err: any) {
            switch (err.message) {
                case "MEAL_TYPE_NOT_FOUND":
                    return res.status(404).json({ error: "Meal type not found" });
                case "DISH_NOT_FOUND":
                    return res.status(404).json({ error: "Dish not found" });
                case "CANTEEN_NOT_FOUND":
                    return res.status(404).json({ error: "Canteen not found" });
                case "REFEITORIO_NOT_FOUND":
                    return res.status(404).json({ error: "Refeitorio not found" });
            }
        }
    }

    static async listMeals(req: Request, res: Response) {
        const result = await service.listMeals();
        res.json(result);
    }

    static async getMeal(req: Request, res: Response) {
        const id = Number(req.params.id);
        if (isNaN(id) || id <= 0) return res.status(400).json({ error: "Invalid ID" });

        try {
            const meal = await service.getMealById(id);
            res.json(meal);
        } catch (err: any) {
            if (err.message === "MEAL_NOT_FOUND")
                return res.status(404).json({ error: "Meal not found" });
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getCanteenStatistics(req: Request, res: Response) {
        const canteenId = Number(req.params.canteenId);
        if (isNaN(canteenId) || canteenId <= 0) return res.status(400).json({ error: "Invalid canteen ID" });

        try {
            const { date } = req.query;
            const filter: any = {};
            if (date) {
                filter.date = date as string;
            }

            const statistics = await service.getCanteenStatistics(canteenId, filter);
            res.json(statistics);
        } catch (err: any) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
