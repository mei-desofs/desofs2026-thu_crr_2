import { describe, it, expect } from "vitest";
import { Institution } from "../../../../src/Model/Institution";
import { Canteen } from "../../../../src/Model/Canteen";
import { Refeitorio } from "../../../../src/Model/Refeitorio";

describe("Institution (Model.build)", () => {
  it("instituição com idmenutype e local", () => {
    const i = Institution.build({
      name: "Escola Central",
      idmenutype: 1,
      location: "Rua da Escola, 123",
    });
    expect(i.name).toBe("Escola Central");
    expect(i.idmenutype).toBe(1);
  });

  it("freguesia e município opcionais", () => {
    const i = Institution.build({
      name: "Inst B",
      idmenutype: 2,
      location: "Morada 2",
      freguesia: "Souselo",
      municipio: "Resende",
    });
    expect(i.freguesia).toBe("Souselo");
  });
});

describe("Canteen (Model.build)", () => {
  it("cantina sem institutionId", () => {
    const c = Canteen.build({
      name: "Cantina Secundária 2",
      idmenutype: 2,
      location: "morada 2",
    });
    expect(c.institutionId).toBeUndefined();
    expect(c.name).toBe("Cantina Secundária 2");
  });

  it("cantina com institutionId e freguesia", () => {
    const c = Canteen.build({
      name: "Cantina da Escola Central",
      institutionId: 1,
      idmenutype: 1,
      location: "Rua da Escola, 123",
      freguesia: "Souselo",
    });
    expect(c.institutionId).toBe(1);
    expect(c.freguesia).toBe("Souselo");
  });

  it("cantina Lar São João — Tarouquela", () => {
    const c = Canteen.build({
      name: "Cantina do Lar São João",
      institutionId: 2,
      idmenutype: 2,
      location: "Avenida da Paz, 45",
      freguesia: "Tarouquela",
    });
    expect(c.location).toContain("Avenida");
  });

  it("município opcional", () => {
    const c = Canteen.build({
      name: "C",
      idmenutype: 1,
      location: "L",
      municipio: "M",
    });
    expect(c.municipio).toBe("M");
  });
});

describe("Refeitorio (Model.build)", () => {
  it("refeitório central", () => {
    const r = Refeitorio.build({
      name: "Refeitório Central",
      location: "Campus",
    });
    expect(r.name).toBe("Refeitório Central");
  });

  it("com institutionId", () => {
    const r = Refeitorio.build({
      name: "R1",
      institutionId: 1,
      location: "Edifício B",
      freguesia: "Souselo",
    });
    expect(r.institutionId).toBe(1);
  });
});
