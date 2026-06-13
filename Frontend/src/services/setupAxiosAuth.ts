import axios, { type AxiosInstance } from "axios";

const TOKEN_KEY = "token";

export function getStoredToken(): string | null {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;

  const userRaw = localStorage.getItem("user");
  if (!userRaw) return null;

  try {
    const user = JSON.parse(userRaw) as { token?: string };
    if (user.token) {
      localStorage.setItem(TOKEN_KEY, user.token);
      return user.token;
    }
  } catch {
    return null;
  }

  return null;
}

export function setStoredToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function attachAuthInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  });
}

export const apiClient = axios.create();
attachAuthInterceptor(apiClient);
attachAuthInterceptor(axios);
