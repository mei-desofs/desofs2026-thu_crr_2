import type { Ingredient } from "./Ingredient";

export interface Recipe {
  id: number;

  ingredients: number[];

  ingredientsData?: Ingredient[];

  description: string;
}
