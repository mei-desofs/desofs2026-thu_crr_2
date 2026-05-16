import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";

const npSvc = vi.hoisted(() => ({
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
}));

vi.mock("../../src/Service/NeededProductService", () => ({
  NeededProductService: npSvc,
}));

import { NeededProductController } from "../../src/Controller/NeededProductController";

describe("NeededProductController (integração, NeededProductService mockado)", () => {
  beforeEach(() => {
    npSvc.create.mockReset();
    npSvc.update.mockReset();
    npSvc.delete.mockReset();
  });

  it("create — 400 sem campos obrigatórios", async () => {
    const { res, status } = createMockResponse();
    await NeededProductController.create(createMockRequest({ body: { date: new Date() } }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("create — 201", async () => {
    npSvc.create.mockResolvedValue({ id: 9 });
    const { res, status, json } = createMockResponse();
    await NeededProductController.create(
      createMockRequest({
        body: {
          date: "2026-06-01",
          productId: 1,
          mealId: 2,
          unit: "kg",
          quantity: 2,
          canteenId: 3,
        },
      }),
      res
    );
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({ id: 9 });
  });

  it("update — 200", async () => {
    npSvc.update.mockResolvedValue({ id: 1, quantity: 5 });
    const { res, json } = createMockResponse();
    await NeededProductController.update(
      createMockRequest({ params: { id: "1" }, body: { quantity: 5 } } as never),
      res
    );
    expect(json).toHaveBeenCalledWith({ id: 1, quantity: 5 });
  });

  it("delete — 200", async () => {
    npSvc.delete.mockResolvedValue(true);
    const { res, status, json } = createMockResponse();
    await NeededProductController.delete(createMockRequest({ params: { id: "2" } } as never), res);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: "NeededProduct deleted successfully" });
  });
});
