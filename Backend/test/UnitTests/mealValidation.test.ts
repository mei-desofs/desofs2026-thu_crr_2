import { describe, it, expect } from "vitest";
import { createMealSchema } from "../../src/Schemas/MealValidation";

function futureDate(days: number): Date {
  return new Date(Date.now() + days * 86_400_000);
}

describe("createMealSchema (Joi)", () => {
  it("accepts valid meal payload", () => {
    const { error } = createMealSchema.validate({
      mealTypeId: 1,
      name: "Almoço segunda",
      date: futureDate(3),
      dishId: 10,
      canteenId: 1,
      refeitorioId: 2,
    });
    expect(error).toBeUndefined();
  });

  it("rejects missing dishId", () => {
    const { error } = createMealSchema.validate({
      mealTypeId: 1,
      name: "Nome",
      date: futureDate(3),
      canteenId: 1,
      refeitorioId: 2,
    });
    expect(error).toBeDefined();
  });
});
