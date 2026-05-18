import { describe, it, expect } from "vitest";
import { Menu } from "../../../../src/Model/Menu";
import { Meal } from "../../../../src/Model/Meal";
import { Dish } from "../../../../src/Model/Dish";

describe("Menu (Model.build)", () => {
  const minimal = {
    menuTypeId: 1,
    initialDate: new Date("2026-01-01"),
    finalDate: new Date("2026-01-07"),
    meals: [10, 11],
    canteenId: 1,
  };

  it("default status pending", () => {
    const m = Menu.build(minimal);
    expect(m.status).toBe("pending");
  });

  it.each(["published", "aproved", "pending"] as const)("aceita status %s", (status) => {
    const m = Menu.build({ ...minimal, status });
    expect(m.status).toBe(status);
  });

  it("meals como array de ids", () => {
    const m = Menu.build({ ...minimal, meals: [1, 2, 3] });
    expect(m.meals).toEqual([1, 2, 3]);
  });

  it("canteenId obrigatório em memória", () => {
    const m = Menu.build({ ...minimal, canteenId: 3 });
    expect(m.canteenId).toBe(3);
  });

  it("menuTypeId distinto", () => {
    const m = Menu.build({ ...minimal, menuTypeId: 2 });
    expect(m.menuTypeId).toBe(2);
  });

  it("intervalo de datas distinto", () => {
    const m = Menu.build({
      ...minimal,
      initialDate: new Date("2026-02-01"),
      finalDate: new Date("2026-02-28"),
    });
    expect(m.finalDate.getMonth()).toBe(1);
  });
});

describe("Meal (Model.build)", () => {
  it("constrói com cantina e refeitório", () => {
    const m = Meal.build({
      mealTypeId: 1,
      name: "Almoço",
      date: new Date("2026-06-10"),
      dishId: 2,
      canteenId: 1,
      refeitorioId: 2,
    });
    expect(m.name).toBe("Almoço");
    expect(m.canteenId).toBe(1);
    expect(m.refeitorioId).toBe(2);
  });

  it("aceita dishId alinhado com pratos", () => {
    const m = Meal.build({
      mealTypeId: 2,
      name: "Jantar",
      date: new Date("2026-06-11"),
      dishId: 15,
      canteenId: 2,
      refeitorioId: 1,
    });
    expect(m.dishId).toBe(15);
  });
});

describe("Dish (Model.build)", () => {
  it("mainProductsId como JSON/array", () => {
    const d = Dish.build({
      dishTypeId: 1,
      name: "Frango Assado com Batata",
      recipeId: 1,
      mainProductsId: [6, 11],
    });
    expect(d.mainProductsId).toEqual([6, 11]);
  });

  it.each([
    [1, "Carne de Vaca", 2],
    [2, "Bacalhau à Brás", 6],
    [3, "Massa com Tomate", 11],
  ] as const)("dishTypeId %i — %s", (dishTypeId, name, recipeId) => {
    const d = Dish.build({
      dishTypeId,
      name,
      recipeId,
      mainProductsId: [1],
    });
    expect(d.dishTypeId).toBe(dishTypeId);
    expect(d.name).toBe(name);
  });

  it("vários mainProductsId", () => {
    const d = Dish.build({
      dishTypeId: 2,
      name: "Salmão no Forno",
      recipeId: 8,
      mainProductsId: [19, 11, 23],
    });
    expect(d.mainProductsId).toHaveLength(3);
  });
});
