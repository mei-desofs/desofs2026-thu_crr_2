import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

vi.hoisted(() => {
  process.env.JWT_SECRET = "whitebox-test-jwt-secret";
});

import { authMiddleware } from "../../../src/middlewares/authMiddleware";
import { authorizeRoles } from "../../../src/middlewares/authorizeRoles";

const SECRET = process.env.JWT_SECRET!;

function runMiddleware(
  middleware: (req: Request, res: Response, next: NextFunction) => unknown,
  req: Partial<Request>
) {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  const next = vi.fn();
  const res = { status, json } as unknown as Response;

  middleware(req as Request, res, next);

  return { status, json, next, res };
}

describe("White box — authMiddleware e authorizeRoles (ramos internos)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("WB-01: sem header Authorization devolve 401 Token não fornecido", () => {
    const { status, json, next } = runMiddleware(authMiddleware, { headers: {} });

    expect(next).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(401);
    expect(json).toHaveBeenCalledWith({ message: "Token não fornecido" });
  });

  it("WB-02: token JWT inválido devolve 403 Token inválido ou expirado", () => {
    const { status, json, next } = runMiddleware(authMiddleware, {
      headers: { authorization: "Bearer token-invalido" },
    });

    expect(next).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({ message: "Token inválido ou expirado" });
  });

  it("WB-03: JWT válido com id e role chama next() e preenche req.user", () => {
    const token = jwt.sign({ id: 42, role: "Student" }, SECRET);
    const req = { headers: { authorization: `Bearer ${token}` } } as Request;

    const { next } = runMiddleware(authMiddleware, req);

    expect(next).toHaveBeenCalledOnce();
    expect((req as Request & { user: { id: number; role: string } }).user).toEqual({
      id: 42,
      role: "Student",
    });
  });

  it("WB-04: JWT sem id no payload devolve 403 Token inválido", () => {
    const token = jwt.sign({ role: "Student" }, SECRET);
    const { status, json, next } = runMiddleware(authMiddleware, {
      headers: { authorization: `Bearer ${token}` },
    });

    expect(next).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({ message: "Token inválido" });
  });

  it("WB-05: authorizeRoles bloqueia role não autorizada com 403", () => {
    const guard = authorizeRoles("StockManager");
    const req = {
      user: { id: 1, role: "Student" },
      method: "GET",
      path: "/orders",
      headers: {},
    } as Request;

    const { status, json, next } = runMiddleware(guard, req);

    expect(next).not.toHaveBeenCalled();
    expect(status).toHaveBeenCalledWith(403);
    expect(json).toHaveBeenCalledWith({ message: "Sem permissão para aceder" });
  });
});
