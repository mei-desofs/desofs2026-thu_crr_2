import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";

const notifModel = vi.hoisted(() => ({
  create: vi.fn(),
  findByPk: vi.fn(),
  findAll: vi.fn(),
}));

vi.mock("../../src/Model/Notification", () => ({
  Notification: notifModel,
}));

import { NotificationController } from "../../src/Controller/NotificationController";

describe("NotificationController (integração, modelo Notification mockado)", () => {
  beforeEach(() => {
    notifModel.create.mockReset();
    notifModel.findByPk.mockReset();
    notifModel.findAll.mockReset();
  });

  it("create — 400 sem userId/title/body", async () => {
    const { res, status } = createMockResponse();
    await NotificationController.create(createMockRequest({ body: { userId: 1 } }), res);
    expect(status).toHaveBeenCalledWith(400);
  });

  it("create — 201", async () => {
    notifModel.create.mockResolvedValue({ id: 1, userId: 2, title: "T", body: "B", status: "sent" });
    const { res, status, json } = createMockResponse();
    await NotificationController.create(
      createMockRequest({ body: { userId: 2, title: "T", body: "B" } }),
      res
    );
    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({ id: 1, userId: 2, title: "T", body: "B", status: "sent" });
  });

  it("markAsSeen — 404", async () => {
    notifModel.findByPk.mockResolvedValue(null);
    const { res, status } = createMockResponse();
    await NotificationController.markAsSeen(createMockRequest({ params: { id: "99" } } as never), res);
    expect(status).toHaveBeenCalledWith(404);
  });

  it("markAsSeen — 200", async () => {
    const row = {
      status: "sent",
      save: vi.fn().mockResolvedValue(undefined),
    };
    notifModel.findByPk.mockResolvedValue(row);
    const { res, status } = createMockResponse();
    await NotificationController.markAsSeen(createMockRequest({ params: { id: "1" } } as never), res);
    expect(status).toHaveBeenCalledWith(200);
    expect(row.save).toHaveBeenCalled();
  });

  it("getByUserId — 200", async () => {
    notifModel.findAll.mockResolvedValue([]);
    const { res, json } = createMockResponse();
    await NotificationController.getByUserId(
      createMockRequest({ params: { userId: "5" }, query: {} } as never),
      res
    );
    expect(json).toHaveBeenCalledWith([]);
  });
});
