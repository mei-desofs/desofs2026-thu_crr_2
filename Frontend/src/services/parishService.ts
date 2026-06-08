import axios from "axios";
import type { Parish } from "../models/Parish";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/parishes`;

export interface ParishView {
  id: number;
  name: string;
  quarantined: boolean;
  updatedAt: string;
}

export const parishService = {
  async createParish(data: Partial<Parish>): Promise<Parish> {
    const response = await axios.post<Parish>(`${API_URL}`, data);
    return response.data;
  },

  async getParishById(id: number): Promise<Parish> {
    const response = await axios.get<Parish>(`${API_URL}/${id}`);
    return response.data;
  },

  async listParishes(): Promise<ParishView[]> {
    const response = await axios.get<ParishView[]>(`${API_URL}`);
    return response.data;
  },

  async quarantineParish(id: number): Promise<ParishView> {
    const response = await axios.patch<ParishView>(`${API_URL}/quarantineParish/${id}`);
    return response.data;
  },

  async takeParishOfQuarantine(id: number): Promise<ParishView> {
    const response = await axios.patch<ParishView>(`${API_URL}/takeParishOfQuarantine/${id}`);
    return response.data;
  }
};
