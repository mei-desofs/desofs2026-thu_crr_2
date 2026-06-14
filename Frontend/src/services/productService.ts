import { apiClient } from "./setupAxiosAuth";
import type { Product } from "../models/Product";
import { API_BASE_URL } from "../../config";

const API_URL = `${API_BASE_URL}/products`;

export const productService = {
  // -------------------------
  // Criar um novo produto
  // -------------------------
  async createProduct(data: Partial<Product>): Promise<Product> {
    const response = await apiClient.post<Product>(`${API_URL}`, data);
    return response.data;
  },

  // -------------------------
  // Listar todos os produtos
  // -------------------------
  async listProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(`${API_URL}`);
    return response.data;
  },

  // -------------------------
  // Obter produto por ID
  // -------------------------
  async getProductById(productId: number): Promise<Product> {
    const response = await apiClient.get<Product>(`${API_URL}/${productId}`);
    return response.data;
  },
};
