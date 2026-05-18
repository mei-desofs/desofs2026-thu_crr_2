import { describe, it, expect } from "vitest";
import { MenuType } from "../../../../src/Model/MenuType";
import { MealType } from "../../../../src/Model/MealType";
import { DishType } from "../../../../src/Model/DishType";
import { NutritionType } from "../../../../src/Model/NutritionType";
import { Allergen } from "../../../../src/Model/Allergen";
import { Unit, UnitEnum } from "../../../../src/Model/Unit";

describe("MenuType (Model.build)", () => {
  it("nome standard", () => {
    expect(MenuType.build({ name: "Standard" }).name).toBe("Standard");
  });
});

describe("MealType (Model.build)", () => {
  it("Almoço", () => {
    expect(MealType.build({ name: "Almoço" }).name).toBe("Almoço");
  });

  it("Jantar", () => {
    expect(MealType.build({ name: "Jantar" }).name).toBe("Jantar");
  });
});

describe("DishType (Model.build)", () => {
  it.each(["Meat", "Fish", "Vegetarian"] as const)("categoria %s da BD", (name) => {
    expect(DishType.build({ name }).name).toBe(name);
  });

  it("Sopa", () => {
    expect(DishType.build({ name: "Sopa" }).name).toBe("Sopa");
  });
});

describe("NutritionType (Model.build)", () => {
  it("Protein", () => {
    expect(NutritionType.build({ name: "Protein" }).name).toBe("Protein");
  });
});

describe("Allergen (Model.build)", () => {
  it("Gluten", () => {
    expect(Allergen.build({ name: "Gluten" }).name).toBe("Gluten");
  });
});

describe("Unit (Model.build)", () => {
  it.each(Object.values(UnitEnum))("unidade %s", (name) => {
    const u = Unit.build({ name });
    expect(u.name).toBe(name);
  });
});
