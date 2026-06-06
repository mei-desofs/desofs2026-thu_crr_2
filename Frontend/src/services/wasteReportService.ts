import axios from "axios";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/waste-reports`;

export interface WasteReport {
  id: number;
  wastePercentage: number;
  mealId: number;
  reservationId?: number;
  reportedBy: number;
  reportedAt: string;
  refeitorioId: number;
}

export interface CreateWasteReportPayload {
  wastePercentage: number;
  mealId: number;
  reservationId?: number;
  reportedBy: number;
  refeitorioId: number;
}

export interface WasteReportsForConsumedMeals {
  mealsNeedingReport: number[];
  totalConsumedMeals: number;
  reportedMeals: number;
}

export interface WasteReportStatistics {
  totalReports: number;
  averageWaste: number;
  byMeal: Array<{
    mealId: number;
    mealName: string;
    mealDate: string;
    mealTypeId?: number;
    dishTypeId?: number;
    dishName?: string;
    reports: WasteReport[];
    averageWaste: number;
    totalReports: number;
  }>;
}

export interface WasteReportStatisticsFilters {
  mealId?: number;
  dateRangeStart?: string;
  dateRangeEnd?: string;
  date?: string; // YYYY-MM-DD
  period?: "day" | "week" | "month" | "year"; // Período: dia, semana, mês, ano
  dishTypeId?: number; // ID do tipo de prato
  mealTypeId?: number; // ID do tipo de refeição (1=Almoço, 2=Jantar)
  dayOfWeek?: number; // 0=Domingo, 1=Segunda, 2=Terça, 3=Quarta, 4=Quinta, 5=Sexta, 6=Sábado
  mealName?: string; // Nome da refeição (busca por texto)
  refeitorioId?: number; // ID do refeitório
}

export const wasteReportService = {
  // -------------------------
  // Criar um novo report de desperdício
  // -------------------------
  async createWasteReport(data: CreateWasteReportPayload): Promise<WasteReport> {
    const response = await axios.post<WasteReport>(API_URL, data);
    return response.data;
  },

  // -------------------------
  // Obter reports por meal
  // -------------------------
  async getWasteReportsByMeal(mealId: number): Promise<WasteReport[]> {
    const response = await axios.get<WasteReport[]>(`${API_URL}/meal/${mealId}`);
    return response.data;
  },

  // -------------------------
  // Obter reports por data
  // -------------------------
  async getWasteReportsByDate(date: string): Promise<WasteReport[]> {
    const response = await axios.get<WasteReport[]>(`${API_URL}/date`, {
      params: { date },
    });
    return response.data;
  },

  // -------------------------
  // Obter meals consumidas que precisam de report
  // -------------------------
  async getWasteReportsForConsumedMeals(date: string): Promise<WasteReportsForConsumedMeals> {
    const response = await axios.get<WasteReportsForConsumedMeals>(`${API_URL}/consumed-meals`, {
      params: { date },
    });
    return response.data;
  },

  // -------------------------
  // Obter estatísticas de desperdício reportado
  // -------------------------
  async getWasteReportStatistics(filters?: WasteReportStatisticsFilters): Promise<WasteReportStatistics> {
    const params: Record<string, string> = {};
    if (filters?.mealId) params.mealId = String(filters.mealId);
    if (filters?.dateRangeStart) params.dateRangeStart = filters.dateRangeStart;
    if (filters?.dateRangeEnd) params.dateRangeEnd = filters.dateRangeEnd;
    if (filters?.date) params.date = filters.date;
    if (filters?.period) params.period = filters.period;
    if (filters?.dishTypeId !== undefined) params.dishTypeId = String(filters.dishTypeId);
    if (filters?.mealTypeId !== undefined) params.mealTypeId = String(filters.mealTypeId);
    if (filters?.dayOfWeek !== undefined) params.dayOfWeek = String(filters.dayOfWeek);
    if (filters?.mealName) params.mealName = filters.mealName;
    if (filters?.refeitorioId !== undefined) params.refeitorioId = String(filters.refeitorioId);

    const response = await axios.get<WasteReportStatistics>(`${API_URL}/statistics`, { params });
    return response.data;
  },
};

