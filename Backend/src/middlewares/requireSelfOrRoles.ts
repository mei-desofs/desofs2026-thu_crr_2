import { Request, Response, NextFunction } from "express";

/**
 * Allow if req.params[paramName] matches req.user.id, or if user.role is in allowedRoles.
 */
export const requireSelfOrRoles = (paramName: string, ...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const paramValue = Number(req.params[paramName]);
    if (!Number.isNaN(paramValue) && paramValue === Number(user.id)) {
      return next();
    }

    if (allowedRoles.includes(user.role)) {
      return next();
    }

    return res.status(403).json({ message: "Sem permissão para aceder" });
  };
};
