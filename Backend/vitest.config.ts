import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: false,
    environment: "node",
    include: ["test/**/*.test.ts"],
    pool: "forks",
    coverage: {
        reporter: ['lcov', 'text'],
    },
  },
});
