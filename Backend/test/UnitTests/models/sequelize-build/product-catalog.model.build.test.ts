import { describe, it, expect } from "vitest";
import { Product } from "../../../../src/Model/Product";
import { ProductType } from "../../../../src/Model/ProductType";

describe("ProductType (Model.build)", () => {
  it("tipo vegetal", () => {
    const pt = ProductType.build({ name: "Vegetal" });
    expect(pt.name).toBe("Vegetal");
  });

  it("outro nome", () => {
    const pt = ProductType.build({ name: "Carnes" });
    expect(pt.name).toBe("Carnes");
  });
});

describe("Product (Model.build)", () => {
  it("nutrition e allergens json", () => {
    const p = Product.build({
      name: "Tomate",
      typeId: 1,
      nutrition: [{ typeId: 1, percentage: 10 }],
      allergens: [1, 2],
    });
    expect(p.nutrition).toHaveLength(1);
    expect(p.allergens).toEqual([1, 2]);
  });

  it("nutrition vazio implícito", () => {
    const p = Product.build({
      name: "Arroz",
      typeId: 2,
      nutrition: [],
      allergens: [],
    });
    expect(p.name).toBe("Arroz");
  });

  it("várias entradas nutrition", () => {
    const p = Product.build({
      name: "Composto",
      typeId: 1,
      nutrition: [
        { typeId: 1, percentage: 20 },
        { typeId: 2, percentage: 15 },
      ],
      allergens: [3],
    });
    expect(p.nutrition).toHaveLength(2);
  });
});
