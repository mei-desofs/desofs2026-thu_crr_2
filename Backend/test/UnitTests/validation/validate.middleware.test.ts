import { describe, it, expect, vi } from "vitest";
import Joi from "joi";
import type { Request, Response, NextFunction } from "express";
import { validate } from "../../../src/middlewares/validate";

function mockResponse() {
    const status = vi.fn().mockReturnThis();
    const json = vi.fn().mockReturnThis();
    const res = { status, json } as unknown as Response;
    return { res, status, json };
}

function mockNext() {
    return vi.fn() as unknown as NextFunction & ReturnType<typeof vi.fn>;
}

describe("validate middleware", () => {
    const bodySchema = Joi.object({
        name: Joi.string().min(2).required(),
        age: Joi.number().integer().min(0).required(),
    });

    it("calls next() and writes coerced value back to req.body on success", () => {
        const next = mockNext();
        const { res, status } = mockResponse();
        const req = { body: { name: "Alice", age: "30" } } as Request;

        validate(bodySchema, "body")(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(status).not.toHaveBeenCalled();
        expect(req.body.age).toBe(30); // coerced to number
    });

    it("returns 400 with all errors when body is invalid", () => {
        const next = mockNext();
        const { res, status, json } = mockResponse();
        const req = { body: { name: "x" } } as Request;

        validate(bodySchema, "body")(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(400);
        const payload = json.mock.calls[0][0];
        expect(payload.error).toBe("Validation failed");
        expect(Array.isArray(payload.details)).toBe(true);
        const fields = payload.details.map((d: any) => d.field);
        expect(fields).toContain("name");
        expect(fields).toContain("age");
    });

    it("rejects unknown keys by default (Joi.object default)", () => {
        const next = mockNext();
        const { res, status, json } = mockResponse();
        const req = { body: { name: "Alice", age: 30, extra: "bad" } } as Request;

        validate(bodySchema, "body")(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(400);
        const fields = json.mock.calls[0][0].details.map((d: any) => d.field);
        expect(fields).toContain("extra");
    });

    it("validates params and writes coerced value into req.params", () => {
        const next = mockNext();
        const { res, status } = mockResponse();
        const paramsSchema = Joi.object({
            id: Joi.number().integer().positive().required(),
        });
        const req = { params: { id: "42" } } as unknown as Request;

        validate(paramsSchema, "params")(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(status).not.toHaveBeenCalled();
        expect((req.params as any).id).toBe(42);
    });

    it("rejects invalid params", () => {
        const next = mockNext();
        const { res, status } = mockResponse();
        const paramsSchema = Joi.object({
            id: Joi.number().integer().positive().required(),
        });
        const req = { params: { id: "abc" } } as unknown as Request;

        validate(paramsSchema, "params")(req, res, next);

        expect(next).not.toHaveBeenCalled();
        expect(status).toHaveBeenCalledWith(400);
    });

    it("validates query without reassigning (Express 5 read-only safety)", () => {
        const next = mockNext();
        const { res, status } = mockResponse();
        const querySchema = Joi.object({
            page: Joi.number().integer().min(1).optional(),
        });
        const req = { query: { page: "3" } } as unknown as Request;

        validate(querySchema, "query")(req, res, next);

        expect(next).toHaveBeenCalledOnce();
        expect(status).not.toHaveBeenCalled();
    });
});
