import { describe, it, expect } from "vitest";
import { Recipe } from "../../../../src/Model/Recipe";
import { Ingredient } from "../../../../src/Model/Ingredient";

describe("Recipe (Model.build)", () => {
  it("ingredients array", () => {
    const r = Recipe.build({
      ingredients: [1, 2],
      description: "Receita teste",
    });
    expect(r.ingredients).toEqual([1, 2]);
  });

  it("descrição longa", () => {
    const r = Recipe.build({
      ingredients: [],
      description: "d".repeat(500),
    });
    expect(r.description).toHaveLength(500);
  });
});

describe("Ingredient (Model.build)", () => {
  it("quantidade fraccionada", () => {
    const i = Ingredient.build({
      productId: 1,
      quantity: 0.5,
      unitId: 1,
    });
    expect(i.quantity).toBe(0.5);
  });

  it("outro produto", () => {
    const i = Ingredient.build({
      productId: 99,
      quantity: 10,
      unitId: 2,
    });
    expect(i.productId).toBe(99);
  });
});
