import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**"],
    // Set before any test module (including its top-level code) runs — required
    // because lib/auth.ts intentionally throws at import time if JWT_SECRET is
    // missing/too short (see lib/auth.ts comment).
    env: {
      JWT_SECRET: "test-only-secret-key-at-least-16-chars-long",
    },
  },
});
