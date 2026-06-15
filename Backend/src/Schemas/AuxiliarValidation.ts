import Joi from "joi";

/**
 * Generic name-only schema used by allergens, nutrition types, product types,
 * dish types, meal types and menu types.
 */
export const createGenericTypeSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
});

/** Unit names are restricted to a fixed set of measurement labels. */
export const createUnitSchema = Joi.object({
    name: Joi.string().valid("g", "kg", "L", "mL", "unit", "box").required(),
});
