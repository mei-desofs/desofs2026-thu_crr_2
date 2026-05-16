import { describe, it, expect } from "vitest";
import { createDishSchema } from "../../../src/Schemas/DishValidation";

const base = {
  dishTypeId: 1,
  name: "Bacalhau à Brás",
  recipeId: 2,
  mainProductsId: [6, 11],
};

describe("createDishSchema (Joi)", () => {
  it("aceita payload válido alinhado com pratos na BD", () => {
    const { error, value } = createDishSchema.validate(base);
    expect(error).toBeUndefined();
    expect(value.name).toBe("Bacalhau à Brás");
    expect(value.mainProductsId).toEqual([6, 11]);
  });

  it("aceita nome com comprimento mínimo 2", () => {
    const { error } = createDishSchema.validate({ ...base, name: "AB" });
    expect(error).toBeUndefined();
  });

  it("aceita nome até 100 caracteres", () => {
    const name = "x".repeat(100);
    const { error } = createDishSchema.validate({ ...base, name });
    expect(error).toBeUndefined();
  });

  it("rejeita nome com mais de 100 caracteres", () => {
    const { error } = createDishSchema.validate({ ...base, name: "x".repeat(101) });
    expect(error).toBeDefined();
  });

  it("rejeita nome demasiado curto (min 2)", () => {
    const { error } = createDishSchema.validate({ ...base, name: "A" });
    expect(error).toBeDefined();
    expect(error?.details.some((d) => d.path.includes("name"))).toBe(true);
  });

  it("rejeita nome vazio", () => {
    const { error } = createDishSchema.validate({ ...base, name: "" });
    expect(error).toBeDefined();
  });

  it("rejeita nome null", () => {
    const { error } = createDishSchema.validate({ ...base, name: null });
    expect(error).toBeDefined();
  });

  it("rejeita dishTypeId em falta", () => {
    const { dishTypeId: _, ...rest } = base;
    const { error } = createDishSchema.validate(rest);
    expect(error).toBeDefined();
    expect(error?.details[0]?.path).toContain("dishTypeId");
  });

  it("rejeita dishTypeId zero", () => {
    const { error } = createDishSchema.validate({ ...base, dishTypeId: 0 });
    expect(error).toBeDefined();
  });

  it("rejeita dishTypeId negativo", () => {
    const { error } = createDishSchema.validate({ ...base, dishTypeId: -1 });
    expect(error).toBeDefined();
  });

  it("rejeita dishTypeId não inteiro", () => {
    const { error } = createDishSchema.validate({ ...base, dishTypeId: 1.5 });
    expect(error).toBeDefined();
  });

  it("rejeita recipeId em falta", () => {
    const { recipeId: _, ...rest } = base;
    const { error } = createDishSchema.validate(rest);
    expect(error).toBeDefined();
    expect(error?.details[0]?.path).toContain("recipeId");
  });

  it("rejeita recipeId zero", () => {
    const { error } = createDishSchema.validate({ ...base, recipeId: 0 });
    expect(error).toBeDefined();
  });

  it("rejeita mainProductsId em falta", () => {
    const { mainProductsId: _, ...rest } = base;
    const { error } = createDishSchema.validate(rest);
    expect(error).toBeDefined();
    expect(error?.details[0]?.path).toContain("mainProductsId");
  });

  it("rejeita mainProductsId null", () => {
    const { error } = createDishSchema.validate({ ...base, mainProductsId: null });
    expect(error).toBeDefined();
  });

  it("rejeita mainProductsId que não é array", () => {
    const { error } = createDishSchema.validate({ ...base, mainProductsId: 1 as unknown as number[] });
    expect(error).toBeDefined();
  });

  it("rejeita id de produto zero no array", () => {
    const { error } = createDishSchema.validate({ ...base, mainProductsId: [0, 1] });
    expect(error).toBeDefined();
  });

  it("rejeita id de produto negativo no array", () => {
    const { error } = createDishSchema.validate({ ...base, mainProductsId: [1, -2] });
    expect(error).toBeDefined();
  });

  it("aceita array com um único produto", () => {
    const { error } = createDishSchema.validate({ ...base, mainProductsId: [19] });
    expect(error).toBeUndefined();
  });

  it("aceita vários tipos de prato (carnes, peixe, vegetariano)", () => {
    for (const dishTypeId of [1, 2, 3]) {
      const { error } = createDishSchema.validate({ ...base, dishTypeId });
      expect(error).toBeUndefined();
    }
  });

  it("rejeita dishTypeId string não numérica", () => {
    const { error } = createDishSchema.validate({ ...base, dishTypeId: "abc" as unknown as number });
    expect(error).toBeDefined();
  });

  it("rejeita recipeId string não numérica", () => {
    const { error } = createDishSchema.validate({ ...base, recipeId: "xyz" as unknown as number });
    expect(error).toBeDefined();
  });

  it("rejeita recipeId decimal", () => {
    const { error } = createDishSchema.validate({ ...base, recipeId: 1.1 });
    expect(error).toBeDefined();
  });

  it("rejeita nome undefined", () => {
    const { error } = createDishSchema.validate({ ...base, name: undefined });
    expect(error).toBeDefined();
  });

  it("rejeita dishTypeId undefined", () => {
    const { error } = createDishSchema.validate({ ...base, dishTypeId: undefined });
    expect(error).toBeDefined();
  });

  it("aceita mainProductsId com muitos ids", () => {
    const ids = Array.from({ length: 20 }, (_, i) => i + 1);
    const { error } = createDishSchema.validate({ ...base, mainProductsId: ids });
    expect(error).toBeUndefined();
  });

  it("rejeita elemento não numérico em mainProductsId", () => {
    const { error } = createDishSchema.validate({
      ...base,
      mainProductsId: [1, "x" as unknown as number],
    });
    expect(error).toBeDefined();
  });

  it("rejeita nome com um só espaço (comprimento 1)", () => {
    const { error } = createDishSchema.validate({ ...base, name: " " });
    expect(error).toBeDefined();
  });

  it("aceita nome com acentos e cedilha", () => {
    const { error } = createDishSchema.validate({ ...base, name: "Feijoada à moda do Porto" });
    expect(error).toBeUndefined();
  });

  it("rejeita chave desconhecida no payload", () => {
    const { error } = createDishSchema.validate({ ...base, extra: 1 });
    expect(error).toBeDefined();
    expect(error?.details[0]?.type).toBe("object.unknown");
  });
});
