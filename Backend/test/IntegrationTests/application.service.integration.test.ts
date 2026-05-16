import { describe, it, expect, beforeEach, vi } from "vitest";
import type { DocumentInfo } from "../../src/Model/Application";

const mocks = vi.hoisted(() => ({
  createFarmerProducts: vi.fn().mockResolvedValue(undefined),
  getParishByName: vi.fn(),
  createParish: vi.fn(),
}));

vi.mock("../../src/Model/Application", () => ({
  Application: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
}));

vi.mock("../../src/Service/FarmerProductsService", () => ({
  FarmerProductService: class {
    createFarmerProducts = mocks.createFarmerProducts;
  },
}));

vi.mock("../../src/Service/ParishService", () => ({
  ParishService: class {
    getParishByName = mocks.getParishByName;
    createParish = mocks.createParish;
  },
}));

import { Application } from "../../src/Model/Application";
import { ApplicationService } from "../../src/Service/ApplicationService";

type ApplicationModelMock = {
  findOne: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
};

const ApplicationMock = Application as unknown as ApplicationModelMock;

describe("ApplicationService (integração, Application + serviços mockados)", () => {
  let service: ApplicationService;

  const docs: DocumentInfo[] = [];
  const basePayload = () => ({
    userId: 42,
    businessEmail: "biz@mail.pt",
    businessPhone: "912000000",
    documentsSubmitted: docs,
    name: "Quinta do Vale",
    location: "Rua Principal, 10",
    freguesia: "Souselo",
    municipio: "Resende",
    farmerProducts: [] as {
      week: number;
      products: { productId: number; quantity: number; unit: string }[];
    }[],
  });

  beforeEach(() => {
    service = new ApplicationService();
    ApplicationMock.findOne.mockReset();
    ApplicationMock.create.mockReset();
    mocks.createFarmerProducts.mockReset();
    mocks.getParishByName.mockReset();
    mocks.createParish.mockReset();
    mocks.createFarmerProducts.mockResolvedValue(undefined);
  });

  it("createApplication — rejeita quando já existe candidatura para o userId", async () => {
    ApplicationMock.findOne.mockResolvedValueOnce({ id: 1, userId: 42 });

    await expect(service.createApplication(basePayload())).rejects.toThrow("APPLICATION_ALREADY_EXISTS");
    expect(ApplicationMock.create).not.toHaveBeenCalled();
  });

  it("createApplication — persiste, cria produtos de agricultor e resolve freguesia existente", async () => {
    ApplicationMock.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 10, userId: 42, farmerProducts: [] });
    ApplicationMock.create.mockResolvedValue({ id: 10, userId: 42 } as never);
    mocks.getParishByName.mockResolvedValue({ id: 5, name: "Souselo", quarantined: false });

    const result = await service.createApplication(basePayload());

    expect(ApplicationMock.create).toHaveBeenCalledTimes(1);
    expect(mocks.createFarmerProducts).toHaveBeenCalledWith(42, 10, []);
    expect(mocks.createParish).not.toHaveBeenCalled();
    expect(result).toEqual({ id: 10, userId: 42, farmerProducts: [] });
  });

  it("createApplication — cria freguesia quando ainda não existe", async () => {
    ApplicationMock.findOne
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 11, farmerProducts: [] });
    ApplicationMock.create.mockResolvedValue({ id: 11, userId: 42 } as never);
    mocks.getParishByName.mockResolvedValue(null);
    mocks.createParish.mockResolvedValue(undefined);

    await service.createApplication(basePayload());

    expect(mocks.createParish).toHaveBeenCalledWith({ name: "Souselo" });
  });
});
