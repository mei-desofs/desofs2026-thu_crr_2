import { describe, it, expect } from "vitest";
import { createMenuSchema } from "../../../src/Schemas/MenuValidation";
import { daysFromNow } from "../helpers/dates";

const base = () => ({
  menuTypeId: 1,
  initialDate: daysFromNow(2),
  finalDate: daysFromNow(5),
  meals: [10, 20],
  canteenId: 3,
});

describe("createMenuSchema (Joi)", () => {
  it("aceita payload com datas futuras", () => {
    const { error, value } = createMenuSchema.validate(base());
    expect(error).toBeUndefined();
    expect(value.canteenId).toBe(3);
  });

  it("rejeita menuTypeId em falta", () => {
    const { menuTypeId: _, ...rest } = base();
    const { error } = createMenuSchema.validate(rest);
    expect(error).toBeDefined();
    expect(error?.details[0]?.path).toContain("menuTypeId");
  });

  it("rejeita meals em falta", () => {
    const { meals: _, ...rest } = base();
    const { error } = createMenuSchema.validate(rest);
    expect(error).toBeDefined();
    expect(error?.details[0]?.path).toContain("meals");
  });

  it("rejeita canteenId não positivo", () => {
    const { error } = createMenuSchema.validate({ ...base(), canteenId: 0 });
    expect(error).toBeDefined();
  });

  it("rejeita initialDate em falta", () => {
    const { initialDate: _, ...rest } = base();
    const { error } = createMenuSchema.validate(rest);
    expect(error).toBeDefined();
  });

  it("rejeita finalDate em falta", () => {
    const { finalDate: _, ...rest } = base();
    const { error } = createMenuSchema.validate(rest);
    expect(error).toBeDefined();
  });

  it("rejeita canteenId em falta", () => {
    const { canteenId: _, ...rest } = base();
    const { error } = createMenuSchema.validate(rest);
    expect(error).toBeDefined();
  });

  it("rejeita datas no passado", () => {
    const past = new Date(Date.now() - 86_400_000);
    const { error } = createMenuSchema.validate({
      ...base(),
      initialDate: past,
      finalDate: past,
    });
    expect(error).toBeDefined();
  });

  it("rejeita menuTypeId zero", () => {
    const { error } = createMenuSchema.validate({ ...base(), menuTypeId: 0 });
    expect(error).toBeDefined();
  });

  it("aceita lista de refeições com vários ids", () => {
    const { error } = createMenuSchema.validate({ ...base(), meals: [1, 2, 3, 99] });
    expect(error).toBeUndefined();
  });

  it("rejeita meal id zero no array", () => {
    const { error } = createMenuSchema.validate({ ...base(), meals: [0, 1] });
    expect(error).toBeDefined();
  });

  it("rejeita meal id negativo", () => {
    const { error } = createMenuSchema.validate({ ...base(), meals: [-1, 2] });
    expect(error).toBeDefined();
  });

  it("rejeita meals como valor único", () => {
    const { error } = createMenuSchema.validate({ ...base(), meals: 1 as unknown as number[] });
    expect(error).toBeDefined();
  });

  it("rejeita menuTypeId decimal", () => {
    const { error } = createMenuSchema.validate({ ...base(), menuTypeId: 1.5 });
    expect(error).toBeDefined();
  });

  it("rejeita canteenId negativo", () => {
    const { error } = createMenuSchema.validate({ ...base(), canteenId: -3 });
    expect(error).toBeDefined();
  });

  it("aceita meals com um único id", () => {
    const { error } = createMenuSchema.validate({ ...base(), meals: [42] });
    expect(error).toBeUndefined();
  });

  it("rejeita initialDate inválida", () => {
    const { error } = createMenuSchema.validate({
      ...base(),
      initialDate: "foo" as unknown as Date,
    });
    expect(error).toBeDefined();
  });

  it("rejeita finalDate inválida", () => {
    const { error } = createMenuSchema.validate({
      ...base(),
      finalDate: "bar" as unknown as Date,
    });
    expect(error).toBeDefined();
  });

  it("rejeita menuTypeId undefined", () => {
    const { error } = createMenuSchema.validate({ ...base(), menuTypeId: undefined });
    expect(error).toBeDefined();
  });

  it("rejeita meals undefined", () => {
    const { error } = createMenuSchema.validate({ ...base(), meals: undefined });
    expect(error).toBeDefined();
  });

  it("rejeita canteenId undefined", () => {
    const { error } = createMenuSchema.validate({ ...base(), canteenId: undefined });
    expect(error).toBeDefined();
  });

  it("rejeita menuTypeId como string não numérica", () => {
    const { error } = createMenuSchema.validate({ ...base(), menuTypeId: "x" as unknown as number });
    expect(error).toBeDefined();
  });

  it("aceita meals com muitos ids", () => {
    const meals = Array.from({ length: 30 }, (_, i) => i + 1);
    const { error } = createMenuSchema.validate({ ...base(), meals });
    expect(error).toBeUndefined();
  });
});
