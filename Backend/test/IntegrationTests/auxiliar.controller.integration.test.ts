import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";

const auxSvc = vi.hoisted(() => ({
  createAllergen: vi.fn(),
  listAllergens: vi.fn(),
  createNutritionType: vi.fn(),
  listNutritionTypes: vi.fn(),
  createProductType: vi.fn(),
  listProductTypes: vi.fn(),
  createUnit: vi.fn(),
  listUnits: vi.fn(),
  createDishType: vi.fn(),
  listDishTypes: vi.fn(),
  createMealType: vi.fn(),
  listMealTypes: vi.fn(),
  createMenuType: vi.fn(),
  listMenuTypes: vi.fn(),
  listOrderedSuppliers: vi.fn(),
}));

vi.mock("../../src/Service/AuxiliarService", () => ({
  AuxiliarService: class {
    createAllergen = auxSvc.createAllergen;
    listAllergens = auxSvc.listAllergens;
    createNutritionType = auxSvc.createNutritionType;
    listNutritionTypes = auxSvc.listNutritionTypes;
    createProductType = auxSvc.createProductType;
    listProductTypes = auxSvc.listProductTypes;
    createUnit = auxSvc.createUnit;
    listUnits = auxSvc.listUnits;
    createDishType = auxSvc.createDishType;
    listDishTypes = auxSvc.listDishTypes;
    createMealType = auxSvc.createMealType;
    listMealTypes = auxSvc.listMealTypes;
    createMenuType = auxSvc.createMenuType;
    listMenuTypes = auxSvc.listMenuTypes;
    listOrderedSuppliers = auxSvc.listOrderedSuppliers;
  },
}));

import { AuxiliarController } from "../../src/Controller/AuxiliarController";

describe("AuxiliarController (integração, AuxiliarService mockado)", () => {
  beforeEach(() => {
    Object.values(auxSvc).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset());
  });

  it("createAllergen — 400", async () => {
    const { res, status } = createMockResponse();
    await AuxiliarController.createAllergen(createMockRequest({ body: { name: "A" } }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("createAllergen — 409", async () => {
    auxSvc.createAllergen.mockRejectedValue(new Error("ALLERGEN_ALREADY_EXISTS"));
    const { res, status } = createMockResponse();
    await AuxiliarController.createAllergen(createMockRequest({ body: { name: "Gluten" } }), res);
    expect(status).toHaveBeenCalledWith(409);
  });

  it("createUnit — 400 unidade inválida", async () => {
    const { res, status } = createMockResponse();
    await AuxiliarController.createUnit(createMockRequest({ body: { name: "ton" } }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("createUnit — 200", async () => {
    auxSvc.createUnit.mockResolvedValue({ id: 1, name: "kg" });
    const { res, json } = createMockResponse();
    await AuxiliarController.createUnit(createMockRequest({ body: { name: "kg" } }), res);
    expect(json).toHaveBeenCalledWith({ id: 1, name: "kg" });
  });

  it("createMenuType — 409", async () => {
    auxSvc.createMenuType.mockRejectedValue(new Error("MENU_TYPE_ALREADY_EXISTS"));
    const { res, status } = createMockResponse();
    await AuxiliarController.createMenuType(createMockRequest({ body: { name: "Menu" } }), res);
    expect(status).toHaveBeenCalledWith(409);
  });

  it("listMenuTypes", async () => {
    auxSvc.listMenuTypes.mockResolvedValue([{ id: 1 }]);
    const { res, json } = createMockResponse();
    await AuxiliarController.listMenuTypes(createMockRequest({}), res);
    expect(json).toHaveBeenCalledWith([{ id: 1 }]);
  });
});
