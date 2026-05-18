import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";

const instSvc = vi.hoisted(() => ({
  createInstitution: vi.fn(),
  getAllInstitutions: vi.fn(),
  getInstitutionById: vi.fn(),
}));

vi.mock("../../src/Service/InstitutionService", () => ({
  InstitutionService: instSvc,
}));

import { InstitutionController } from "../../src/Controller/InstitutionController";

describe("InstitutionController (integração, InstitutionService mockado)", () => {
  beforeEach(() => {
    instSvc.createInstitution.mockReset();
    instSvc.getAllInstitutions.mockReset();
    instSvc.getInstitutionById.mockReset();
  });

  it("createInstitution — 400 sem campos", async () => {
    const { res, status } = createMockResponse();
    await InstitutionController.createInstitution(createMockRequest({ body: { name: "X" } }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("createInstitution — 400 idmenutype inválido", async () => {
    const { res, status } = createMockResponse();
    await InstitutionController.createInstitution(
      createMockRequest({ body: { name: "Escola", idmenutype: 0, location: "Rua" } }),
      res
    );
    expect(status).toHaveBeenCalledWith(400);
  });

  it("createInstitution — 404 MENU_TYPE_NOT_FOUND", async () => {
    instSvc.createInstitution.mockRejectedValue(new Error("MENU_TYPE_NOT_FOUND"));
    const { res, status } = createMockResponse();
    await InstitutionController.createInstitution(
      createMockRequest({ body: { name: "Escola", idmenutype: 1, location: "Rua" } }),
      res
    );
    expect(status).toHaveBeenCalledWith(404);
  });

  it("createInstitution — 201", async () => {
    instSvc.createInstitution.mockResolvedValue({ id: 1, name: "Escola" });
    const { res, status, json } = createMockResponse();
    await InstitutionController.createInstitution(
      createMockRequest({ body: { name: "Escola", idmenutype: 1, location: "Rua" } }),
      res
    );
    expect(status).toHaveBeenCalledWith(201);
    expect(json.mock.calls[0][0]).toMatchObject({ institution: { id: 1, name: "Escola" } });
  });

  it("getInstitutionById — 404", async () => {
    instSvc.getInstitutionById.mockRejectedValue(new Error("INSTITUTION_NOT_FOUND"));
    const { res, status } = createMockResponse();
    await InstitutionController.getInstitutionById(createMockRequest({ params: { id: "9" } } as never), res);
    expect(status).toHaveBeenCalledWith(404);
  });

  it("getAllInstitutions — 200", async () => {
    instSvc.getAllInstitutions.mockResolvedValue([]);
    const { res, json } = createMockResponse();
    await InstitutionController.getAllInstitutions(createMockRequest({}), res);
    expect(json).toHaveBeenCalledWith([]);
  });
});
