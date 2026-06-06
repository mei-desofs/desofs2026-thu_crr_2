import type { ProductType } from "./ProductType";

export interface NutritionalInfo {
  type: string;       // ex: "Proteina", "Carboidrato"
  quantity: number;   // em percentagem
}

export interface Product {
  id: number;
  name: string;
  typeId: number;
  type?: ProductType;
  nutritional: NutritionalInfo[];
  allergens: string[]; // ex: ["lactose", "gluten"]
}
