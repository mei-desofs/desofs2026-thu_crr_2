[Voltar ao README](../README.md)
---

# Configuration Management

This document describes how the backend application manages environment variables, runtime configuration, and sensitive data. It covers environment isolation, secret handling, and deployment best practices.

---

## Goals

- Keep environment-specific configuration outside application code.
- Protect secrets from accidental disclosure.
- Support separate settings for development, testing, and production.
- Provide a clear reference for required configuration values.

## Configuration Principles

- Environment variables are the primary source of configuration.
- No secrets or environment-specific values are hard-coded in source control.
- Defaults are applied only when safe and non-sensitive.
- Sensitive values are classified and handled with restricted access.

## Environment Variables Table

Below are the environment variables required for the backend.

| Variable | Description | Example | Required? | Classification |
| :--- | :--- | :--- | :--- | :--- |
| `DB_HOST` | MySQL database host | `localhost` | Yes | Public / Config |
| `DB_PORT` | MySQL database port | `3306` | Yes | Public / Config |
| `DB_NAME` | Database schema name | `desofs2026` | Yes | Public / Config |
| `DB_USER` | MySQL username | `app_user` | Yes | Public / Config |
| `DB_PASS` | Password for the database user | `********` | Yes | Secret |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens | `a_strong_random_secret` | Yes | Secret |
| `NODE_ENV` | Execution environment | `test`, `production` | Yes | Public / Config |
| `LOG_LEVEL` | Logging verbosity level | `debug`, `info`, `warn`, `error` | No | Public / Config |
| `PORT` | HTTP server port | `3000` | No | Public / Config |

## Recommended Handling

- Use a `.env` file for local development only.
- Do not commit `.env` or any file containing secrets to source control.
- Use environment-specific configuration in CI/CD and production platforms.
- Load configuration early during application bootstrap and validate required values.

## Secret Management

- Treat `DB_PASS` and `JWT_SECRET` as secrets.
- Rotate secrets regularly and avoid reusing them across environments.
- Ensure logs never contain raw secret values.

---

[Voltar ao README](../README.md)
