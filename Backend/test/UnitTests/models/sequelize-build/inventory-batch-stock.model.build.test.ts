import { describe, it, expect } from "vitest";
import { Batch } from "../../../../src/Model/Batch";
import { Stock } from "../../../../src/Model/Stock";

describe("Batch (Model.build)", () => {
  it("bio true", () => {
    const b = Batch.build({
      expirationDate: new Date("2026-12-01"),
      productId: 1,
      quantity: 100,
      unitId: 2,
      bio: true,
    });
    expect(b.bio).toBe(true);
  });

  it("bio false", () => {
    const b = Batch.build({
      expirationDate: new Date("2026-11-01"),
      productId: 2,
      quantity: 50,
      unitId: 1,
      bio: false,
    });
    expect(b.bio).toBe(false);
  });

  it("quantity fraccionada", () => {
    const b = Batch.build({
      expirationDate: new Date("2026-10-01"),
      productId: 1,
      quantity: 12.5,
      unitId: 3,
      bio: true,
    });
    expect(b.quantity).toBe(12.5);
  });
});

describe("Stock (Model.build)", () => {
  it("batches array", () => {
    const s = Stock.build({
      updatedDate: new Date(),
      minimumCapacity: 0,
      maximumCapacity: 1000,
      currentQuantity: 50,
      batches: [1, 2, 3],
    });
    expect(s.batches).toEqual([1, 2, 3]);
    expect(s.currentQuantity).toBe(50);
  });

  it("capacidades mín/máx", () => {
    const s = Stock.build({
      updatedDate: new Date(),
      minimumCapacity: 10,
      maximumCapacity: 500,
      currentQuantity: 100,
      batches: [],
    });
    expect(s.minimumCapacity).toBe(10);
    expect(s.maximumCapacity).toBe(500);
  });

  it("batches vazio", () => {
    const s = Stock.build({
      updatedDate: new Date(),
      minimumCapacity: 0,
      maximumCapacity: 1,
      currentQuantity: 0,
      batches: [],
    });
    expect(s.batches).toEqual([]);
  });
});
