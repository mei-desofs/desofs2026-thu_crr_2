import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";

const ingSvc = vi.hoisted(() => ({
  createIngredient: vi.fn(),
  listIngredients: vi.fn(),
  getIngredientById: vi.fn(),
}));

vi.mock("../../src/Service/IngredientService", () => ({
  IngredientService: class {
    createIngredient = ingSvc.createIngredient;
    listIngredients = ingSvc.listIngredients;
    getIngredientById = ingSvc.getIngredientById;
  },
}));

import { IngredientController } from "../../src/Controller/IngredientController";

describe("IngredientController (integração, IngredientService mockado)", () => {
  beforeEach(() => {
    Object.values(ingSvc).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset());
  });

  it("createIngredient — 400", async () => {
    const { res, status } = createMockResponse();
    await IngredientController.createIngredient(createMockRequest({ body: {} }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("createIngredient — 404 PRODUCT_NOT_FOUND", async () => {
    ingSvc.createIngredient.mockRejectedValue(new Error("PRODUCT_NOT_FOUND"));
    const { res, status } = createMockResponse();
    await IngredientController.createIngredient(
      createMockRequest({ body: { productId: 1, quantity: 1, unitId: 1 } }),
      res
    );
    expect(status).toHaveBeenCalledWith(404);
  });

  it("createIngredient — 200", async () => {
    ingSvc.createIngredient.mockResolvedValue({ id: 1 });
    const { res, json } = createMockResponse();
    await IngredientController.createIngredient(
      createMockRequest({ body: { productId: 1, quantity: 1, unitId: 1 } }),
      res
    );
    expect(json).toHaveBeenCalledWith({ id: 1 });
  });

  it("getIngredient — 404", async () => {
    ingSvc.getIngredientById.mockRejectedValue(new Error("INGREDIENT_NOT_FOUND"));
    const { res, status } = createMockResponse();
    await IngredientController.getIngredient(createMockRequest({ params: { id: "1" } } as never), res);
    expect(status).toHaveBeenCalledWith(404);
  });
});
