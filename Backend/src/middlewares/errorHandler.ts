import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

function sanitizeForLog(value: string): string {
  return value.replace(/[\r\n]/g, "");
}

/**
 * errorHandler (atualizado com winston)
 *
 * Regista o erro completo (com stack) no logger e devolve
 * uma mensagem genérica ao cliente em produção.
 *
 * Manter como ÚLTIMO middleware em index.ts:
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

  logger.error("UNHANDLED_ERROR", {
    method,
    path,
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
  });

  if (res.headersSent) return;

  res.status(500).json({
    message:
      isDev && err instanceof Error ? err.message : "Internal server error",
  });
}