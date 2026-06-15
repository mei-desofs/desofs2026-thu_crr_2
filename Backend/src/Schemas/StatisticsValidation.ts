import Joi from "joi";

/** Filters for GET /performance/waste query string. */
export const performanceWasteQuerySchema = Joi.object({
    date: Joi.date().optional(),
    period: Joi.string().valid("day", "week", "month", "year").optional(),
    dateRangeStart: Joi.date().optional(),
    dateRangeEnd: Joi.date().optional(),
    dayOfWeek: Joi.number().integer().min(0).max(6).optional(),
    dishTypeId: Joi.number().integer().positive().optional(),
    mealId: Joi.number().integer().positive().optional(),
    refeitorioId: Joi.number().integer().positive().optional(),
});

/** Filters for GET /producer-statistics. */
export const producerStatisticsQuerySchema = Joi.object({
    producerId: Joi.number().integer().positive().optional(),
});
