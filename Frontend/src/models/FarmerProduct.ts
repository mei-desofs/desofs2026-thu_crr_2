import type { Product } from "./Product";

export interface FarmerProduct {
  id?: number;
  applicationId?: number;
  userId: number;
  productId: number;
  product?: Product;
  week: number;
  quantity: number;
  unit: string; // ex: "kg", "L", "unidades"
}
