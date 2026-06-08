import type { Product } from "./Product";
import type { Unit } from "./Unit";

export interface Ingredient {
  id: number;

  productId: number;
  product?: Product; 

  quantity: number;

  unitId: number;
  unit?: Unit;     
}
