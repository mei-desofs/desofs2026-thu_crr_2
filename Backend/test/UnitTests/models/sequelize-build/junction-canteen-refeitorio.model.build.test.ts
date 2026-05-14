import { describe, it, expect } from "vitest";
import { CanteenRefeitorio } from "../../../../src/Model/CanteenRefeitorio";

describe("CanteenRefeitorio (Model.build)", () => {
  it("associação cantina–refeitório", () => {
    const cr = CanteenRefeitorio.build({ canteenId: 1, refeitorioId: 2 });
    expect(cr.canteenId).toBe(1);
    expect(cr.refeitorioId).toBe(2);
  });

  it("outro par", () => {
    const cr = CanteenRefeitorio.build({ canteenId: 3, refeitorioId: 1 });
    expect(cr.canteenId).toBe(3);
  });

  it("ids altos", () => {
    const cr = CanteenRefeitorio.build({ canteenId: 999, refeitorioId: 1000 });
    expect(cr.refeitorioId).toBe(1000);
  });

  it("com id explícito", () => {
    const cr = CanteenRefeitorio.build({ id: 1, canteenId: 1, refeitorioId: 1 });
    expect(cr.id).toBe(1);
  });
});
