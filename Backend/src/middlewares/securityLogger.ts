import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

// ─── Padrões de ataque ────────────────────────────────────────────────────────

/** Indicadores típicos de tentativa XSS */
const XSS_PATTERNS = [
  /<script[\s>]/i,
  /javascript\s*:/i,
  /on\w+\s*=/i,           // onclick=, onerror=, etc.
  /<\s*iframe/i,
  /&#x?[0-9a-f]+;/i,      // HTML entities codificadas
  /expression\s*\(/i,     // CSS expression()
  /vbscript\s*:/i,
];

/** Indicadores típicos de SQL injection */
const SQLI_PATTERNS = [
  /(\bor\b|\band\b)\s+\d+\s*=\s*\d+/i,      // OR 1=1, AND 1=1
  /union\s+(all\s+)?select/i,
  /;\s*(drop|delete|insert|update)\s/i,
  /--\s*$/m,
  /\/\*.*\*\//,                               // inline SQL comment
];

/** Path traversal */
const PATH_TRAVERSAL_PATTERNS = [/\.\.(\/|\\)/];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getClientIp(req: Request): string {
  // Render/outros proxies passam o IP real aqui
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return (Array.isArray(forwarded) ? forwarded[0] : forwarded)
      .split(",")[0]
      .trim();
  }
  return req.ip ?? "unknown";
}

function sanitize(value: string): string {
  // Remove CR/LF para evitar log injection
  return value.replace(/[\r\n]/g, "").slice(0, 500);
}

function scanValue(value: unknown): { xss: boolean; sqli: boolean; path: boolean } {
  if (typeof value !== "string") return { xss: false, sqli: false, path: false };
  return {
    xss: XSS_PATTERNS.some((p) => p.test(value)),
    sqli: SQLI_PATTERNS.some((p) => p.test(value)),
    path: PATH_TRAVERSAL_PATTERNS.some((p) => p.test(value)),
  };
}

function flattenObject(obj: Record<string, unknown>, prefix = ""): string[] {
  const values: string[] = [];
  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      values.push(...flattenObject(val as Record<string, unknown>, `${prefix}${key}.`));
    } else {
      values.push(String(val ?? ""));
    }
  }
  return values;
}

// ─── Middleware principal ─────────────────────────────────────────────────────

/**
 * securityLogger
 *
 * Deve ser registado DEPOIS do express.json() para ter acesso ao body.
 * Regista:
 *  - Tentativas de XSS (query, body, headers)
 *  - Tentativas de SQLi
 *  - Path traversal
 *  - Todos os pedidos (nível debug em dev, info em prod para rotas sensíveis)
 */
export function securityLogger(req: Request, _res: Response, next: NextFunction): void {
  const ip = getClientIp(req);
  const method = sanitize(req.method);
  const path = sanitize(req.path);
  const ua = sanitize(req.headers["user-agent"] ?? "");

  // Valores a analisar: query params + body
  const queryValues = flattenObject(req.query as Record<string, unknown>);
  const bodyValues =
    req.body && typeof req.body === "object" ? flattenObject(req.body) : [];
  const allValues = [...queryValues, ...bodyValues];

  for (const value of allValues) {
    const { xss, sqli, path: pt } = scanValue(value);

    if (xss) {
      logger.warn("SECURITY:XSS_ATTEMPT", {
        ip,
        method,
        path,
        ua,
        payload: sanitize(value),
      });
    }
    if (sqli) {
      logger.warn("SECURITY:SQLI_ATTEMPT", {
        ip,
        method,
        path,
        ua,
        payload: sanitize(value),
      });
    }
    if (pt) {
      logger.warn("SECURITY:PATH_TRAVERSAL", {
        ip,
        method,
        path,
        ua,
        payload: sanitize(value),
      });
    }
  }

  next();
}

// ─── Middleware de logging de auth ────────────────────────────────────────────

/**
 * loginLogger
 *
 * Coloca na route do login para registar tentativas e resultados.
 * Uso em UserRoutes:
 *   router.post("/login", loginRateLimiter, loginLogger, UserController.login);
 */
export function loginLogger(req: Request, res: Response, next: NextFunction): void {
  const ip = getClientIp(req);
  const email = sanitize(String(req.body?.email ?? ""));

  // Interceta o res.json para saber se o login foi bem-sucedido
  const originalJson = res.json.bind(res);
  res.json = function (body: unknown) {
    const status = res.statusCode;
    if (status === 200 || status === 201) {
      logger.info("AUTH:LOGIN_SUCCESS", { ip, email });
    } else {
      logger.warn("AUTH:LOGIN_FAILED", { ip, email, status, reason: (body as any)?.message });
    }
    return originalJson(body);
  };

  next();
}

// ─── Rate-limit hit logger ────────────────────────────────────────────────────

/**
 * onRateLimitHit
 *
 * Passa como opção `handler` ao loginRateLimiter para logar brute-force.
 *
 * Exemplo:
 *   export const loginRateLimiter = rateLimit({
 *     ...,
 *     handler: onRateLimitHit,
 *   });
 */
export function onRateLimitHit(req: Request, res: Response): void {
  const ip = getClientIp(req);
  const email = sanitize(String(req.body?.email ?? ""));
  logger.warn("SECURITY:BRUTE_FORCE_BLOCKED", {
    ip,
    email,
    path: sanitize(req.path),
  });
  res.status(429).json({
    message: "Demasiadas tentativas. Tente novamente mais tarde.",
  });
}