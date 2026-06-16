import Joi from "joi";

/**
 * Reusable building blocks for endpoint validation.
 */

/** A positive integer used as a primary key. */
export const positiveIntId = Joi.number().integer().positive();

/** Standard `/:id` route param. */
export const idParamSchema = Joi.object({
    id: positiveIntId.required(),
});

/** `/:userId` route param. */
export const userIdParamSchema = Joi.object({
    userId: positiveIntId.required(),
});

/** `/:applicationId` route param. */
export const applicationIdParamSchema = Joi.object({
    applicationId: positiveIntId.required(),
});

/** `/:canteenId` route param. */
export const canteenIdParamSchema = Joi.object({
    canteenId: positiveIntId.required(),
});

/** `/:mealId` route param. */
export const mealIdParamSchema = Joi.object({
    mealId: positiveIntId.required(),
});

/** `/:applicationId/documents/:filename`. */
export const applicationDocumentParamSchema = Joi.object({
    applicationId: positiveIntId.required(),
    // Conservative filename pattern: letters, numbers, dot, dash, underscore.
    // No slashes, no traversal characters.
    filename: Joi.string()
        .min(1)
        .max(255)
        .pattern(/^[A-Za-z0-9._-]+$/)
        .required(),
});
