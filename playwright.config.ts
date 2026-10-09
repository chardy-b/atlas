import { defineConfig, devices } from "@playwright/test"

const externalBaseURL = process.env.E2E_BASE_URL
const baseURL = externalBaseURL ?? "http://127.0.0.1:3000"
const useDevServer = process.env.E2E_USE_DEV === "1"
const reuseBuild = process.env.E2E_REUSE_BUILD === "1"

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL,
    launchOptions: {
      args: [
        "--use-gl=angle",
        "--use-angle=swiftshader",
        "--enable-unsafe-swiftshader",
      ],
    },
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], colorScheme: "light" },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 5"], colorScheme: "light" },
    },
  ],
  webServer: externalBaseURL
    ? undefined
    : {
        command: useDevServer
          ? "corepack pnpm dev"
          : reuseBuild
            ? "corepack pnpm start"
            : "corepack pnpm build && corepack pnpm start",
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
      },
})
