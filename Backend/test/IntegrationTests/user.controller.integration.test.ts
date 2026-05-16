import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Request } from "express";
import { createMockRequest, createMockResponse } from "./helpers/mockExpress";

vi.mock("../../src/Model/User", () => ({
  User: {
    findOne: vi.fn(),
    create: vi.fn(),
    findByPk: vi.fn(),
  },
}));

import { User } from "../../src/Model/User";
import { UserController } from "../../src/Controller/UserController";

type UserModelMock = {
  findOne: ReturnType<typeof vi.fn>;
  create: ReturnType<typeof vi.fn>;
  findByPk: ReturnType<typeof vi.fn>;
};

const UserMock = User as unknown as UserModelMock;

describe("UserController + UserService (integração, Sequelize User mockado)", () => {
  beforeEach(() => {
    UserMock.findOne.mockReset();
    UserMock.create.mockReset();
    UserMock.findByPk.mockReset();
  });

  it("register — 400 quando o email já existe", async () => {
    UserMock.findOne.mockResolvedValue({ id: 99, email: "dup@mail.pt" });

    const { res, status, json } = createMockResponse();
    const req = createMockRequest({
      body: {
        name: "Alice",
        email: "dup@mail.pt",
        password: "Password1",
        role: "Student",
      },
    });

    await UserController.register(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringMatching(/já registado/i) })
    );
    expect(UserMock.create).not.toHaveBeenCalled();
  });

  it("register — 201 e corpo sem password quando criação corre", async () => {
    UserMock.findOne.mockResolvedValue(null);
    UserMock.create.mockResolvedValue({
      id: 1,
      name: "Bob",
      email: "bob@mail.pt",
      role: "Student",
      status: "enabled",
      refeitorioId: undefined,
      canteenId: undefined,
    });

    const { res, status, json } = createMockResponse();
    const req = createMockRequest({
      body: {
        name: "Bob",
        email: "bob@mail.pt",
        password: "Password1",
        role: "Student",
      },
    });

    await UserController.register(req, res);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith({
      id: 1,
      name: "Bob",
      email: "bob@mail.pt",
      role: "Student",
      status: "enabled",
      refeitorioId: undefined,
      canteenId: undefined,
    });
    expect(UserMock.create).toHaveBeenCalledTimes(1);
    const createArg = UserMock.create.mock.calls[0][0];
    expect(createArg).toMatchObject({
      name: "Bob",
      email: "bob@mail.pt",
      role: "Student",
      status: "enabled",
    });
    expect(createArg.password).toBeDefined();
    expect(createArg.password).not.toBe("Password1");
  });

  it("register — 400 quando faltam campos obrigatórios", async () => {
    const { res, status, json } = createMockResponse();
    const req = createMockRequest({ body: { email: "only@mail.pt" } });

    await UserController.register(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringMatching(/obrigatórios/i) })
    );
    expect(UserMock.findOne).not.toHaveBeenCalled();
  });

  it("register — 400 CanteenManager sem canteenId", async () => {
    const { res, status, json } = createMockResponse();
    const req = createMockRequest({
      body: {
        name: "M",
        email: "m@mail.pt",
        password: "p",
        role: "CanteenManager",
      },
    });

    await UserController.register(req, res);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringMatching(/canteenId/i) })
    );
  });

  it("getById — 200 com utilizador", async () => {
    UserMock.findByPk.mockResolvedValue({
      id: 7,
      name: "Z",
      email: "z@z.pt",
      role: "Student",
      toJSON: () => ({ id: 7, name: "Z", email: "z@z.pt", role: "Student" }),
    });

    const { res, status, json } = createMockResponse();
    const req = { params: { id: "7" } } as unknown as Request;

    await UserController.getById(req, res);

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalled();
  });

  it("getById — 404 quando não existe", async () => {
    UserMock.findByPk.mockResolvedValue(null);

    const { res, status, json } = createMockResponse();
    const req = { params: { id: "404" } } as unknown as Request;

    await UserController.getById(req, res);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringMatching(/não encontrado/i) })
    );
  });
});
