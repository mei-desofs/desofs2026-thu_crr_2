import axios from "axios";
import type { User } from "../models/User";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/users`;

interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<User> {
  const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
    email: email,
    password,
  });
  return response.data.user;
  },
};
