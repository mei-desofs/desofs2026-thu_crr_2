import { describe, it, expect } from "vitest";
import { createMealSchema } from "../../../src/Schemas/MealValidation";
import { daysFromNow } from "../helpers/dates";

const base = () => ({
  mealTypeId: 1,
  name: "Almoço segunda",
  date: daysFromNow(3),
  dishId: 10,
  canteenId: 1,
  refeitorioId: 2,
});

describe("createMealSchema (Joi)", () => {
  it("aceita payload válido", () => {
    const { error } = createMealSchema.validate(base());
    expect(error).toBeUndefined();
  });

  it("rejeita dishId em falta", () => {
    const { dishId: _, ...rest } = base();
    const { error } = createMealSchema.validate(rest);
    expect(error).toBeDefined();
  });

  it("rejeita mealTypeId em falta", () => {
    const { mealTypeId: _, ...rest } = base();
    const { error } = createMealSchema.validate(rest);
    expect(error).toBeDefined();
  });

  it("rejeita name em falta", () => {
    const { name: _, ...rest } = base();
    const { error } = createMealSchema.validate(rest);
    expect(error).toBeDefined();
  });

  it("rejeita date em falta", () => {
    const { date: _, ...rest } = base();
    const { error } = createMealSchema.validate(rest);
    expect(error).toBeDefined();
  });

  it("rejeita canteenId em falta", () => {
    const { canteenId: _, ...rest } = base();
    const { error } = createMealSchema.validate(rest);
    expect(error).toBeDefined();
  });

  it("rejeita refeitorioId em falta", () => {
    const { refeitorioId: _, ...rest } = base();
    const { error } = createMealSchema.validate(rest);
    expect(error).toBeDefined();
  });

  it("rejeita nome com um só carácter", () => {
    const { error } = createMealSchema.validate({ ...base(), name: "A" });
    expect(error).toBeDefined();
  });

  it("aceita nome com 2 caracteres", () => {
    const { error } = createMealSchema.validate({ ...base(), name: "AB" });
    expect(error).toBeUndefined();
  });

  it("rejeita nome com mais de 100 caracteres", () => {
    const { error } = createMealSchema.validate({ ...base(), name: "x".repeat(101) });
    expect(error).toBeDefined();
  });

  it("rejeita data no passado", () => {
    const { error } = createMealSchema.validate({
      ...base(),
      date: new Date(Date.now() - 86_400_000),
    });
    expect(error).toBeDefined();
  });

  it("rejeita canteenId zero", () => {
    const { error } = createMealSchema.validate({ ...base(), canteenId: 0 });
    expect(error).toBeDefined();
  });

  it("rejeita refeitorioId zero", () => {
    const { error } = createMealSchema.validate({ ...base(), refeitorioId: 0 });
    expect(error).toBeDefined();
  });

  it("rejeita dishId zero", () => {
    const { error } = createMealSchema.validate({ ...base(), dishId: 0 });
    expect(error).toBeDefined();
  });

  it("rejeita mealTypeId não positivo", () => {
    const { error } = createMealSchema.validate({ ...base(), mealTypeId: -1 });
    expect(error).toBeDefined();
  });

  it("aceita data longínqua no futuro", () => {
    const { error } = createMealSchema.validate({ ...base(), date: daysFromNow(400) });
    expect(error).toBeUndefined();
  });

  it("rejeita mealTypeId zero", () => {
    const { error } = createMealSchema.validate({ ...base(), mealTypeId: 0 });
    expect(error).toBeDefined();
  });

  it("rejeita dishId decimal", () => {
    const { error } = createMealSchema.validate({ ...base(), dishId: 1.5 });
    expect(error).toBeDefined();
  });

  it("rejeita canteenId string não numérica", () => {
    const { error } = createMealSchema.validate({ ...base(), canteenId: "não" as unknown as number });
    expect(error).toBeDefined();
  });

  it("rejeita name undefined", () => {
    const { error } = createMealSchema.validate({ ...base(), name: undefined });
    expect(error).toBeDefined();
  });

  it("aceita nome no limite 100 caracteres", () => {
    const { error } = createMealSchema.validate({ ...base(), name: "x".repeat(100) });
    expect(error).toBeUndefined();
  });

  it("rejeita refeitorioId negativo", () => {
    const { error } = createMealSchema.validate({ ...base(), refeitorioId: -1 });
    expect(error).toBeDefined();
  });

  it("rejeita date inválida", () => {
    const { error } = createMealSchema.validate({ ...base(), date: "não é data" as unknown as Date });
    expect(error).toBeDefined();
  });

  it("rejeita mealTypeId decimal", () => {
    const { error } = createMealSchema.validate({ ...base(), mealTypeId: 1.2 });
    expect(error).toBeDefined();
  });
});
