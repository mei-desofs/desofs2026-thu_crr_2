import { apiClient } from "./setupAxiosAuth";
import type { Order, OrderStatus } from "../models/Order";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/orders`;

export const orderService = {
  async create(data: Partial<Order>): Promise<Order> {
    const response = await apiClient.post<Order>(API_URL, data);
    return response.data;
  },

  async update(id: number, data: Partial<Order>): Promise<Order> {
    const response = await apiClient.put<Order>(`${API_URL}/${id}`, data);
    return response.data;
  },

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const response = await apiClient.patch<Order>(`${API_URL}/${id}/status`, { status });
    return response.data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`${API_URL}/${id}`);
    return response.data;
  },

  async list(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>(API_URL);
    return response.data;
  },

  async getByUserId(userId: number): Promise<Order[]> {
    const url = `${API_URL}/${userId}`;

    const response = await apiClient.get<Order[]>(url);
    return response.data;
  },

  async getAll(): Promise<Order[]> {
    const response = await apiClient.get<Order[]>(API_URL);
    return response.data;
  }
};
