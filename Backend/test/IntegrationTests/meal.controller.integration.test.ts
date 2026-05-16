import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";
import { daysFromNow } from "../UnitTests/helpers/dates";

const mealSvc = vi.hoisted(() => ({
  createMeal: vi.fn(),
  listMeals: vi.fn(),
  getMealById: vi.fn(),
  getCanteenStatistics: vi.fn(),
}));

vi.mock("../../src/Service/MealService", () => ({
  MealService: class {
    createMeal = mealSvc.createMeal;
    listMeals = mealSvc.listMeals;
    getMealById = mealSvc.getMealById;
    getCanteenStatistics = mealSvc.getCanteenStatistics;
  },
}));

import { MealController } from "../../src/Controller/MealController";

const validMealBody = () => ({
  mealTypeId: 1,
  name: "Almoço",
  date: daysFromNow(3),
  dishId: 1,
  canteenId: 1,
  refeitorioId: 2,
});

describe("MealController (integração, MealService mockado)", () => {
  beforeEach(() => {
    Object.values(mealSvc).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset());
  });

  it("createMeal — 400 validação", async () => {
    const { res, status } = createMockResponse();
    await MealController.createMeal(createMockRequest({ body: {} }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("createMeal — 404 DISH_NOT_FOUND", async () => {
    mealSvc.createMeal.mockRejectedValue(new Error("DISH_NOT_FOUND"));
    const { res, status } = createMockResponse();
    await MealController.createMeal(createMockRequest({ body: validMealBody() }), res);
    expect(status).toHaveBeenCalledWith(404);
  });

  it("createMeal — 200", async () => {
    mealSvc.createMeal.mockResolvedValue({ id: 10 });
    const { res, json } = createMockResponse();
    await MealController.createMeal(createMockRequest({ body: validMealBody() }), res);
    expect(json).toHaveBeenCalledWith({ id: 10 });
  });

  it("getMeal — 404 MEAL_NOT_FOUND", async () => {
    mealSvc.getMealById.mockRejectedValue(new Error("MEAL_NOT_FOUND"));
    const { res, status } = createMockResponse();
    await MealController.getMeal(createMockRequest({ params: { id: "1" } } as never), res);
    expect(status).toHaveBeenCalledWith(404);
  });

  it("getCanteenStatistics — 400 canteenId inválido", async () => {
    const { res, status } = createMockResponse();
    await MealController.getCanteenStatistics(
      createMockRequest({ params: { canteenId: "nan" }, query: {} } as never),
      res
    );
    expect(status).toHaveBeenCalledWith(400);
  });
});
