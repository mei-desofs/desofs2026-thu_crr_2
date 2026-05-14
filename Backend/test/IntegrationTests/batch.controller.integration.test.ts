import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";
import { daysFromNow } from "../UnitTests/helpers/dates";

const batchSvc = vi.hoisted(() => ({
  createBatch: vi.fn(),
  listBatches: vi.fn(),
  getBatchById: vi.fn(),
}));

vi.mock("../../src/Service/BatchService", () => ({
  BatchService: class {
    createBatch = batchSvc.createBatch;
    listBatches = batchSvc.listBatches;
    getBatchById = batchSvc.getBatchById;
  },
}));

import { BatchController } from "../../src/Controller/BatchController";

const validBatch = () => ({
  expirationDate: daysFromNow(10),
  productId: 1,
  quantity: 10,
  unitId: 1,
  bio: false,
});

describe("BatchController (integração, BatchService mockado)", () => {
  beforeEach(() => {
    Object.values(batchSvc).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset());
  });

  it("createBatch — 400 validação", async () => {
    const { res, status } = createMockResponse();
    await BatchController.createBatch(createMockRequest({ body: {} }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("createBatch — 404 UNIT_NOT_FOUND", async () => {
    batchSvc.createBatch.mockRejectedValue(new Error("UNIT_NOT_FOUND"));
    const { res, status } = createMockResponse();
    await BatchController.createBatch(createMockRequest({ body: validBatch() }), res);
    expect(status).toHaveBeenCalledWith(404);
  });

  it("createBatch — 200", async () => {
    batchSvc.createBatch.mockResolvedValue({ id: 1 });
    const { res, json } = createMockResponse();
    await BatchController.createBatch(createMockRequest({ body: validBatch() }), res);
    expect(json).toHaveBeenCalledWith({ id: 1 });
  });

  it("getBatch — 404", async () => {
    batchSvc.getBatchById.mockRejectedValue(new Error("BATCH_NOT_FOUND"));
    const { res, status } = createMockResponse();
    await BatchController.getBatch(createMockRequest({ params: { id: "9" } } as never), res);
    expect(status).toHaveBeenCalledWith(404);
  });
});
