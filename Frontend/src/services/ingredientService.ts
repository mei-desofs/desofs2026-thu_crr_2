import { apiClient } from "./setupAxiosAuth";
import type { Ingredient } from "../models/Ingredient";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/ingredients`;

export const ingredientService = {
  // -------------------------
  // Criar um novo menu
  // -------------------------
  async createIngredient(data: Partial<Ingredient>): Promise<Ingredient> {
    const response = await apiClient.post<Ingredient>(`${API_URL}`, data);
    return response.data;
  },

  async getIngredientById(id: number): Promise<Ingredient> {
    const response = await apiClient.get<Ingredient>(`${API_URL}/${id}`);
    return response.data;
  }
};

