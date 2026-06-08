import axios from "axios";
import { API_BASE_URL } from "../../config";

export interface WeekMenuMeal {
  id: number;
  name: string;
  dishName?: string;
  type?: string;
  allergens?: string[]; // names
  nutrition?: { typeId: number; name?: string | null; value?: number; unit?: string | null; grams?: number; percentageOfMeal?: number | null }[];
}

export interface WeekMenuDay {
  date: string;
  meals: WeekMenuMeal[];
}

export interface WeekMenuResponse {
  id: number;
  initialDate: string;
  finalDate: string;
  days: WeekMenuDay[];
}

const API_URL = `${API_BASE_URL}/menus/week/current`;

export const weekMenuService = {
  async getCurrentWeekMenu(): Promise<WeekMenuResponse> {
    const response = await axios.get<WeekMenuResponse>(API_URL);
    return response.data;
  },
};


