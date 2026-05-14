import { describe, it, expect } from "vitest";
import { User } from "../../../../src/Model/User";

describe("User (Sequelize Model.build)", () => {
  it("constrói com atributos obrigatórios", () => {
    const user = User.build({
      name: "Maria",
      email: "maria@example.com",
      password: "hashed",
      role: "Student",
      status: "enabled",
    });
    expect(user.name).toBe("Maria");
    expect(user.email).toBe("maria@example.com");
    expect(user.role).toBe("Student");
    expect(user.status).toBe("enabled");
  });

  it("refeitorioId e canteenId podem ser undefined", () => {
    const user = User.build({
      name: "João",
      email: "joao@example.com",
      password: "hashed",
      role: "Supplier",
      status: "enabled",
    });
    expect(user.refeitorioId).toBeUndefined();
    expect(user.canteenId).toBeUndefined();
  });

  it("aceita canteenId e refeitorioId opcionais", () => {
    const user = User.build({
      name: "Gestor",
      email: "gestor@example.com",
      password: "hashed",
      role: "CanteenManager",
      status: "enabled",
      canteenId: 1,
      refeitorioId: 2,
    });
    expect(user.canteenId).toBe(1);
    expect(user.refeitorioId).toBe(2);
  });

  it("aceita id vindo da BD", () => {
    const user = User.build({
      id: 42,
      name: "Ana",
      email: "ana@example.com",
      password: "hashed",
      role: "Nutritionist",
      status: "quarantine",
    });
    expect(user.id).toBe(42);
    expect(user.status).toBe("quarantine");
  });

  it("default status enabled quando omitido — persistência; build pode não preencher", () => {
    const user = User.build({
      name: "X",
      email: "x@example.com",
      password: "p",
      role: "Visitor",
      status: "enabled",
    });
    expect(user.status).toBe("enabled");
  });

  it.each([
    "Supplier",
    "NetworkManager",
    "Nutritionist",
    "Student",
    "Visitor",
    "NursingHome",
    "RefectoryStaff",
    "StockManager",
    "CanteenManager",
    "RefectoryManager",
  ] as const)("aceita role %s", (role) => {
    const u = User.build({
      name: "N",
      email: `${role}@t.com`,
      password: "p",
      role,
      status: "enabled",
    });
    expect(u.role).toBe(role);
  });
});
