import type { MealType } from "./MealType";
import type { Dish } from "./Dish";

export interface Meal {
  id: number;

  mealTypeId: number;
  mealType?: MealType; 

  name: string;

  date: string;       

  dishId: number;
  dish?: Dish;
  
  canteenId?: number; // Onde a refeição foi produzida
  refeitorioId?: number; // Onde a refeição será servida
}
