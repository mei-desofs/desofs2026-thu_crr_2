import axios from "axios";
import type { Dish } from "../models/Dish";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/dishes`;

  interface DishWithScore {
    dish: Dish;
    score: number;
  }

export const dishService = {
  // -------------------------
  // Listar sugestões de pratos
  // -------------------------
  async recomendationsDishes(date: string): Promise<DishWithScore[]> {
    const response = await axios.get<DishWithScore[]>(`${API_URL}/recommendationsList/` + date);
    return response.data;
  },

  async getDishByRecipeId(recipeId: number): Promise<Dish> {
    const response = await axios.get<Dish>(`${API_URL}/recipe/` + recipeId);
    return response.data;
  },

  async getDishById(dishId: number): Promise<Dish> {
    const response = await axios.get<Dish>(`${API_URL}/` + dishId);
    return response.data;
  }
};

