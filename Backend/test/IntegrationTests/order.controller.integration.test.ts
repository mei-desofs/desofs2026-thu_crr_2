import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";

const orderSvc = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  updateStatus: vi.fn(),
  delete: vi.fn(),
  getByUserId: vi.fn(),
  getAll: vi.fn(),
}));

vi.mock("../../src/Service/OrderService", () => ({
  OrderService: orderSvc,
}));

import { OrderController } from "../../src/Controller/OrderController";

describe("OrderController (integração, OrderService mockado)", () => {
  beforeEach(() => {
    Object.values(orderSvc).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset());
  });

  it("create — 400 campos em falta", async () => {
    const { res, status } = createMockResponse();
    await OrderController.create(createMockRequest({ body: { userId: 1 } }), res);
    expect(status).toHaveBeenCalledWith(400);
    expect(orderSvc.create).not.toHaveBeenCalled();
  });

  it("create — 201", async () => {
    orderSvc.create.mockResolvedValue({ id: 1, status: "pending" });
    const { res, status, json } = createMockResponse();
    await OrderController.create(
      createMockRequest({
        body: {
          userId: 1,
          neededProductId: 2,
          productId: 3,
          unit: "kg",
          quantity: 1,
          date: new Date("2026-07-01"),
          canteenId: 1,
        },
      }),
      res
    );
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({ id: 1, status: "pending" });
  });

  it("updateStatus — 400 status inválido", async () => {
    const { res, status } = createMockResponse();
    await OrderController.updateStatus(
      createMockRequest({ params: { id: "1" }, body: { status: "wrong" } } as never),
      res
    );
    expect(status).toHaveBeenCalledWith(400);
  });

  it("updateStatus — 200", async () => {
    orderSvc.updateStatus.mockResolvedValue({ id: 1, status: "delivered" });
    const { res, status, json } = createMockResponse();
    await OrderController.updateStatus(
      createMockRequest({ params: { id: "1" }, body: { status: "delivered" } } as never),
      res
    );
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ id: 1, status: "delivered" });
  });

  it("delete — 200", async () => {
    orderSvc.delete.mockResolvedValue(undefined);
    const { res, status, json } = createMockResponse();
    await OrderController.delete(createMockRequest({ params: { id: "5" } } as never), res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: "Order deleted successfully" });
  });

  it("getByUserId — 200", async () => {
    orderSvc.getByUserId.mockResolvedValue([{ id: 1 }]);
    const { res, json } = createMockResponse();
    await OrderController.getByUserId(createMockRequest({ params: { userid: "3" } } as never), res);
    expect(json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  it("getAll — 200", async () => {
    orderSvc.getAll.mockResolvedValue([]);
    const { res, json } = createMockResponse();
    await OrderController.getAll(createMockRequest({}), res);
    expect(json).toHaveBeenCalledWith([]);
  });
});
