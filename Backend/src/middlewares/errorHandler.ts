import { Request, Response, NextFunction } from "express";

/**
 * MT22-Solution — Central error handler (R3 mitigation)
 *
 * Sends a generic message to the client in production and logs
 * the full error detail (stack + message) only to the server console.
 *
 * Usage: register AFTER all routes in index.ts
 *   app.use(errorHandler);
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  const isDev = process.env.NODE_ENV !== "production";

  // Always log the full detail server-side
  console.error(`[${new Date().toISOString()}] Unhandled error on ${req.method} ${req.path}:`, err);

  if (res.headersSent) return;

  res.status(500).json({
    message: isDev && err instanceof Error ? err.message : "Internal server error",
  });
}
