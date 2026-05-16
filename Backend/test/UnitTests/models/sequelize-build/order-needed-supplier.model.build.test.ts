import { describe, it, expect } from "vitest";
import { Order } from "../../../../src/Model/Order";
import { NeededProduct } from "../../../../src/Model/NeededProduct";
import { SupplierOrder } from "../../../../src/Model/SupplierOrder";

describe("Order (Model.build)", () => {
  const minimal = {
    userId: 5,
    neededProductId: 2,
    productId: 11,
    unit: "kg",
    quantity: 7.5,
    date: new Date("2026-06-01"),
    canteenId: 20,
  };

  it("default status pending", () => {
    const o = Order.build(minimal);
    expect(o.status).toBe("pending");
  });

  it.each(["pending", "sent", "confirmed", "rejected", "cancelled", "delivered"] as const)(
    "aceita status %s",
    (status) => {
      const o = Order.build({ ...minimal, status });
      expect(o.status).toBe(status);
    }
  );

  it("preserva quantity decimal", () => {
    const o = Order.build({ ...minimal, quantity: 4.16 });
    expect(o.quantity).toBe(4.16);
  });

  it("preserva userId e neededProductId", () => {
    const o = Order.build({ ...minimal, userId: 1, neededProductId: 99 });
    expect(o.userId).toBe(1);
    expect(o.neededProductId).toBe(99);
  });
});

describe("NeededProduct (Model.build)", () => {
  const minimal = {
    date: new Date("2026-01-15"),
    productId: 11,
    mealId: 3,
    unit: "kg",
    quantity: 2.75,
    canteenId: 1,
  };

  it("default status needed", () => {
    const n = NeededProduct.build(minimal);
    expect(n.status).toBe("needed");
  });

  it.each(["needed", "ordered", "received"] as const)("aceita status %s", (status) => {
    const n = NeededProduct.build({ ...minimal, status });
    expect(n.status).toBe(status);
  });

  it("liga mealId e productId", () => {
    const n = NeededProduct.build({ ...minimal, mealId: 10, productId: 27 });
    expect(n.mealId).toBe(10);
    expect(n.productId).toBe(27);
  });

  it("aceita quantidade fraccionada", () => {
    const n = NeededProduct.build({ ...minimal, quantity: 0.25 });
    expect(n.quantity).toBe(0.25);
  });
});

describe("SupplierOrder (Model.build)", () => {
  it("composite key supplierId + position", () => {
    const s = SupplierOrder.build({
      supplierId: 7,
      position: 1,
      applicationDate: new Date("2026-03-01"),
    });
    expect(s.supplierId).toBe(7);
    expect(s.position).toBe(1);
  });

  it("outra posição no mesmo fornecedor", () => {
    const s = SupplierOrder.build({
      supplierId: 7,
      position: 2,
      applicationDate: new Date("2026-03-02"),
    });
    expect(s.position).toBe(2);
  });
});
