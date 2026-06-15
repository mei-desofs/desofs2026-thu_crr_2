import Joi from "joi";

/** Schema for POST /refeitorios. */
export const createRefeitorioSchema = Joi.object({
    name: Joi.string().trim().min(2).max(150).required(),
    institutionId: Joi.number().integer().positive().optional(),
    location: Joi.string().trim().min(2).max(150).required(),
    freguesia: Joi.string().trim().max(150).optional(),
    municipio: Joi.string().trim().max(150).optional(),
});
