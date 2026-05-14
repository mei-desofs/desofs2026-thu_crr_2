import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";

const recipeSvc = vi.hoisted(() => ({
  createRecipe: vi.fn(),
  listRecipes: vi.fn(),
  getRecipeById: vi.fn(),
}));

vi.mock("../../src/Service/RecipeService", () => ({
  RecipeService: class {
    createRecipe = recipeSvc.createRecipe;
    listRecipes = recipeSvc.listRecipes;
    getRecipeById = recipeSvc.getRecipeById;
  },
}));

import { RecipeController } from "../../src/Controller/RecipeController";

const validRecipe = () => ({
  ingredients: [1, 2],
  description: "1234567890 descrição mínima dez chars",
});

describe("RecipeController (integração, RecipeService mockado)", () => {
  beforeEach(() => {
    Object.values(recipeSvc).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset());
  });

  it("createRecipe — 400 validação", async () => {
    const { res, status } = createMockResponse();
    await RecipeController.createRecipe(createMockRequest({ body: { ingredients: [] } }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("createRecipe — 404 INGREDIENT_NOT_FOUND", async () => {
    recipeSvc.createRecipe.mockRejectedValue(new Error("INGREDIENT_NOT_FOUND"));
    const { res, status } = createMockResponse();
    await RecipeController.createRecipe(createMockRequest({ body: validRecipe() }), res);
    expect(status).toHaveBeenCalledWith(404);
  });

  it("createRecipe — 200", async () => {
    recipeSvc.createRecipe.mockResolvedValue({ id: 1 });
    const { res, json } = createMockResponse();
    await RecipeController.createRecipe(createMockRequest({ body: validRecipe() }), res);
    expect(json).toHaveBeenCalledWith({ id: 1 });
  });

  it("getRecipe — 404", async () => {
    recipeSvc.getRecipeById.mockRejectedValue(new Error("RECIPE_NOT_FOUND"));
    const { res, status } = createMockResponse();
    await RecipeController.getRecipe(createMockRequest({ params: { id: "2" } } as never), res);
    expect(status).toHaveBeenCalledWith(404);
  });
});
