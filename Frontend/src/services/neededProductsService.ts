import axios from "axios";
import type { NeededProduct } from "../models/NeededProduct";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/needed-products`;

export const neededProductService = {
  async create(data: Partial<NeededProduct>): Promise<NeededProduct> {
    const response = await axios.post<NeededProduct>(API_URL, data);
    return response.data;
  },

  async update(id: number, data: Partial<NeededProduct>): Promise<NeededProduct> {
    const response = await axios.put<NeededProduct>(`${API_URL}/${id}`, data);
    return response.data;
  },

  async delete(id: number): Promise<{ message: string }> {
    const response = await axios.delete<{ message: string }>(`${API_URL}/${id}`);
    return response.data;
  },

  async list(): Promise<NeededProduct[]> {
    const response = await axios.get<NeededProduct[]>(API_URL);
    return response.data;
  }
};
