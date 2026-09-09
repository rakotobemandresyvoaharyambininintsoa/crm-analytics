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
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules/**"],
    setupFiles: ["./vitest.setup.ts"],
    env: {
      JWT_SECRET: "test-only-secret-key-at-least-16-chars-long",
    },
  },
});
