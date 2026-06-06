import axios from "axios";
import type { User } from "../models/User";
import { API_BASE_URL } from "../../config";
import type { SupplierOrder } from "../models/SupplierOrder";

const API_URL = `${API_BASE_URL}/users`;

export const userService = {

  async getUserById(userId: number): Promise<User> {
    const response = await axios.get<User>(`${API_URL}/` + userId);
    return response.data;
  },

  //router.get("/ordered-suppliers", AuxiliarController.listOrderedSuppliers);
  async listOrderedSuppliers(): Promise<SupplierOrder[]> {
    const response = await axios.get<SupplierOrder[]>(`${API_BASE_URL}/auxiliar/ordered-suppliers`);
    return response.data;
  },

  async startQuarantine(userId: number): Promise<User> {
    const response = await axios.patch<User>(`${API_URL}/startQuarantine/` + userId);
    return response.data;
  },

  async endQuarantine(userId: number): Promise<User> {
    const response = await axios.patch<User>(`${API_URL}/endQuarantine/` + userId);
    return response.data;
  }
};

