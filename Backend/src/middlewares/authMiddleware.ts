import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { onRateLimitHit } from "./securityLogger";

/** Limite global por IP nas rotas API */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

/** Limite específico para login — quando excedido regista como brute-force */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  // onRateLimitHit loga o evento E responde com 429
  handler: onRateLimitHit,
});

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET não definido no .env");
}
export const jwtSecret = secret;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!decoded.id || !decoded.role) {
      return res.status(403).json({ message: "Token inválido" });
    }

    (req as any).user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};