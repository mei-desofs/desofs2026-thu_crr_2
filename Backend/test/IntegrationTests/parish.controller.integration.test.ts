import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";

const parishSvc = vi.hoisted(() => ({
  createParish: vi.fn(),
  listParishes: vi.fn(),
  getParishById: vi.fn(),
  quarantineParish: vi.fn(),
  takeParishOfQuarantine: vi.fn(),
}));

vi.mock("../../src/Service/ParishService", () => ({
  ParishService: class {
    createParish = parishSvc.createParish;
    listParishes = parishSvc.listParishes;
    getParishById = parishSvc.getParishById;
    quarantineParish = parishSvc.quarantineParish;
    takeParishOfQuarantine = parishSvc.takeParishOfQuarantine;
  },
}));

import { ParishController } from "../../src/Controller/ParishController";

describe("ParishController (integração, ParishService mockado)", () => {
  beforeEach(() => {
    Object.values(parishSvc).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset());
  });

  it("createParish — 400 validação", async () => {
    const { res, status } = createMockResponse();
    await ParishController.createParish(createMockRequest({ body: { name: "A" } }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("createParish — 404 PARISH_ALREADY_EXISTS", async () => {
    parishSvc.createParish.mockRejectedValue(new Error("PARISH_ALREADY_EXISTS"));
    const { res, status } = createMockResponse();
    await ParishController.createParish(createMockRequest({ body: { name: "Lisboa" } }), res);
    expect(status).toHaveBeenCalledWith(404);
  });

  it("createParish — 200", async () => {
    parishSvc.createParish.mockResolvedValue({ id: 1, name: "Porto" });
    const { res, json } = createMockResponse();
    await ParishController.createParish(createMockRequest({ body: { name: "Porto" } }), res);
    expect(json).toHaveBeenCalledWith({ id: 1, name: "Porto" });
  });

  it("getParish — 400 id inválido", async () => {
    const { res, status } = createMockResponse();
    await ParishController.getParish(createMockRequest({ params: { id: "x" } } as never), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("getParish — 404", async () => {
    parishSvc.getParishById.mockRejectedValue(new Error("PARISH_NOT_FOUND"));
    const { res, status } = createMockResponse();
    await ParishController.getParish(createMockRequest({ params: { id: "1" } } as never), res);
    expect(status).toHaveBeenCalledWith(404);
  });

  it("listParishes — devolve lista", async () => {
    parishSvc.listParishes.mockResolvedValue([{ id: 1 }]);
    const { res, json } = createMockResponse();
    await ParishController.listParishes(createMockRequest({}), res);
    expect(json).toHaveBeenCalledWith([{ id: 1 }]);
  });
});
