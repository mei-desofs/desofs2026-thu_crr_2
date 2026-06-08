import axios from "axios";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/performance`;

export interface WastePercentageResponse {
  totalServed: number;
  totalNotConsumed: number;
  wastePercentage: number;
  byDate: Array<{
    date: string;
    served: number;
    notConsumed: number;
    percentage: number;
  }>;
  byMeal?: Array<{
    mealId: number;
    mealName: string;
    mealDate: string;
    mealTypeId?: number;
    dishTypeId?: number;
    dishName?: string;
    served: number; // Total marcadas (consumed + not consumed)
    consumed: number; // Apenas consumidas
    notConsumed: number;
    percentage: number;
  }>;
}

export interface WastePercentageFilters {
  date?: string; // YYYY-MM-DD
  period?: "day" | "week" | "month" | "year"; // Período: dia, semana, mês, ano
  dishTypeId?: number; // ID do tipo de prato
  mealTypeId?: number; // ID do tipo de refeição (1=Almoço, 2=Jantar)
  dateRangeStart?: string; // YYYY-MM-DD - Início do intervalo
  dateRangeEnd?: string; // YYYY-MM-DD - Fim do intervalo
  dayOfWeek?: number; // 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sábado
  mealId?: number; // ID da refeição
  mealName?: string; // Nome da refeição (busca por texto)
  refeitorioId?: number; // ID do refeitório
}

export const performanceService = {
  async getWastePercentage(filters?: WastePercentageFilters): Promise<WastePercentageResponse> {
    const params: Record<string, string> = {};
    
    if (filters?.date) params.date = filters.date;
    if (filters?.period) params.period = filters.period;
    if (filters?.dishTypeId !== undefined) params.dishTypeId = String(filters.dishTypeId);
    if (filters?.mealTypeId !== undefined) params.mealTypeId = String(filters.mealTypeId);
    if (filters?.dateRangeStart) params.dateRangeStart = filters.dateRangeStart;
    if (filters?.dateRangeEnd) params.dateRangeEnd = filters.dateRangeEnd;
    if (filters?.dayOfWeek !== undefined) params.dayOfWeek = String(filters.dayOfWeek);
    if (filters?.mealId !== undefined) params.mealId = String(filters.mealId);
    if (filters?.mealName) params.mealName = filters.mealName;
    if (filters?.refeitorioId !== undefined) params.refeitorioId = String(filters.refeitorioId);

    const response = await axios.get<WastePercentageResponse>(`${API_URL}/waste`, { params });
    return response.data;
  },
};

