import type { DishType } from "./DishType.ts";
import type { Recipe } from "./Recipe.ts";

export interface Dish {
  id: number;
  dishTypeId: number;
  dishType?: DishType;

  name: string;

  recipeId: number;
  recipe?: Recipe; 
  mainProductsId: number[];
}
