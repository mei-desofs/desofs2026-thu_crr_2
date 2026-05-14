import { describe, it, expect } from "vitest";
import { createDishSchema } from "../../src/Schemas/DishValidation";

describe("createDishSchema (Joi)", () => {
  it("accepts a valid dish payload", () => {
    const { error, value } = createDishSchema.validate({
      dishTypeId: 1,
      name: "Sopa legumes",
      recipeId: 2,
      mainProductsId: [1, 2],
    });
    expect(error).toBeUndefined();
    expect(value.name).toBe("Sopa legumes");
  });

  it("rejects when name is too short (min 2)", () => {
    const { error } = createDishSchema.validate({
      dishTypeId: 1,
      name: "A",
      recipeId: 2,
      mainProductsId: [1],
    });
    expect(error).toBeDefined();
    expect(error?.details.some((d) => d.path.includes("name"))).toBe(true);
  });

  it("rejects when name is null", () => {
    const { error } = createDishSchema.validate({
      dishTypeId: 1,
      name: null,
      recipeId: 2,
      mainProductsId: [1],
    });
    expect(error).toBeDefined();
  });

  it("rejects when recipeId is missing", () => {
    const { error } = createDishSchema.validate({
      dishTypeId: 1,
      name: "Valid name",
      mainProductsId: [1],
    });
    expect(error).toBeDefined();
    expect(error?.details[0]?.path).toContain("recipeId");
  });

  it("rejects when mainProductsId is missing", () => {
    const { error } = createDishSchema.validate({
      dishTypeId: 1,
      name: "Valid name",
      recipeId: 1,
    });
    expect(error).toBeDefined();
    expect(error?.details[0]?.path).toContain("mainProductsId");
  });
});
