import Joi from "joi";

/** Schema for POST /notifications. */
export const createNotificationSchema = Joi.object({
    userId: Joi.number().integer().positive().required(),
    title: Joi.string().trim().min(1).max(200).required(),
    body: Joi.string().trim().min(1).max(2000).required(),
});

/** Schema for GET /notifications/user/:userId?status=... */
export const notificationListQuerySchema = Joi.object({
    status: Joi.string().valid("sent", "seen").optional(),
});
