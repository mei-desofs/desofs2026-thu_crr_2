import { Request, Response } from "express";
import { NotificationService } from "../Service/NotificationService";
import { createNotificationSchema } from "../Schemas/NotificationValidation";
import { validateOrFail } from "../utils/validateOrFail";

export class NotificationController {
    static async create(req: Request, res: Response) {
        try {
            const cv = validateOrFail(createNotificationSchema, req.body, res);
            if (!cv.ok) return;
            const { userId, title, body } = cv.value;

            if (!userId || !title || !body) {
                return res.status(400).json({
                    message: "userId, title and body are required",
                });
            }

            const notification = await NotificationService.create(
                userId,
                title,
                body
            );

            return res.status(201).json(notification);
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    // DELETE → marcar como vista
    static async markAsSeen(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const notification = await NotificationService.markAsSeen(
                Number(id)
            );

            if (!notification) {
                return res.status(404).json({
                    message: "Notification not found",
                });
            }

            return res.status(200).json(notification);
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    static async getByUserId(req: Request, res: Response) {
        try {
            const { userId } = req.params;
            const { status } = req.query;

            const notifications = await NotificationService.getByUserId(
                Number(userId),
                status as "sent" | "seen" | undefined
            );

            return res.status(200).json(notifications);
        } catch (error: any) {
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }
}
