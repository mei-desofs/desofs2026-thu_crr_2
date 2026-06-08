/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { API_BASE_URL } from "../../config";
import type { Reservation, ReservationStatus } from "../models/Reservation";
import type { User } from "../models/User";
import type { Meal } from "../models/Meal";

const API_URL = `${API_BASE_URL}/reservations`;

/**
 * Dados para criar uma nova reserva
 */
export type CreateReservationPayload = {
  status?: ReservationStatus;
  reservationDate?: string | Date;
  quantity: number;
  mealId: number;
  userId: number;
  refeitorioId?: number; // Opcional: se não for passado, o backend usa o refeitorioId da meal
};

/**
 * Reserva com relacionamentos incluídos
 * Estende Reservation com user, meal e dish quando retornados pelo backend
 */
export interface ReservationWithRelations extends Reservation {
  user?: User;
  meal?: Meal & {
    dish?: {
      id: number;
      name: string;
    };
    canteen?: {
      id: number;
      name: string;
    };
  };
}

export const reservationService = {
  // -------------------------
  // Criar uma nova reserva
  // -------------------------
  async createReservation(data: CreateReservationPayload): Promise<Reservation> {
    const response = await axios.post<Reservation>(API_URL, data);
    return response.data;
  },

  // -------------------------
  // Listar reservas
  // Retorna reservas com relacionamentos (user, meal, dish) quando disponíveis
  // -------------------------
  async listReservations(params?: { userId?: number; status?: string; refeitorioId?: number }): Promise<ReservationWithRelations[]> {
    const response = await axios.get<ReservationWithRelations[]>(API_URL, { params });
    return response.data;
  },

  // -------------------------
  // Cancelar uma reserva
  // -------------------------
  async cancelReservation(id: number): Promise<Reservation> {
    const response = await axios.patch<Reservation>(`${API_URL}/${id}/cancel`);
    return response.data;
  },

  // -------------------------
  // Atualizar status de uma reserva
  // -------------------------
  async updateStatus(id: number, status: ReservationStatus): Promise<Reservation> {
    const response = await axios.patch<Reservation>(`${API_URL}/${id}/status`, { status });
    return response.data;
  },

  // -------------------------
  // Levantar bilhetes de uma reserva
  // -------------------------
  async liftTickets(id: number, quantity: number): Promise<Reservation> {
    const response = await axios.post<Reservation>(`${API_URL}/${id}/lift`, { quantity });
    return response.data;
  },
};


