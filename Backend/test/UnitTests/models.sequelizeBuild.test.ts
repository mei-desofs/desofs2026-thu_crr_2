import { describe, it, expect } from "vitest";
import { Order } from "../../src/Model/Order";
import { Reservation } from "../../src/Model/Reservation";
import { Meal } from "../../src/Model/Meal";
import { NeededProduct } from "../../src/Model/NeededProduct";
import { Batch } from "../../src/Model/Batch";
import { Stock } from "../../src/Model/Stock";
import { Menu } from "../../src/Model/Menu";
import { Dish } from "../../src/Model/Dish";
import { Parish } from "../../src/Model/Parish";
import { Institution } from "../../src/Model/Institution";
import { Canteen } from "../../src/Model/Canteen";
import { Refeitorio } from "../../src/Model/Refeitorio";
import { WasteReport } from "../../src/Model/WasteReport";
import { Recipe } from "../../src/Model/Recipe";
import { Ingredient } from "../../src/Model/Ingredient";
import { Notification } from "../../src/Model/Notification";
import { SupplierOrder } from "../../src/Model/SupplierOrder";
import { CanteenRefeitorio } from "../../src/Model/CanteenRefeitorio";
import { ReservationQuantitiesCanteen } from "../../src/Model/ReservationQuantitiesCanteen";
import { AverageReservation } from "../../src/Model/AverageReservation";
import { Information } from "../../src/Model/Information";
import { ProductType } from "../../src/Model/ProductType";
import { Product } from "../../src/Model/Product";
import { Unit, UnitEnum } from "../../src/Model/Unit";
import { Allergen } from "../../src/Model/Allergen";
import { MenuType } from "../../src/Model/MenuType";
import { MealType } from "../../src/Model/MealType";
import { DishType } from "../../src/Model/DishType";
import { NutritionType } from "../../src/Model/NutritionType";

/** Testes Sequelize `Model.build()` sem BD — verificam shape e defaults em memória. */

describe("Order", () => {
  it("builds with required fields and default status", () => {
    const o = Order.build({
      userId: 1,
      neededProductId: 2,
      productId: 3,
      unit: "kg",
      quantity: 10,
      date: new Date("2026-06-01"),
      canteenId: 1,
    });
    expect(o.status).toBe("pending");
    expect(o.quantity).toBe(10);
    expect(o.userId).toBe(1);
  });

  it("allows explicit status", () => {
    const o = Order.build({
      userId: 1,
      neededProductId: 1,
      productId: 1,
      unit: "L",
      quantity: 1,
      date: new Date("2026-06-02"),
      canteenId: 2,
      status: "delivered",
    });
    expect(o.status).toBe("delivered");
  });
});

describe("Reservation", () => {
  it("builds active reservation", () => {
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
});

describe("Meal", () => {
  it("builds meal with canteen and refeitorio", () => {
    const m = Meal.build({
      mealTypeId: 1,
      name: "Almoço",
      date: new Date("2026-06-10"),
      dishId: 2,
      canteenId: 1,
      refeitorioId: 2,
    });
    expect(m.name).toBe("Almoço");
    expect(m.canteenId).toBe(1);
  });
});



describe("Batch", () => {
  it("builds batch with bio flag", () => {
    const b = Batch.build({
      expirationDate: new Date("2026-12-01"),
      productId: 1,
      quantity: 100,
      unitId: 2,
      bio: true,
    });
    expect(b.bio).toBe(true);
  });
});

describe("Stock", () => {
  it("builds stock with batch ids array", () => {
    const s = Stock.build({
      updatedDate: new Date(),
      minimumCapacity: 0,
      maximumCapacity: 1000,
      currentQuantity: 50,
      batches: [1, 2, 3],
    });
    expect(s.batches).toEqual([1, 2, 3]);
    expect(s.currentQuantity).toBe(50);
  });
});

describe("Menu", () => {
  it("builds menu with meals array and status", () => {
    const m = Menu.build({
      menuTypeId: 1,
      initialDate: new Date("2026-01-01"),
      finalDate: new Date("2026-01-07"),
      meals: [10, 11],
      status: "pending",
      canteenId: 1,
    });
    expect(m.meals).toEqual([10, 11]);
    expect(m.status).toBe("pending");
  });
});

describe("Dish", () => {
  it("builds dish with mainProductsId json", () => {
    const d = Dish.build({
      dishTypeId: 1,
      name: "Arroz",
      recipeId: 2,
      mainProductsId: [1, 2],
    });
    expect(d.mainProductsId).toEqual([1, 2]);
  });
});

describe("Parish", () => {
  it("defaults quarantined to false", () => {
    const p = Parish.build({ name: "Freguesia X" });
    expect(p.quarantined).toBe(false);
  });
});

describe("Institution & Canteen & Refeitorio", () => {
  it("builds institution", () => {
    const i = Institution.build({
      name: "Escola A",
      idmenutype: 1,
      location: "Rua 1",
    });
    expect(i.name).toBe("Escola A");
  });

  it("builds canteen with optional institutionId", () => {
    const c = Canteen.build({
      name: "Cantina 1",
      idmenutype: 1,
      location: "Edifício A",
    });
    expect(c.institutionId).toBeUndefined();
  });

  it("builds refeitorio", () => {
    const r = Refeitorio.build({
      name: "Refeitório Central",
      location: "Campus",
    });
    expect(r.name).toBe("Refeitório Central");
  });
});

describe("WasteReport", () => {
  it("builds without optional reservationId", () => {
    const w = WasteReport.build({
      wastePercentage: 12,
      mealId: 1,
      reportedBy: 3,
      refeitorioId: 2,
    });
    expect(w.reservationId).toBeUndefined();
    expect(w.wastePercentage).toBe(12);
  });
});

describe("Recipe & Ingredient", () => {
  it("builds recipe with ingredients list", () => {
    const r = Recipe.build({
      ingredients: [1, 2],
      description: "Receita teste",
    });
    expect(r.ingredients).toEqual([1, 2]);
  });

  it("builds ingredient", () => {
    const i = Ingredient.build({
      productId: 1,
      quantity: 0.5,
      unitId: 1,
    });
    expect(i.quantity).toBe(0.5);
  });
});

describe("Notification", () => {
  it("defaults status to sent", () => {
    const n = Notification.build({
      userId: 1,
      title: "Olá",
      body: "Mensagem",
    });
    expect(n.status).toBe("sent");
  });
});

describe("SupplierOrder", () => {
  it("builds with composite key field", () => {
    const s = SupplierOrder.build({
      supplierId: 7,
      position: 1,
      applicationDate: new Date("2026-03-01"),
    });
    expect(s.supplierId).toBe(7);
    expect(s.position).toBe(1);
  });
});

describe("CanteenRefeitorio", () => {
  it("builds association row", () => {
    const cr = CanteenRefeitorio.build({ canteenId: 1, refeitorioId: 2 });
    expect(cr.canteenId).toBe(1);
  });
});

describe("ReservationQuantitiesCanteen", () => {
  it("builds quantity row", () => {
    const q = ReservationQuantitiesCanteen.build({
      canteenId: 1,
      dishId: 2,
      date: new Date("2026-04-01"),
      refeitorioId: 3,
      quantity: 40,
    });
    expect(q.quantity).toBe(40);
  });
});

describe("AverageReservation", () => {
  it("builds with typeOfMealId enum", () => {
    const a = AverageReservation.build({
      dishId: 1,
      typeOfMealId: 1,
      avgReservations: 12.5,
      canteenId: 1,
    } as any);
    expect(a.avgReservations).toBe(12.5);
  });
});

describe("Information", () => {
  it("builds averages", () => {
    const i = Information.build({ avgClientsLunch: 100, avgClientsDinner: 80 });
    expect(i.avgClientsLunch).toBe(100);
  });
});

describe("ProductType & Product", () => {
  it("builds product type", () => {
    const pt = ProductType.build({ name: "Vegetal" });
    expect(pt.name).toBe("Vegetal");
  });

  it("builds product with nutrition and allergens json", () => {
    const p = Product.build({
      name: "Tomate",
      typeId: 1,
      nutrition: [{ typeId: 1, percentage: 10 }],
      allergens: [1, 2],
    });
    expect(p.nutrition).toHaveLength(1);
    expect(p.allergens).toEqual([1, 2]);
  });
});

describe("Unit", () => {
  it("builds with enum name", () => {
    const u = Unit.build({ name: UnitEnum.Kilogram });
    expect(u.name).toBe("kg");
  });
});

describe("Allergen", () => {
  it("builds allergen", () => {
    const a = Allergen.build({ name: "Gluten" });
    expect(a.name).toBe("Gluten");
  });
});

describe("MenuType, MealType, DishType, NutritionType", () => {
  it("builds auxiliary type rows", () => {
    expect(MenuType.build({ name: "Standard" }).name).toBe("Standard");
    expect(MealType.build({ name: "Almoço" }).name).toBe("Almoço");
    expect(DishType.build({ name: "Sopa" }).name).toBe("Sopa");
    expect(NutritionType.build({ name: "Protein" }).name).toBe("Protein");
  });
});
