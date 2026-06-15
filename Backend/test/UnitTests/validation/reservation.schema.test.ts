import { describe, it, expect } from "vitest";
import {
    createReservationSchema,
    updateReservationStatusSchema,
    liftTicketsSchema,
} from "../../../src/Schemas/ReservationValidation";

describe("createReservationSchema", () => {
    it("accepts minimal payload (only mealId + userId)", () => {
        const { error } = createReservationSchema.validate({ mealId: 1, userId: 1 });
        expect(error).toBeUndefined();
    });

    it("accepts full payload with optional fields", () => {
        const { error } = createReservationSchema.validate({
            mealId: 1,
            userId: 1,
            status: "active",
            reservationDate: new Date(),
            quantity: 3,
            refeitorioId: 2,
        });
        expect(error).toBeUndefined();
    });

    it("rejects negative mealId", () => {
        const { error } = createReservationSchema.validate({ mealId: -1, userId: 1 });
        expect(error).toBeDefined();
    });

    it("rejects unknown status", () => {
        const { error } = createReservationSchema.validate({
            mealId: 1,
            userId: 1,
            status: "weird",
        });
        expect(error).toBeDefined();
    });

    it("rejects quantity > 1000", () => {
        const { error } = createReservationSchema.validate({
            mealId: 1,
            userId: 1,
            quantity: 1001,
        });
        expect(error).toBeDefined();
    });

    it("rejects quantity 0", () => {
        const { error } = createReservationSchema.validate({
            mealId: 1,
            userId: 1,
            quantity: 0,
        });
        expect(error).toBeDefined();
    });
});

describe("updateReservationStatusSchema", () => {
    it("accepts valid status", () => {
        const { error } = updateReservationStatusSchema.validate({ status: "consumed" });
        expect(error).toBeUndefined();
    });

    it("rejects empty body", () => {
        const { error } = updateReservationStatusSchema.validate({});
        expect(error).toBeDefined();
    });

    it("rejects unknown status", () => {
        const { error } = updateReservationStatusSchema.validate({ status: "weird" });
        expect(error).toBeDefined();
    });
});

describe("liftTicketsSchema", () => {
    it("accepts positive quantity", () => {
        const { error } = liftTicketsSchema.validate({ quantity: 2 });
        expect(error).toBeUndefined();
    });

    it("rejects 0 quantity", () => {
        const { error } = liftTicketsSchema.validate({ quantity: 0 });
        expect(error).toBeDefined();
    });

    it("rejects missing quantity", () => {
        const { error } = liftTicketsSchema.validate({});
        expect(error).toBeDefined();
    });
});
