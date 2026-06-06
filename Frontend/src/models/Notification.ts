export type NotificationStatus = "sent" | "seen";

export interface Notification {
  id: number;
  userId: number;
  title: string;
  body: string;
  status: NotificationStatus;
  createdAt: string;
  updatedAt: string;
}
