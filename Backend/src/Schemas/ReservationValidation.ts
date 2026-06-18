import Joi from "joi";

const reservationStatuses = [
    "active",
    "consumed",
    "not consumed",
    "pendent",
    "canceled",
] as const;

/**
 * Schema for POST /reservations.
 *
 * `status`, `reservationDate`, `quantity` and `refeitorioId` are optional —
 * the controller fills in defaults (refeitorioId from the meal, status="active",
 * quantity=1, reservationDate=now) when omitted.
 */
export const createReservationSchema = Joi.object({
    status: Joi.string().valid(...reservationStatuses).optional(),
    reservationDate: Joi.date().optional(),
    quantity: Joi.number().integer().min(1).max(1000).optional(),
    mealId: Joi.number().integer().positive().required(),
    userId: Joi.number().integer().positive().required(),
    refeitorioId: Joi.number().integer().positive().optional(),
});

/** Schema for PATCH /reservations/:id/status. */
export const updateReservationStatusSchema = Joi.object({
    status: Joi.string()
        .valid(...reservationStatuses)
        .required(),
});

/** Schema for POST /reservations/:id/lift. */
export const liftTicketsSchema = Joi.object({
    quantity: Joi.number().integer().min(1).max(1000).required(),
});

/** Schema for GET /reservations?userId=...&status=...&refeitorioId=... */
export const listReservationsQuerySchema = Joi.object({
    userId: Joi.number().integer().positive().optional(),
    status: Joi.string().valid(...reservationStatuses).optional(),
    refeitorioId: Joi.number().integer().positive().optional(),
});
