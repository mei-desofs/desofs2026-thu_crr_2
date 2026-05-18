import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";
import { daysFromNow } from "../UnitTests/helpers/dates";

const menuSvc = vi.hoisted(() => ({
  createMenu: vi.fn(),
  listMenus: vi.fn(),
  getMenuById: vi.fn(),
  getCurrentWeekMenuDetailed: vi.fn(),
  updateMenuStatus: vi.fn(),
  getMenusByCanteen: vi.fn(),
}));

vi.mock("../../src/Service/MenuService", () => ({
  MenuService: class {
    createMenu = menuSvc.createMenu;
    listMenus = menuSvc.listMenus;
    getMenuById = menuSvc.getMenuById;
    getCurrentWeekMenuDetailed = menuSvc.getCurrentWeekMenuDetailed;
    updateMenuStatus = menuSvc.updateMenuStatus;
    getMenusByCanteen = menuSvc.getMenusByCanteen;
  },
}));

import { MenuController } from "../../src/Controller/MenuController";

const validMenuBody = () => ({
  menuTypeId: 1,
  initialDate: daysFromNow(2),
  finalDate: daysFromNow(5),
  meals: [1, 2],
  canteenId: 1,
});

describe("MenuController (integração, MenuService mockado)", () => {
  beforeEach(() => {
    Object.values(menuSvc).forEach((fn) => (fn as ReturnType<typeof vi.fn>).mockReset());
  });

  it("createMenu — 400 validação Joi", async () => {
    const { res, status } = createMockResponse();
    await MenuController.createMenu(createMockRequest({ body: {} }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("createMenu — 409 datas inválidas", async () => {
    menuSvc.createMenu.mockRejectedValue(new Error("FINAL_DATE_MUST_BE_GREATER_THAN_INITIAL_DATE"));
    const { res, status, json } = createMockResponse();
    await MenuController.createMenu(createMockRequest({ body: validMenuBody() }), res);
    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalledWith({ error: "Final date must be greater than initial date" });
  });

  it("createMenu — 404 MENU_TYPE_NOT_FOUND", async () => {
    menuSvc.createMenu.mockRejectedValue(new Error("MENU_TYPE_NOT_FOUND"));
    const { res, status } = createMockResponse();
    await MenuController.createMenu(createMockRequest({ body: validMenuBody() }), res);
    expect(status).toHaveBeenCalledWith(404);
  });

  it("getMenu — 400 id NaN", async () => {
    const { res, status } = createMockResponse();
    await MenuController.getMenu(createMockRequest({ params: { id: "x" } } as never), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("updateMenuStatus — 400 status inválido", async () => {
    const { res, status } = createMockResponse();
    await MenuController.updateMenuStatus(
      createMockRequest({ params: { id: "1" }, body: { status: "invalid" } } as never),
      res
    );
    expect(status).toHaveBeenCalledWith(400);
  });

  it("updateMenuStatus — 200", async () => {
    menuSvc.updateMenuStatus.mockResolvedValue({ id: 1, status: "published" });
    const { res, json } = createMockResponse();
    await MenuController.updateMenuStatus(
      createMockRequest({ params: { id: "1" }, body: { status: "published" } } as never),
      res
    );
    expect(json).toHaveBeenCalledWith({ id: 1, status: "published" });
  });

  it("getCurrentWeekMenu — 400 menuTypeId inválido", async () => {
    const { res, status } = createMockResponse();
    await MenuController.getCurrentWeekMenu(
      createMockRequest({ query: { menuTypeId: "bad" } } as never),
      res
    );
    expect(status).toHaveBeenCalledWith(400);
  });
});
