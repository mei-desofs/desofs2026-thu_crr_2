import { Response } from "express";
import { Schema } from "joi";

/**
 * Defence-in-depth helper for controller-level validation.
 *
 * The route-level `validate` middleware should be the first line of defence,
 * but if a route is wired without it (or if a controller is invoked directly
 * from a test), this helper ensures the controller still rejects invalid
 * payloads with the same error shape.
 *
 * Returns `{ ok: true, value }` when validation passes (the caller should
 * continue using `value`). Returns `{ ok: false }` after `res.status(400)`
 * has been called — the caller must `return` immediately.
 *
 * Usage:
 *   const v = validateOrFail(createBatchSchema, req.body, res);
 *   if (!v.ok) return;
 *   const result = await service.createBatch(v.value);
 */
export function validateOrFail<T = any>(
    schema: Schema,
    data: unknown,
    res: Response,
): { ok: true; value: T } | { ok: false } {
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        convert: true,
    });
    if (error) {
        res.status(400).json({
            error: "Validation failed",
            details: error.details.map((d) => ({
                field: d.path.join(".") || "(root)",
                message: d.message,
            })),
        });
        return { ok: false };
    }
    return { ok: true, value: value as T };
}
