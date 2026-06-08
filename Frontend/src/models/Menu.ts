import type { Meal } from "./Meal";
export interface MenuType {
  id: number;
  name: string;
}

export interface Menu {
  id: number;
  menuTypeId: number;
  menuType?: MenuType;     
  initialDate: string;     
  finalDate: string;
  status: 'pending' | 'published' | 'aproved';
  meals: number[];      
  mealsData?: Meal[];
  canteenId?: number; // Cantina à qual o menu pertence
}
