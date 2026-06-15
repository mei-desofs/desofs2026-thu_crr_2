import Joi from "joi";

const orderStatuses = [
    "pending",
    "sent",
    "confirmed",
    "rejected",
    "cancelled",
    "delivered",
] as const;

/** Schema for POST /orders. */
export const createOrderSchema = Joi.object({
    userId: Joi.number().integer().positive().required(),
    neededProductId: Joi.number().integer().positive().required(),
    productId: Joi.number().integer().positive().required(),
    unit: Joi.string().trim().min(1).max(50).required(),
    quantity: Joi.number().positive().required(),
    date: Joi.date().required(),
    canteenId: Joi.number().integer().positive().required(),
});

/** Schema for PUT /orders/:id. Partial update — all fields optional. */
export const updateOrderSchema = Joi.object({
    userId: Joi.number().integer().positive().optional(),
    neededProductId: Joi.number().integer().positive().optional(),
    productId: Joi.number().integer().positive().optional(),
    unit: Joi.string().trim().min(1).max(50).optional(),
    quantity: Joi.number().positive().optional(),
    status: Joi.string().valid(...orderStatuses).optional(),
    date: Joi.date().optional(),
    canteenId: Joi.number().integer().positive().optional(),
}).min(1);

/** Schema for PATCH /orders/:id/status. */
export const updateOrderStatusSchema = Joi.object({
    status: Joi.string().valid(...orderStatuses).required(),
});
