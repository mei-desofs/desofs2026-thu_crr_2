import Joi from "joi";

/** Single farmer-product line. */
const productLineSchema = Joi.object({
    productId: Joi.number().integer().positive().required(),
    quantity: Joi.number().positive().required(),
    unit: Joi.string().trim().min(1).max(50).required(),
});

/** Weekly bundle of farmer products. */
const weeklyFarmerProductSchema = Joi.object({
    week: Joi.number().integer().min(1).max(53).required(),
    products: Joi.array().items(productLineSchema).min(1).required(),
});

const documentSchema = Joi.object({
    filename: Joi.string().min(1).max(255).required(),
    path: Joi.string().min(1).max(500).required(),
});

const applicationStatusValues = ["pending", "accepted", "rejected"] as const;

/**
 * Full schema for create/update of an Application (JSON body).
 * Used by the JSON endpoints and as the validation step inside the
 * multipart `createApplicationWithFiles` / `updateApplicationWithFiles`
 * controllers after the body is parsed.
 */
export const applicationSchema = Joi.object({
    userId: Joi.number().integer().positive().required(),
    applicationDate: Joi.date().optional(),
    status: Joi.string().valid(...applicationStatusValues).optional(),
    businessEmail: Joi.string().trim().email().max(150).required(),
    businessPhone: Joi.string().trim().min(3).max(30).required(),
    supplierComment: Joi.string().trim().max(2000).optional().allow(""),
    name: Joi.string().trim().min(2).max(150).required(),
    location: Joi.string().trim().min(2).max(150).required(),
    freguesia: Joi.string().trim().min(2).max(150).required(),
    municipio: Joi.string().trim().min(2).max(150).required(),
    evaluationComment: Joi.string().trim().max(2000).optional().allow(""),
    documentsSubmitted: Joi.array().items(documentSchema).optional(),
    farmerProducts: Joi.array().items(weeklyFarmerProductSchema).min(1).required(),
});

/** Schema for the JSON body of accept/reject endpoints. */
export const evaluateApplicationSchema = Joi.object({
    evaluationComment: Joi.string().trim().max(2000).optional().allow(""),
});
