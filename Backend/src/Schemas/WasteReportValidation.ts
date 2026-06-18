import Joi from "joi";

/** Schema for POST /waste-reports. */
export const createWasteReportSchema = Joi.object({
    wastePercentage: Joi.number().integer().min(0).max(100).required(),
    mealId: Joi.number().integer().positive().required(),
    reservationId: Joi.number().integer().positive().optional(),
    reportedBy: Joi.number().integer().positive().required(),
    refeitorioId: Joi.number().integer().positive().required(),
});

/** Schema for GET /waste-reports/date?date=... */
export const wasteReportDateQuerySchema = Joi.object({
    date: Joi.date().required(),
});

/** Schema for GET /waste-reports/statistics with optional filters. */
export const wasteReportStatisticsQuerySchema = Joi.object({
    mealId: Joi.number().integer().positive().optional(),
    dateRangeStart: Joi.date().optional(),
    dateRangeEnd: Joi.date().optional(),
    date: Joi.date().optional(),
    period: Joi.string().valid("day", "week", "month", "year").optional(),
    dishTypeId: Joi.number().integer().positive().optional(),
    dayOfWeek: Joi.number().integer().min(0).max(6).optional(),
    refeitorioId: Joi.number().integer().positive().optional(),
});
