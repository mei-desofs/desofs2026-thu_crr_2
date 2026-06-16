import { Request, Response, NextFunction } from "express";
import { Schema } from "joi";

/**
 * Source where the data to validate lives on the Request.
 */
export type ValidationSource = "body" | "params" | "query";

/**
 * Reusable validation middleware.
 *
 * Validates `req[source]` against the given Joi schema.
 * On success, the validated/coerced value is written back (for `body` and
 * `params`; `query` is read-only in Express 5 so we only validate it).
 *
 * On failure, returns 400 with the full list of issues (no early-abort).
 *
 * Unknown keys are rejected by default (Joi's `Joi.object` default behaviour),
 * which mitigates mass-assignment / OWASP API8 style abuse.
 *
 * Usage:
 *   router.post("/", validate(createXSchema), authorizeRoles(...), Controller.create);
 *   router.get("/:id", validate(idParamSchema, "params"), Controller.get);
 */
export function validate(schema: Schema, source: ValidationSource = "body") {
    return (req: Request, res: Response, next: NextFunction) => {
        const data = req[source];

        const { error, value } = schema.validate(data, {
            abortEarly: false,
            convert: true,
            stripUnknown: false,
            // Joi rejects unknown keys by default on Joi.object schemas; we
            // keep it explicit at call-site if a schema needs to be permissive.
        });

        if (error) {
            return res.status(400).json({
                error: "Validation failed",
                details: error.details.map((d) => ({
                    field: d.path.join(".") || "(root)",
                    message: d.message,
                })),
            });
        }

        // Write back validated/coerced value where possible.
        if (source === "body") {
            req.body = value;
        } else if (source === "params") {
            // req.params is mutable in Express
            Object.keys(value).forEach((k) => {
                (req.params as any)[k] = value[k];
            });
        }
        // req.query is a getter in Express 5 — we validate but do not reassign.

        next();
    };
}
