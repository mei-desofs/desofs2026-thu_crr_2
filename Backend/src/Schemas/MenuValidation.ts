import Joi from "joi";

export const createMenuSchema = Joi.object({
    menuTypeId: Joi.number().integer().positive().required(),
    initialDate: Joi.date().greater("now").required(),
    finalDate: Joi.date().greater("now").required(),
    meals: Joi.array().items(Joi.number().integer().positive()).required(),
    canteenId: Joi.number().integer().positive().required(),
});

export const updateMenuStatusSchema = Joi.object({
    status: Joi.string().valid("published", "aproved", "pending").required(),
});

export const currentWeekMenuQuerySchema = Joi.object({
    menuTypeId: Joi.number().integer().positive().optional(),
    weekOffset: Joi.number().integer().optional(),
});
