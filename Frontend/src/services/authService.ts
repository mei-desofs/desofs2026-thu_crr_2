import { apiClient } from "./setupAxiosAuth";
import type { User } from "../models/User";
import { API_BASE_URL } from "../../config";
import { setStoredToken } from "./setupAxiosAuth";

const API_URL = `${API_BASE_URL}/users`;

interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
    const response = await apiClient.post<LoginResponse>(`${API_URL}/login`, {
      email,
      password,
    });
    setStoredToken(response.data.token);
    return { ...response.data.user, token: response.data.token };
  },
};
