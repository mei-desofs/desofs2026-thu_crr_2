import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

function getClientIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return (Array.isArray(forwarded) ? forwarded[0] : forwarded)
      .split(",")[0]
      .trim();
  }
  return req.ip ?? "unknown";
}

/**
 * httpLogger
 *
 * Regista cada pedido HTTP com: método, path, status, duração, IP.
 * Regista como WARN pedidos com status 4xx e ERROR para 5xx.
 *
 * Regista em index.ts ANTES das rotas:
 *   app.use(httpLogger);
 */
export function httpLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();
  const ip = getClientIp(req);

  res.on("finish", () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    const logData = {
      method: req.method,
      path: req.path,
      status,
      ms,
      ip,
    };

    if (status >= 500) {
      logger.error("HTTP:5XX", logData);
    } else if (status >= 400) {
      logger.warn("HTTP:4XX", logData);
    } else {
      logger.debug("HTTP:OK", logData);
    }
  });

  next();
}