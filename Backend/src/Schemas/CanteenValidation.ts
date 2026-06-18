import Joi from "joi";

/** Schema for POST /canteens. */
export const createCanteenSchema = Joi.object({
    name: Joi.string().trim().min(2).max(150).required(),
    institutionId: Joi.number().integer().positive().optional(),
    idmenutype: Joi.number().integer().positive().required(),
    location: Joi.string().trim().min(2).max(150).required(),
    freguesia: Joi.string().trim().max(150).optional(),
    municipio: Joi.string().trim().max(150).optional(),
});

/** Schema for POST /canteens/associate-refeitorio. */
export const associateRefeitorioSchema = Joi.object({
    canteenId: Joi.number().integer().positive().required(),
    refeitorioId: Joi.number().integer().positive().required(),
});

/** Schema for POST /canteens/associate-multiple-refeitorios. */
export const associateMultipleRefeitoriosSchema = Joi.object({
    canteenId: Joi.number().integer().positive().required(),
    refeitorioIds: Joi.array()
        .items(Joi.number().integer().positive())
        .min(1)
        .required(),
});
