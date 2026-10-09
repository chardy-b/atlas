import { expect, test } from "@playwright/test"
import { mkdir } from "node:fs/promises"

const evidenceDirectory = process.env.EVIDENCE_DIR ?? "test-results/evidence"

function screenshotName(projectName: string) {
  return projectName === "mobile-chromium"
    ? "home-mobile.png"
    : "home-desktop.png"
}

async function expectNoHorizontalOverflow(
  page: import("@playwright/test").Page,
) {
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    )
    .toBe(true)
}

test("homepage presents the current projects and a healthy service", async ({
  page,
  request,
}, testInfo) => {
  const pageErrors: Error[] = []
  page.on("pageerror", (error) => pageErrors.push(error))

  await page.goto("/")
  await expect(
    page.getByRole("heading", { name: "Two places to step inside." }),
  ).toBeVisible()
  await expect(page.getByText("Wall of moving ideas")).toHaveCount(0)
  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(page.getByRole("link", { name: /Mirror/i })).toHaveAttribute(
    "href",
    "/mirror",
  )
  await expect(page.getByRole("link", { name: /World/i })).toHaveAttribute(
    "href",
    "/world",
  )

  const health = await request.get("/api/health")
  expect(health.status()).toBe(200)
  await expect(health.json()).resolves.toEqual({ status: "ok" })
  await expectNoHorizontalOverflow(page)
  expect(pageErrors).toEqual([])

  await mkdir(evidenceDirectory, { recursive: true })
  await page.screenshot({
    path: `${evidenceDirectory}/${screenshotName(testInfo.project.name)}`,
    fullPage: true,
  })
})
