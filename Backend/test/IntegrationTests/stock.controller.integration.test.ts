import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";
import { daysFromNow } from "../UnitTests/helpers/dates";

const stockSvc = vi.hoisted(() => ({
  createStock: vi.fn(),
  listStocks: vi.fn(),
  getStockById: vi.fn(),
}));

vi.mock("../../src/Service/StockService", () => ({
  StockService: class {
    createStock = stockSvc.createStock;
    listStocks = stockSvc.listStocks;
    getStockById = stockSvc.getStockById;
  },
}));

import { StockController } from "../../src/Controller/StockController";

const validStock = () => ({
  updatedDate: daysFromNow(1),
  minimumCapacity: 1,
  maximumCapacity: 100,
  currentQuantity: 50,
  batches: [1, 2],
  products: [{ productId: 1, quantity: 10, unitId: 1 }],
});

describe("StockController (integração, StockService mockado)", () => {
  beforeEach(() => {
    Object.values(stockSvc).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset());
  });

  it("createStock — 400", async () => {
    const { res, status } = createMockResponse();
    await StockController.createStock(createMockRequest({ body: {} }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("createStock — 409 capacidade", async () => {
    stockSvc.createStock.mockRejectedValue(new Error("MAXIMUM_CAPACITY_MUST_BE_GREATER_THAN_MINIMUM_CAPACITY"));
    const { res, status } = createMockResponse();
    await StockController.createStock(createMockRequest({ body: validStock() }), res);
    expect(status).toHaveBeenCalledWith(409);
  });

  it("createStock — 200", async () => {
    stockSvc.createStock.mockResolvedValue({ id: 1 });
    const { res, json } = createMockResponse();
    await StockController.createStock(createMockRequest({ body: validStock() }), res);
    expect(json).toHaveBeenCalledWith({ id: 1 });
  });

  it("getStock — 404", async () => {
    stockSvc.getStockById.mockRejectedValue(new Error("STOCK_NOT_FOUND"));
    const { res, status } = createMockResponse();
    await StockController.getStock(createMockRequest({ params: { id: "3" } } as never), res);
    expect(status).toHaveBeenCalledWith(404);
  });
});
