import { apiClient } from "./setupAxiosAuth";
import type { Application } from "../models/Application";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/applications`;

export const applicationService = {
  // -------------------------
  // Criar uma nova aplicação
  // -------------------------
  async createApplication(data: Partial<Application>): Promise<Application> {
    const response = await apiClient.post<Application>(`${API_URL}`, data);
    return response.data;
  },

  // -------------------------
  // Listar todas as aplicações
  // -------------------------
  async listApplications(): Promise<Application[]> {
    const response = await apiClient.get<Application[]>(`${API_URL}`);
    return response.data;
  },

  // -------------------------
  // Obter aplicação por ID
  // -------------------------
  async getApplicationById(applicationId: number): Promise<Application> {
    const response = await apiClient.get<Application>(`${API_URL}/${applicationId}`);
    return response.data;
  },
  // -------------------------
  // Atualizar uma aplicação
  // -------------------------
  async updateApplication(applicationId: number, data: Partial<Application>): Promise<Application> {
    const response = await apiClient.put<Application>(`${API_URL}/${applicationId}`, data);
    return response.data;
  },

  async acceptApplication(applicationId: number, evaluationComment: string): Promise<Application> {
    const response = await apiClient.post<Application>(`${API_URL}/${applicationId}/accept`, { evaluationComment });
    return response.data;
  },

  async rejectApplication(applicationId: number, evaluationComment: string): Promise<Application> {
    const response = await apiClient.post<Application>(`${API_URL}/${applicationId}/reject`, { evaluationComment });
    return response.data;
  },

  async getApplicationByUser(userId: number): Promise<Application> {
    const response = await apiClient.get<Application>(`${API_URL}/user/${userId}`);
    return response.data;
  },

};

