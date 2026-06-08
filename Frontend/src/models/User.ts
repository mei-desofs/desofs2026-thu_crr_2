export type UserRole = "Supplier" | "NetworkManager" | "Nutritionist" | "Student" | "Visitor" | "NursingHome" | "RefectoryStaff" | "StockManager" | "CanteenManager" | "RefectoryManager";
export type UserStatus = "enabled" | "disabled" | "quarantine";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  updatedAt?: Date;
  canteenId?: number | null;
  refeitorioId?: number | null;
  canteen?: { id: number; name: string } | null;
  refeitorio?: { id: number; name: string } | null;
  token?: string;
}
