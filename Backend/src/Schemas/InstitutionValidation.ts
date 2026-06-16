import Joi from "joi";

/** Schema for POST /institutions. */
export const createInstitutionSchema = Joi.object({
    name: Joi.string().trim().min(2).max(150).required(),
    idmenutype: Joi.number().integer().positive().required(),
    location: Joi.string().trim().min(2).max(150).required(),
    freguesia: Joi.string().trim().max(150).optional(),
    municipio: Joi.string().trim().max(150).optional(),
});
