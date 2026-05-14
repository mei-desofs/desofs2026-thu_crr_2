import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";

const productSvc = vi.hoisted(() => ({
  createProduct: vi.fn(),
  listProducts: vi.fn(),
  getProductById: vi.fn(),
}));

vi.mock("../../src/Service/ProductService", () => ({
  ProductService: class {
    createProduct = productSvc.createProduct;
    listProducts = productSvc.listProducts;
    getProductById = productSvc.getProductById;
  },
}));

import { ProductController } from "../../src/Controller/ProductController";

const validProduct = () => ({
  name: "Tomate",
  typeId: 1,
  unitId: 1,
  nutrition: [{ typeId: 1, percentage: 10 }],
  allergens: [] as number[],
});

describe("ProductController (integração, ProductService mockado)", () => {
  beforeEach(() => {
    Object.values(productSvc).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset());
  });

  it("createProduct — 400 validação", async () => {
    const { res, status } = createMockResponse();
    await ProductController.createProduct(createMockRequest({ body: {} }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("createProduct — 409 já existe", async () => {
    productSvc.createProduct.mockRejectedValue(new Error("PRODUCT_ALREADY_EXISTS"));
    const { res, status } = createMockResponse();
    await ProductController.createProduct(createMockRequest({ body: validProduct() }), res);
    expect(status).toHaveBeenCalledWith(409);
  });

  it("createProduct — 200", async () => {
    productSvc.createProduct.mockResolvedValue({ id: 3 });
    const { res, json } = createMockResponse();
    await ProductController.createProduct(createMockRequest({ body: validProduct() }), res);
    expect(json).toHaveBeenCalledWith({ id: 3 });
  });

  it("getProduct — 404", async () => {
    productSvc.getProductById.mockRejectedValue(new Error("PRODUCT_NOT_FOUND"));
    const { res, status } = createMockResponse();
    await ProductController.getProduct(createMockRequest({ params: { id: "1" } } as never), res);
    expect(status).toHaveBeenCalledWith(404);
  });

  it("listProducts", async () => {
    productSvc.listProducts.mockResolvedValue([]);
    const { res, json } = createMockResponse();
    await ProductController.listProducts(createMockRequest({}), res);
    expect(json).toHaveBeenCalledWith([]);
  });
});
