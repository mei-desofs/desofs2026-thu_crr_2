import Joi from "joi";

const productLineSchema = Joi.object({
    productId: Joi.number().integer().positive().required(),
    quantity: Joi.number().positive().required(),
    unit: Joi.string().trim().min(1).max(50).required(),
});

const weeklyFarmerProductSchema = Joi.object({
    week: Joi.number().integer().min(1).max(53).required(),
    products: Joi.array().items(productLineSchema).min(1).required(),
});

/**
 * Body schema for POST /farmer-products.
 *
 * Mirrors the previous inline validation, but wraps the array in a top-level
 * object so the request body has a consistent shape and so `validate` can
 * enforce unknown-key rejection.
 */
export const createFarmerProductsSchema = Joi.object({
    userId: Joi.number().integer().positive().required(),
    applicationId: Joi.number().integer().positive().required(),
    farmerProducts: Joi.array().items(weeklyFarmerProductSchema).min(1).required(),
});
