import { describe, it, expect } from "vitest";
import {
    registerUserSchema,
    loginSchema,
} from "../../../src/Schemas/UserValidation";

const baseUser = {
    name: "Ana",
    email: "ana@example.com",
    password: "verysafe123",
    role: "Student",
};

describe("registerUserSchema", () => {
    it("accepts a valid Student payload (no refeitorioId, no canteenId)", () => {
        const { error } = registerUserSchema.validate(baseUser);
        expect(error).toBeUndefined();
    });

    it("rejects invalid email", () => {
        const { error } = registerUserSchema.validate({ ...baseUser, email: "not-an-email" });
        expect(error).toBeDefined();
        expect(error?.details.some((d) => d.path.includes("email"))).toBe(true);
    });

    it("rejects password shorter than 8 chars", () => {
        const { error } = registerUserSchema.validate({ ...baseUser, password: "short" });
        expect(error).toBeDefined();
    });

    it("rejects unknown role", () => {
        const { error } = registerUserSchema.validate({ ...baseUser, role: "Superuser" });
        expect(error).toBeDefined();
    });

    it("requires refeitorioId for RefectoryManager", () => {
        const { error } = registerUserSchema.validate({ ...baseUser, role: "RefectoryManager" });
        expect(error).toBeDefined();
        expect(error?.details.some((d) => d.path.includes("refeitorioId"))).toBe(true);
    });

    it("requires refeitorioId for RefectoryStaff", () => {
        const { error } = registerUserSchema.validate({ ...baseUser, role: "RefectoryStaff" });
        expect(error).toBeDefined();
    });

    it("requires canteenId for CanteenManager", () => {
        const { error } = registerUserSchema.validate({ ...baseUser, role: "CanteenManager" });
        expect(error).toBeDefined();
        expect(error?.details.some((d) => d.path.includes("canteenId"))).toBe(true);
    });

    it("forbids canteenId on Student role", () => {
        const { error } = registerUserSchema.validate({ ...baseUser, canteenId: 5 });
        expect(error).toBeDefined();
    });

    it("forbids refeitorioId on CanteenManager role", () => {
        const { error } = registerUserSchema.validate({
            ...baseUser,
            role: "CanteenManager",
            canteenId: 5,
            refeitorioId: 1,
        });
        expect(error).toBeDefined();
    });

    it("accepts complete RefectoryManager payload", () => {
        const { error } = registerUserSchema.validate({
            ...baseUser,
            role: "RefectoryManager",
            refeitorioId: 7,
        });
        expect(error).toBeUndefined();
    });

    it("rejects unknown keys", () => {
        const { error } = registerUserSchema.validate({ ...baseUser, isAdmin: true });
        expect(error).toBeDefined();
    });
});

describe("loginSchema", () => {
    it("accepts valid credentials", () => {
        const { error } = loginSchema.validate({ email: "ana@x.pt", password: "anything" });
        expect(error).toBeUndefined();
    });

    it("rejects missing password", () => {
        const { error } = loginSchema.validate({ email: "ana@x.pt" });
        expect(error).toBeDefined();
    });

    it("rejects malformed email", () => {
        const { error } = loginSchema.validate({ email: "not-an-email", password: "x" });
        expect(error).toBeDefined();
    });
});
