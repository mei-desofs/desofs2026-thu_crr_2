import { describe, it, expect } from "vitest";
import { createMenuSchema } from "../../src/Schemas/MenuValidation";

function futureDate(daysAhead: number): Date {
  return new Date(Date.now() + daysAhead * 86_400_000);
}

describe("createMenuSchema (Joi)", () => {
  it("accepts a valid payload with future dates", () => {
    const initial = futureDate(2);
    const final = futureDate(5);
    const { error, value } = createMenuSchema.validate({
      menuTypeId: 1,
      initialDate: initial,
      finalDate: final,
      meals: [10, 20],
      canteenId: 3,
    });
    expect(error).toBeUndefined();
    expect(value.canteenId).toBe(3);
  });

  it("rejects when menuTypeId is missing", () => {
    const { error } = createMenuSchema.validate({
      initialDate: futureDate(2),
      finalDate: futureDate(5),
      meals: [1],
      canteenId: 1,
    });
    expect(error).toBeDefined();
    expect(error?.details[0]?.path).toContain("menuTypeId");
  });

  it("rejects when meals array is missing", () => {
    const { error } = createMenuSchema.validate({
      menuTypeId: 1,
      initialDate: futureDate(2),
      finalDate: futureDate(5),
      canteenId: 1,
    });
    expect(error).toBeDefined();
    expect(error?.details[0]?.path).toContain("meals");
  });

  it("rejects when canteenId is not positive", () => {
    const { error } = createMenuSchema.validate({
      menuTypeId: 1,
      initialDate: futureDate(2),
      finalDate: futureDate(5),
      meals: [1],
      canteenId: 0,
    });
    expect(error).toBeDefined();
  });
});
