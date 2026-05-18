import { describe, it, expect } from "vitest";
import { WasteReport } from "../../../../src/Model/WasteReport";
import { Notification } from "../../../../src/Model/Notification";
import { Information } from "../../../../src/Model/Information";

describe("WasteReport (Model.build)", () => {
  it("sem reservationId", () => {
    const w = WasteReport.build({
      wastePercentage: 12,
      mealId: 1,
      reportedBy: 3,
      reportedAt: new Date("2026-01-10"),
      refeitorioId: 2,
    });
    expect(w.reservationId).toBeUndefined();
    expect(w.wastePercentage).toBe(12);
  });

  it("com reservationId", () => {
    const w = WasteReport.build({
      wastePercentage: 0,
      mealId: 2,
      reservationId: 5,
      reportedBy: 1,
      reportedAt: new Date(),
      refeitorioId: 1,
    });
    expect(w.reservationId).toBe(5);
  });

  it("percentagem máxima 100", () => {
    const w = WasteReport.build({
      wastePercentage: 100,
      mealId: 1,
      reportedBy: 1,
      reportedAt: new Date(),
      refeitorioId: 1,
    });
    expect(w.wastePercentage).toBe(100);
  });
});

describe("Notification (Model.build)", () => {
  it("default status sent", () => {
    const n = Notification.build({
      userId: 1,
      title: "Olá",
      body: "Mensagem",
    });
    expect(n.status).toBe("sent");
  });

  it("status seen", () => {
    const n = Notification.build({
      userId: 2,
      title: "T",
      body: "B",
      status: "seen",
    });
    expect(n.status).toBe("seen");
  });
});

describe("Information (Model.build)", () => {
  it("médias almoço e jantar", () => {
    const i = Information.build({ avgClientsLunch: 100, avgClientsDinner: 80 });
    expect(i.avgClientsLunch).toBe(100);
    expect(i.avgClientsDinner).toBe(80);
  });

  it("zeros", () => {
    const i = Information.build({ avgClientsLunch: 0, avgClientsDinner: 0 });
    expect(i.avgClientsDinner).toBe(0);
  });

  it("decimais", () => {
    const i = Information.build({ avgClientsLunch: 33.3, avgClientsDinner: 44.4 });
    expect(i.avgClientsLunch).toBeCloseTo(33.3);
  });

  it("valores altos", () => {
    const i = Information.build({ avgClientsLunch: 5000, avgClientsDinner: 3200 });
    expect(i.avgClientsLunch).toBe(5000);
  });
});
