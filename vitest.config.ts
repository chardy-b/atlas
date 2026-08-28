import path from "node:path"
import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      "@": path.join(rootDir, "src"),
      "server-only": path.join(rootDir, "tests/unit/server-only.ts"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    restoreMocks: true,
    clearMocks: true,
    exclude: [
      "node_modules",
      ".next",
      "tests/e2e",
      "test-results",
      "playwright-report",
    ],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      reportsDirectory: "coverage",
      include: [
        "src/lib/env.ts",
        "src/lib/errors.ts",
        "src/components/empty-state.tsx",
        "src/components/error-state.tsx",
        "src/components/theme-toggle.tsx",
        "src/app/api/health/route.ts",
      ],
      exclude: [
        "src/components/ui/**",
        "**/*.d.ts",
        "**/*.{test,spec}.{ts,tsx}",
      ],
      thresholds: {
        lines: 70,
        statements: 70,
        functions: 70,
        branches: 60,
      },
    },
  },
})
