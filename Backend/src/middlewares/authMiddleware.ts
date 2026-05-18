import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import rateLimit from "express-rate-limit";

/** Limite global por IP nas rotas API (CodeQL js/missing-rate-limiting). */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

//mt7 — único módulo/variável de ambiente para assinar e verificar JWT
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET não definido no .env");
}
export const jwtSecret = secret;

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload; //mt7

    // Garantir que id e role existem
    if (!decoded.id || !decoded.role) {
      return res.status(403).json({ message: "Token inválido" });
    }

    // anexamos o user ao request
    (req as any).user = { id: decoded.id, role: decoded.role };

    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido ou expirado" });
  }
};
