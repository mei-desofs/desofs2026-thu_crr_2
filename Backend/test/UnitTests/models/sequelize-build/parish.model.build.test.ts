import { describe, it, expect } from "vitest";
import { Parish } from "../../../../src/Model/Parish";

describe("Parish (Model.build)", () => {
  it("default quarantined false", () => {
    const p = Parish.build({ name: "Souselo" });
    expect(p.quarantined).toBe(false);
  });

  it("quarantined true", () => {
    const p = Parish.build({ name: "Tarouquela", quarantined: true });
    expect(p.quarantined).toBe(true);
  });

  it("nome da freguesia", () => {
    const p = Parish.build({ name: "Freguesia X" });
    expect(p.name).toBe("Freguesia X");
  });

  it("id explícito", () => {
    const p = Parish.build({ id: 7, name: "P7" });
    expect(p.id).toBe(7);
  });

  it("quarentena false explícita", () => {
    const p = Parish.build({ name: "Livre", quarantined: false });
    expect(p.quarantined).toBe(false);
  });
});
