import Joi from "joi";

const neededProductStatuses = ["needed", "ordered", "received"] as const;

/** Schema for POST /needed-products. */
export const createNeededProductSchema = Joi.object({
    date: Joi.date().required(),
    productId: Joi.number().integer().positive().required(),
    // mealId is referenced in the controller but tolerated as optional
    // because some callers omit it.
    mealId: Joi.number().integer().positive().optional(),
    unit: Joi.string().trim().min(1).max(50).required(),
    quantity: Joi.number().positive().required(),
    canteenId: Joi.number().integer().positive().required(),
    status: Joi.string().valid(...neededProductStatuses).optional(),
});

/** Schema for PUT /needed-products/:id. Partial update. */
export const updateNeededProductSchema = Joi.object({
    date: Joi.date().optional(),
    productId: Joi.number().integer().positive().optional(),
    mealId: Joi.number().integer().positive().optional(),
    unit: Joi.string().trim().min(1).max(50).optional(),
    quantity: Joi.number().positive().optional(),
    canteenId: Joi.number().integer().positive().optional(),
    status: Joi.string().valid(...neededProductStatuses).optional(),
}).min(1);
