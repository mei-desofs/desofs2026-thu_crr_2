import { Request, Response, NextFunction } from "express";

function sanitizeForLog(value: string): string {
  // Strip CR/LF to prevent log injection (newline injection attacks)
  return value.replace(/[\r\n]/g, "");
}

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

  const method = sanitizeForLog(req.method);
  const path = sanitizeForLog(req.path);

  // Always log the full detail server-side
  // Uses %s format specifiers instead of template literals to avoid format string injection
  console.error("[%s] Unhandled error on %s %s:", new Date().toISOString(), method, path, err);

  if (res.headersSent) return;

  res.status(500).json({
    message: isDev && err instanceof Error ? err.message : "Internal server error",
  });
}