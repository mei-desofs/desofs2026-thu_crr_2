import axios from "axios";
import type { Order, OrderStatus } from "../models/Order";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/orders`;

export const orderService = {
  async create(data: Partial<Order>): Promise<Order> {
    const response = await axios.post<Order>(API_URL, data);
    return response.data;
  },

  async update(id: number, data: Partial<Order>): Promise<Order> {
    const response = await axios.put<Order>(`${API_URL}/${id}`, data);
    return response.data;
  },

  async updateStatus(id: number, status: OrderStatus): Promise<Order> {
    const response = await axios.patch<Order>(`${API_URL}/${id}/status`, { status });
    return response.data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await axios.delete<{ message: string }>(`${API_URL}/${id}`);
    return response.data;
  },

  async list(): Promise<Order[]> {
    const response = await axios.get<Order[]>(API_URL);
    return response.data;
  },

  async getByUserId(userId: number): Promise<Order[]> {
    const url = `${API_URL}/${userId}`;

    const response = await axios.get<Order[]>(url);
    return response.data;
  },

  async getAll(): Promise<Order[]> {
    const response = await axios.get<Order[]>(API_URL);
    return response.data;
  }
};
