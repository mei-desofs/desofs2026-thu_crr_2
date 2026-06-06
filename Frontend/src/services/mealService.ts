import axios from "axios";
import type { Meal } from "../models/Meal";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/meals`;
export const mealService = {
  // -------------------------
  // Criar um novo menu
  // -------------------------
  async createMeal(data: Partial<Meal>): Promise<Meal> {
    const response = await axios.post<Meal>(`${API_URL}`, data);
    return response.data;
  },

  async getMealById(id: number): Promise<Meal> {
    const response = await axios.get<Meal>(`${API_URL}/${id}`);
    return response.data;
  },

  async listMeals(): Promise<Meal[]> {
    const response = await axios.get<Meal[]>(`${API_URL}`);
    return response.data;
  }
};

