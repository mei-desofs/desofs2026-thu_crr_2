import axios from "axios";
import type { Notification } from "../models/Notification";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/notifications`;

export const notificationService = {
  async createNotification(data: Partial<Notification>): Promise<Notification> {
    const response = await axios.post<Notification>(API_URL, data);
    return response.data;
  },

  async markAsSeen(id: number): Promise<Notification> {
    const response = await axios.put<Notification>(`${API_URL}/${id}`);
    return response.data;
  },

  async getByUserId(userId: number, status?: "sent" | "seen"): Promise<Notification[]> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    const query = params.toString();
    const url = query ? `${API_URL}/user/${userId}?${query}` : `${API_URL}/user/${userId}`;
    const response = await axios.get<Notification[]>(url);
    return response.data;
  }
};
