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

export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user; // vem do authMiddleware

    if (!user) {
      logger.warn("SECURITY:UNAUTHENTICATED_ACCESS", {
        method: req.method,
        path: req.path,
        ip: getClientIp(req),
      });
      return res.status(401).json({ message: "Não autenticado" });
    }

    if (!roles.includes(user.role)) {
      logger.warn("SECURITY:ACCESS_DENIED", {
        userId: user.id,
        role: user.role,
        requiredRoles: roles,
        method: req.method,
        path: req.path,
        ip: getClientIp(req),
      });
      return res.status(403).json({ message: "Sem permissão para aceder" });
    }

    next();
  };
};