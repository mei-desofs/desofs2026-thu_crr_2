import { describe, it, expect } from "vitest";
import { createParishSchema } from "../../../src/Schemas/ParishValidation";
import { addDays, getWeekFromDate, getWeekRange } from "../../../src/utils/date";

/**
 * Black box: apenas entradas e saídas observáveis, sem conhecimento da implementação interna.
 */
describe("Black box — contratos de entrada/saída (validação e datas)", () => {
  it("BB-01: nome de freguesia válido é aceite", () => {
    const result = createParishSchema.validate({ name: "São Pedro" });

    expect(result.error).toBeUndefined();
    expect(result.value).toEqual({ name: "São Pedro" });
  });

  it("BB-02: nome com 1 carácter é rejeitado", () => {
    const result = createParishSchema.validate({ name: "A" });

    expect(result.error).toBeDefined();
    expect(result.error?.details[0]?.path).toContain("name");
  });

  it("BB-03: nome com mais de 100 caracteres é rejeitado", () => {
    const result = createParishSchema.validate({ name: "x".repeat(101) });

    expect(result.error).toBeDefined();
  });

  it("BB-04: 2025-01-01 corresponde à semana 1 do calendário da aplicação", () => {
    const week = getWeekFromDate(new Date("2025-01-01"));

    expect(week).toBe(1);
  });

  it("BB-05: getWeekRange(1) devolve intervalo de 7 dias e addDays soma corretamente", () => {
    const { start, end } = getWeekRange(1);
    const spanDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    expect(spanDays).toBe(6);

    const base = new Date("2025-06-10");
    const shifted = addDays(base, 5);

    expect(shifted.toISOString().slice(0, 10)).toBe("2025-06-15");
  });
});
