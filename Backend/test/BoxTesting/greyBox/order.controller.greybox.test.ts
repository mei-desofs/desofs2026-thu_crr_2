import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "../helpers/mockExpress";

const orderSvc = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  updateStatus: vi.fn(),
  delete: vi.fn(),
  getByUserId: vi.fn(),
  getAll: vi.fn(),
}));

vi.mock("../../../src/Service/OrderService", () => ({
  OrderService: orderSvc,
}));

import { OrderController } from "../../../src/Controller/OrderController";

const validOrderBody = {
  userId: 1,
  neededProductId: 2,
  productId: 3,
  unit: "kg",
  quantity: 10,
  date: "2026-06-15",
  canteenId: 4,
};

/**
 * Grey box: conhece-se a arquitetura controller → service, mas a persistência fica mockada.
 */
describe("Grey box — OrderController com OrderService mockado", () => {
  beforeEach(() => {
    orderSvc.create.mockReset();
    orderSvc.update.mockReset();
    orderSvc.updateStatus.mockReset();
    orderSvc.delete.mockReset();
    orderSvc.getByUserId.mockReset();
    orderSvc.getAll.mockReset();
  });

  it("GB-01: create devolve 400 quando faltam campos obrigatórios", async () => {
    const { res, status } = createMockResponse();

    await OrderController.create(createMockRequest({ body: { userId: 1 } }), res);

    expect(status).toHaveBeenCalledWith(400);
    expect(orderSvc.create).not.toHaveBeenCalled();
  });

  it("GB-02: create devolve 201 e corpo da encomenda quando payload é válido", async () => {
    orderSvc.create.mockResolvedValue({ id: 99, status: "pending", ...validOrderBody });
    const { res, status, json } = createMockResponse();

    await OrderController.create(createMockRequest({ body: validOrderBody }), res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(expect.objectContaining({ id: 99, status: "pending" }));
    expect(orderSvc.create).toHaveBeenCalledWith(
      validOrderBody.userId,
      validOrderBody.neededProductId,
      validOrderBody.productId,
      validOrderBody.unit,
      validOrderBody.quantity,
      validOrderBody.date,
      validOrderBody.canteenId
    );
  });

  it("GB-03: updateStatus devolve 400 para estado inválido", async () => {
    const { res, status } = createMockResponse();

    await OrderController.updateStatus(
      createMockRequest({ params: { id: "1" }, body: { status: "inexistente" } } as never),
      res
    );

    expect(status).toHaveBeenCalledWith(400);
    expect(orderSvc.updateStatus).not.toHaveBeenCalled();
  });

  it("GB-04: updateStatus devolve 200 quando estado é permitido", async () => {
    orderSvc.updateStatus.mockResolvedValue({ id: 1, status: "confirmed" });
    const { res, status, json } = createMockResponse();

    await OrderController.updateStatus(
      createMockRequest({ params: { id: "1" }, body: { status: "confirmed" } } as never),
      res
    );

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ id: 1, status: "confirmed" });
    expect(orderSvc.updateStatus).toHaveBeenCalledWith(1, "confirmed");
  });

  it("GB-05: getAll devolve 200 com lista de encomendas", async () => {
    orderSvc.getAll.mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const { res, status, json } = createMockResponse();

    await OrderController.getAll(createMockRequest({}), res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith([{ id: 1 }, { id: 2 }]);
  });
});
