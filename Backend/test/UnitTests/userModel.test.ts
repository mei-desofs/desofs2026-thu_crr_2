import { describe, it, expect } from "vitest";
import { User } from "../../src/Model/User";

/**
 * Testes ao modelo Sequelize sem persistência (build in-memory),
 * no estilo de garantir campos obrigatórios / opcionais como nos exemplos em Java.
 */
describe("User model (Sequelize build)", () => {
  it("builds instance with required attributes", () => {
    const user = User.build({
      name: "Maria",
      email: "maria@example.com",
      password: "hashed",
      role: "Student",
      status: "enabled",
    });

    expect(user).toBeDefined();
    expect(user.name).toBe("Maria");
    expect(user.email).toBe("maria@example.com");
    expect(user.role).toBe("Student");
    expect(user.status).toBe("enabled");
  });

  it("optional refeitorioId and canteenId may be undefined", () => {
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

  it("persists optional ids when provided", () => {
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

  it("build includes id when supplied (e.g. read from DB)", () => {
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
});
