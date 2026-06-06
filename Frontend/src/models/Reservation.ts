import type { User } from "./User";
import type { Meal } from "./Meal";

export type ReservationStatus = "active" | "consumed" | "not consumed" | "pendent" | "canceled";

export interface Reservation {
  id: number;
  status: ReservationStatus;
  reservationDate: string; // ISO date string
  quantity: number;
  mealId: number;
  userId: number;
  
  // Relacionamentos opcionais (quando vêm do backend com includes)
  meal?: Meal;
  user?: User;
}

