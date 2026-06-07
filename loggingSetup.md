# Logging de Segurança — Guia de Integração

## 1. Instalar o Winston

```bash
npm install winston
npm install --save-dev @types/winston  # se necessário
```

---

## 2. Ficheiros novos/alterados

| Ficheiro | Acção |
|---|---|
| `src/utils/logger.ts` | **NOVO** — instância winston partilhada |
| `src/middlewares/httpLogger.ts` | **NOVO** — loga todos os pedidos HTTP |
| `src/middlewares/securityLogger.ts` | **NOVO** — deteta XSS, SQLi, path traversal, brute-force |
| `src/middlewares/errorHandler.ts` | **SUBSTITUIR** — usa winston em vez de console.error |
| `src/middlewares/authMiddleware.ts` | **SUBSTITUIR** — passa `onRateLimitHit` ao loginRateLimiter |
| `src/Routes/UserRoutes.ts` | **SUBSTITUIR** — adiciona `loginLogger` na rota /login |
| `index.ts` | **SUBSTITUIR** — regista `httpLogger` e `securityLogger` |

---

## 3. O que fica registado automaticamente

### Tentativas de XSS
```
[2026-06-06T12:00:00.000Z] WARN  SECURITY:XSS_ATTEMPT — {"ip":"1.2.3.4","method":"POST","path":"/products","payload":"<script>alert(1)</script>"}
```

### Tentativas de SQLi
```
[2026-06-06T12:00:00.000Z] WARN  SECURITY:SQLI_ATTEMPT — {"ip":"1.2.3.4","path":"/users/login","payload":"' OR 1=1--"}
```

### Brute-force no login (rate limit atingido)
```
[2026-06-06T12:00:00.000Z] WARN  SECURITY:BRUTE_FORCE_BLOCKED — {"ip":"1.2.3.4","email":"admin@example.com","path":"/users/login"}
```

### Login com sucesso / falha
```
[2026-06-06T12:00:00.000Z] INFO  AUTH:LOGIN_SUCCESS — {"ip":"1.2.3.4","email":"joao@example.com"}
[2026-06-06T12:00:00.000Z] WARN  AUTH:LOGIN_FAILED  — {"ip":"1.2.3.4","email":"joao@example.com","status":401}
```

### Pedidos HTTP
```
[2026-06-06T12:00:00.000Z] DEBUG HTTP:OK  — {"method":"GET","path":"/menus","status":200,"ms":45,"ip":"1.2.3.4"}
[2026-06-06T12:00:00.000Z] WARN  HTTP:4XX — {"method":"GET","path":"/reservations/999","status":404,"ms":12}
```

---

## 4. Variáveis de ambiente

Adicionar ao `.env` e às **Environment Variables** do Render:

```env
# Já existente
JWT_SECRET=...

# Novo (opcional)
LOG_LEVEL=info          # debug | info | warn | error  (default: info em prod)
CORS_ORIGIN=https://meu-frontend.onrender.com
NODE_ENV=production
```

---

## 5. Render — configuração

O Render captura automaticamente **stdout/stderr** de qualquer processo Node.js.
Não é necessária nenhuma configuração adicional — o winston escreve para stdout.

Para ver os logs em tempo real:
- Dashboard Render → serviço → aba **"Logs"**
- Filtrar por `SECURITY:` para ver apenas eventos de segurança
- Filtrar por `AUTH:` para ver tentativas de login

### Alertas (opcional)
O Render suporta **Log Streams** (Settings → Log Streams) para enviar logs para:
- **Datadog**, **Papertrail**, **Logtail**, ou qualquer endpoint HTTPS

---

## 6. Uso do logger noutros ficheiros

```typescript
import logger from "../utils/logger";

// Informação geral
logger.info("ORDER:CREATED", { orderId: 42, userId: 7 });

// Aviso de segurança
logger.warn("SECURITY:SUSPICIOUS_ACTIVITY", { ip, details: "..." });

// Erro com stack trace
logger.error("DB:QUERY_FAILED", { error });
```

---

## 7. Extensão futura — enviar alertas críticos por email/webhook

Para eventos `SECURITY:*` críticos em produção pode adicionar um transport ao winston:

```typescript
// Em logger.ts — adicionar ao array de transports:
new transports.Http({
  host: "hooks.slack.com",
  path: "/services/...",    // webhook do Slack
  ssl: true,
  level: "warn",            // só WARN e acima
})
```