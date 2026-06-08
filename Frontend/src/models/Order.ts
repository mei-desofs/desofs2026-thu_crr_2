export type OrderStatus =
  | "pending"
  | "sent"
  | "confirmed"
  | "rejected"
  | "cancelled"
  | "delivered";

export interface Order {
  id: number;
  userId: number;
  neededProductId: number;
  productId: number;
  unit: string;
  quantity: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  date: string;
  canteenId: number;
}
