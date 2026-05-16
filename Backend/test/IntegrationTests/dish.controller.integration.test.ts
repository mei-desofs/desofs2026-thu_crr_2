import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";

const dishSvc = vi.hoisted(() => ({
  createDish: vi.fn(),
  listDishes: vi.fn(),
  getDishById: vi.fn(),
  getDishByRecipeId: vi.fn(),
  getDishRecommendations: vi.fn(),
}));

vi.mock("../../src/Service/DishService", () => ({
  DishService: class {
    createDish = dishSvc.createDish;
    listDishes = dishSvc.listDishes;
    getDishById = dishSvc.getDishById;
    getDishByRecipeId = dishSvc.getDishByRecipeId;
    getDishRecommendations = dishSvc.getDishRecommendations;
  },
}));

import { DishController } from "../../src/Controller/DishController";

describe("DishController (integração, DishService mockado)", () => {
  beforeEach(() => {
    Object.values(dishSvc).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset());
  });

  it("createDish — 400 quando o body falha na validação Joi", async () => {
    const { res, status, json } = createMockResponse();
    await DishController.createDish(createMockRequest({ body: { name: "x" } }), res);
    expect(status).toHaveBeenCalledWith(400);
    expect(json.mock.calls[0][0]).toMatchObject({ error: expect.any(String) });
    expect(dishSvc.createDish).not.toHaveBeenCalled();
  });

  it("createDish — 200 e JSON quando o serviço cria o prato", async () => {
    dishSvc.createDish.mockResolvedValue({ id: 1, name: "Sopa" });
    const { res, json } = createMockResponse();
    await DishController.createDish(
      createMockRequest({
        body: {
          dishTypeId: 1,
          name: "Sopa legumes",
          recipeId: 2,
          mainProductsId: [1, 2],
        },
      }),
      res
    );
    expect(json).toHaveBeenCalledWith({ id: 1, name: "Sopa" });
  });

  it("createDish — 404 DISH_TYPE_NOT_FOUND", async () => {
    dishSvc.createDish.mockRejectedValue(new Error("DISH_TYPE_NOT_FOUND"));
    const { res, status, json } = createMockResponse();
    await DishController.createDish(
      createMockRequest({
        body: { dishTypeId: 1, name: "Prato", recipeId: 1, mainProductsId: [1] },
      }),
      res
    );
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: "Dish type not found" });
  });

  it("getDish — 400 id inválido", async () => {
    const { res, status } = createMockResponse();
    await DishController.getDish(createMockRequest({ params: { id: "abc" } } as never), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("getDish — 404 quando não existe", async () => {
    dishSvc.getDishById.mockRejectedValue(new Error("DISH_NOT_FOUND"));
    const { res, status, json } = createMockResponse();
    await DishController.getDish(createMockRequest({ params: { id: "9" } } as never), res);
    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({ error: "Dish not found" });
  });

  it("listDishes — devolve o resultado do serviço", async () => {
    dishSvc.listDishes.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const { res, json } = createMockResponse();
    await DishController.listDishes(createMockRequest({}), res);
    expect(json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
  });
});
