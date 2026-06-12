import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize, errors } = format;

/**
 * Formato legível para desenvolvimento e stdout do Render.
 * Ex: [2026-06-06T12:00:00.000Z] INFO  [auth] Login falhado — ip=1.2.3.4
 */
const lineFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  const metaStr = Object.keys(meta).length
    ? " — " + JSON.stringify(meta)
    : "";
  return `[${timestamp}] ${level.toUpperCase().padEnd(5)} ${message}${metaStr}${stack ? "\n" + stack : ""}`;
});

const logger = createLogger({
  // Em produção só INFO ou acima; em dev mostra DEBUG também
  level: process.env.LOG_LEVEL ?? (process.env.NODE_ENV === "production" ? "info" : "debug"),
  format: combine(
    timestamp(),
    errors({ stack: true }), // inclui stack trace em erros
    lineFormat
  ),
  transports: [
    // stdout → Render captura automaticamente
    new transports.Console({
      format: combine(
        timestamp(),
        errors({ stack: true }),
        process.env.NODE_ENV !== "production" ? colorize({ all: true }) : format.simple(),
        lineFormat
      ),
    }),
  ],
});

export default logger;