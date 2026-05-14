import { defineConfig } from "vitest/config";

/** Testes de integração (controller + service + persistência mockada). `npm run test:integration` */
export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    include: ["test/IntegrationTests/**/*.integration.test.ts"],
    pool: "forks",
  },
});
