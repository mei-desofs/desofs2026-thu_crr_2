import { describe, it, expect } from "vitest";
import type { DocumentInfo } from "../../../../src/Model/Application";
import { Application } from "../../../../src/Model/Application";
import { FarmerProduct } from "../../../../src/Model/FarmerProducts";

describe("Application (Model.build)", () => {
  const doc: DocumentInfo = { filename: "a.pdf", path: "/tmp/a.pdf" };
  const emptyDocs: DocumentInfo[] = [];

  /** ApplicationAttributes exige freguesia/municipio em TS (apesar de allowNull na BD). */
  const baseApp = {
    userId: 1,
    name: "N",
    location: "L",
    freguesia: "",
    municipio: "",
    businessEmail: "a@a.pt",
    businessPhone: "1",
    documentsSubmitted: emptyDocs,
  };

  it("default status submitted e documentsSubmitted", () => {
    const a = Application.build({
      ...baseApp,
      userId: 1,
      name: "Quinta do Sol",
      location: "Rua 1",
      freguesia: "Souselo",
      municipio: "Resende",
      businessEmail: "b@example.com",
      businessPhone: "912345678",
      documentsSubmitted: emptyDocs,
    });
    expect(a.status).toBe("submitted");
    expect(a.documentsSubmitted).toEqual([]);
  });

  it("documentos submetidos", () => {
    const a = Application.build({
      ...baseApp,
      userId: 2,
      name: "Fornecedor",
      businessEmail: "e@e.com",
      businessPhone: "900",
      documentsSubmitted: [doc],
      status: "under_review",
    });
    expect(a.documentsSubmitted).toHaveLength(1);
    expect(a.status).toBe("under_review");
  });

  it.each(["submitted", "under_review", "approved", "rejected", "cancelled"] as const)(
    "status %s",
    (status) => {
      const a = Application.build({
        ...baseApp,
        status,
      });
      expect(a.status).toBe(status);
    }
  );

  it("comentários opcionais", () => {
    const a = Application.build({
      ...baseApp,
      supplierComment: "ok",
      evaluationComment: "bom",
    });
    expect(a.supplierComment).toBe("ok");
  });
});

describe("FarmerProduct (Model.build)", () => {
  it("linha de produto por semana", () => {
    const f = FarmerProduct.build({
      applicationId: 1,
      userId: 5,
      productId: 11,
      week: 3,
      quantity: 100,
      unit: "kg",
    });
    expect(f.week).toBe(3);
    expect(f.quantity).toBe(100);
  });

  it("outra semana", () => {
    const f = FarmerProduct.build({
      applicationId: 2,
      userId: 5,
      productId: 5,
      week: 52,
      quantity: 4.16,
      unit: "kg",
    });
    expect(f.unit).toBe("kg");
  });
});
