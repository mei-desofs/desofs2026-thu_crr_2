import Joi from "joi";
import { Role } from "../Config/roles";

const allRoles = Object.values(Role);

/**
 * Schema for POST /users/register.
 *
 * Role-conditional rules:
 *  - RefectoryManager and RefectoryStaff REQUIRE refeitorioId.
 *  - CanteenManager REQUIRES canteenId.
 *  - Other roles must NOT supply these fields.
 */
export const registerUserSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().trim().email().max(150).required(),
    // Minimum 8 chars (SR-style baseline). Max 128 to avoid bcrypt 72-byte
    // truncation surprises while still allowing passphrases.
    password: Joi.string().min(8).max(128).required(),
    role: Joi.string()
        .valid(...allRoles)
        .required(),
    refeitorioId: Joi.number()
        .integer()
        .positive()
        .when("role", {
            is: Joi.valid(Role.RefectoryManager, Role.RefectoryStaff),
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        }),
    canteenId: Joi.number()
        .integer()
        .positive()
        .when("role", {
            is: Joi.valid(Role.CanteenManager),
            then: Joi.required(),
            otherwise: Joi.forbidden(),
        }),
});

/** Schema for POST /users/login. */
export const loginSchema = Joi.object({
    email: Joi.string().trim().email().max(150).required(),
    password: Joi.string().min(1).max(128).required(),
});
