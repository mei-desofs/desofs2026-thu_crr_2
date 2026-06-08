import axios from "axios";
import type { Menu } from "../models/Menu";
import type { Meal } from "../models/Meal";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/menus`;
//Agora usa  modelos como base: `WeekMenu` estende `Menu`, `MealWithAggregatedData` estende `Meal`
/**
 * Informação nutricional agregada de uma refeição
 * (retornada pelo backend após processamento)
 */
export interface MealNutritionInfo {
  typeId: number;
  name?: string | null;
  // New shape returned by backend: numeric value already converted to the nutrition-type unit
  value: number;
  unit?: string | null;
  // raw grams aggregated (optional)
  grams?: number;
  // original percentage of the meal (optional)
  percentageOfMeal?: number | null;
}

/**
 * Refeição com dados agregados para visualização semanal
 * Estende Meal com informações processadas pelo backend
 */
export interface MealWithAggregatedData extends Meal {
  dishName?: string;
  type?: string | null; // Nome do tipo de prato (ex: "vegetariano") - retornado pelo backend
  allergens?: string[]; // Nomes dos alérgenos agregados de todos os ingredientes
  nutrition?: MealNutritionInfo[]; // Valores nutricionais agregados
}

/**
 * Dia do menu semanal com suas refeições
 */
export interface MenuDay {
  date: string;
  meals: MealWithAggregatedData[];
}

/**
 * Menu semanal com estrutura otimizada para visualização
 * Estende Menu com dias agrupados e dados agregados
 */
export interface WeekMenu extends Menu {
  days: MenuDay[];
}

export const menuService = {
  // -------------------------
  // Criar um novo menu
  // -------------------------
  async createMenu(data: Partial<Menu>): Promise<Menu> {
    const response = await axios.post<Menu>(`${API_URL}`, data);
    return response.data;
  },

  // -------------------------
  // Listar todos os menus
  // -------------------------
  async listMenus(): Promise<Menu[]> {
    const response = await axios.get<Menu[]>(`${API_URL}`);
    return response.data;
  },

  // -------------------------
  // Obter menu atual da semana com dados agregados
  // Retorna o menu mais recente com refeições agrupadas por dia,
  // alérgenos agregados e valores nutricionais calculados
  // -------------------------
  async getCurrentWeekMenu(menuTypeId?: number, weekOffset: number = 0): Promise<WeekMenu> {
    const params = new URLSearchParams();
    if (menuTypeId !== undefined) {
      params.append('menuTypeId', menuTypeId.toString());
    }
    if (weekOffset !== 0) {
      params.append('weekOffset', weekOffset.toString());
    }
    const queryString = params.toString();
    const url = queryString ? `${API_URL}/week/current?${queryString}` : `${API_URL}/week/current`;
    const response = await axios.get<WeekMenu>(url);
    return response.data;
  },

  async updateMenuStatus(id: number, status: "published" | "pending" | "aproved"): Promise<Menu> {
    const response = await axios.put<Menu>(`${API_URL}/${id}`, { status });
    return response.data;
  },

  async getMenuById(id: number): Promise<Menu> {
    const response = await axios.get<Menu>(`${API_URL}/${id}`);
    return response.data;
  },
  
  async getMenusByCanteen(canteenId: number): Promise<Menu[]> {
    const response = await axios.get<Menu[]>(`${API_URL}/canteen/${canteenId}`);
    return response.data;
  }
};

