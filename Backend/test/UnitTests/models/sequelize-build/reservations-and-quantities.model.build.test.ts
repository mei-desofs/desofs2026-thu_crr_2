import { describe, it, expect } from "vitest";
import { Reservation } from "../../../../src/Model/Reservation";
import { ReservationQuantitiesCanteen } from "../../../../src/Model/ReservationQuantitiesCanteen";
import { AverageReservation } from "../../../../src/Model/AverageReservation";

describe("Reservation (Model.build)", () => {
  it("reserva ativa", () => {
    const r = Reservation.build({
      status: "active",
      reservationDate: new Date(),
      quantity: 2,
      mealId: 5,
      userId: 9,
      refeitorioId: 3,
    });
    expect(r.status).toBe("active");
    expect(r.quantity).toBe(2);
  });

  it.each(["active", "consumed", "not consumed", "pendent", "canceled"] as const)("status %s", (status) => {
    const r = Reservation.build({
      status,
      reservationDate: new Date(),
      quantity: 1,
      mealId: 1,
      userId: 1,
      refeitorioId: 1,
    });
    expect(r.status).toBe(status);
  });
});

describe("ReservationQuantitiesCanteen (Model.build)", () => {
  it("quantidade por cantina/prato/data", () => {
    const q = ReservationQuantitiesCanteen.build({
      canteenId: 1,
      dishId: 2,
      date: new Date("2026-04-01"),
      refeitorioId: 3,
      quantity: 40,
    });
    expect(q.quantity).toBe(40);
  });

  it("outro conjunto de ids", () => {
    const q = ReservationQuantitiesCanteen.build({
      canteenId: 2,
      dishId: 10,
      date: new Date("2026-05-01"),
      refeitorioId: 1,
      quantity: 0,
    });
    expect(q.canteenId).toBe(2);
  });
});

describe("AverageReservation (Model.build)", () => {
  it("typeOfMealId como enum string 1", () => {
    const a = AverageReservation.build({
      dishId: 1,
      typeOfMealId: "1" as unknown as 1,
      avgReservations: 12.5,
      canteenId: 1,
    });
    expect(a.avgReservations).toBe(12.5);
  });

  it("typeOfMealId string 2", () => {
    const a = AverageReservation.build({
      dishId: 3,
      typeOfMealId: "2" as unknown as 2,
      avgReservations: 0,
      canteenId: 2,
    });
    expect(a.typeOfMealId).toBe("2");
  });
});
