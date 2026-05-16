import type { Request } from "express";

// MT25 — não registar `req.body` completo em produção; só identificadores (chaves/params).
export function logRequestIdentifiers(
  tag: string,
  req: Pick<Request, "method" | "path" | "originalUrl" | "params" | "body">,
): void {
  if (!isNonProduction()) return;
  const path = req.originalUrl || req.path || "";
  let bodyKeys: string;
  if (req.body === null || req.body === undefined) {
    bodyKeys = "-";
  } else if (Array.isArray(req.body)) {
    bodyKeys = `array(len=${req.body.length})`;
  } else if (typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    bodyKeys = Object.keys(req.body as object).join(",") || "-";
  } else {
    bodyKeys = typeof req.body;
  }
  const params =
    req.params && typeof req.params === "object" ? JSON.stringify(req.params) : "{}";
  console.log(`[M25][${tag}] ${req.method} ${path} params=${params} bodyKeys=${bodyKeys}`);
}

export function logErrorSafe(context: string, err: unknown): void {
  if (process.env.NODE_ENV === "production") {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[M25] ${context}`, msg);
    return;
  }
  console.error(context, err);
}

export function isNonProduction(): boolean {
  return process.env.NODE_ENV !== "production";
}
