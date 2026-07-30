import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Downgraded from "error" (eslint-config-next's default) to "warn".
      //
      // This codebase had zero CI before this pass, so ~100 pre-existing `any`
      // usages accumulated across the whole app with nothing ever catching them.
      // Flipping this straight to "error" would fail the build on debt that
      // predates this change, for every single PR, until someone does a full,
      // carefully-verified pass replacing every occurrence with the correct
      // Prisma/DTO type — a real but separate piece of work (tracked in
      // AUDIT.md Part 3). "warn" keeps every occurrence visible in CI output
      // (nothing is hidden) without blocking merges on it. New code should
      // still avoid `any` — this is a temporary allowance for existing code,
      // not a statement that `any` is fine going forward.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
