import { expect, test } from "@playwright/test"
import { createHash } from "node:crypto"
import { mkdir } from "node:fs/promises"

const evidenceDirectory = process.env.EVIDENCE_DIR ?? "test-results/evidence"

function screenshotHash(screenshot: Buffer) {
  return createHash("sha256").update(screenshot).digest("hex")
}

function screenshotName(projectName: string) {
  return projectName === "mobile-chromium"
    ? "world-mobile.png"
    : "world-desktop.png"
}

test("World renders and its scene controls remain interactive", async ({
  page,
}, testInfo) => {
  const pageErrors: Error[] = []
  page.on("pageerror", (error) => pageErrors.push(error))

  await page.goto("/world")
  const canvas = page.locator('canvas[data-status="ready"]')
  await expect(canvas).toBeVisible({ timeout: 30_000 })
  await expect(page.getByText("Finding the forest…")).toHaveCount(0)

  const pause = page.getByRole("button", { name: "Pause animation" })
  await expect(pause).toBeEnabled()
  await pause.click()
  const resume = page.getByRole("button", { name: "Resume animation" })
  await expect(resume).toHaveAttribute("aria-pressed", "true")

  const initialCanvasHash = screenshotHash(await canvas.screenshot())

  const zoomIn = page.getByRole("button", { name: "Zoom in" })
  await expect(zoomIn).toBeEnabled()
  await zoomIn.click()
  await expect(canvas).toHaveAttribute("data-status", "ready")
  await expect
    .poll(async () => screenshotHash(await canvas.screenshot()))
    .not.toBe(initialCanvasHash)

  for (const control of ["Zoom out", "Reset view"]) {
    const button = page.getByRole("button", { name: control })
    await expect(button).toBeEnabled()
    await button.click()
    await expect(canvas).toHaveAttribute("data-status", "ready")
  }

  await resume.click()
  await expect(
    page.getByRole("button", { name: "Pause animation" }),
  ).toHaveAttribute("aria-pressed", "false")
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    )
    .toBe(true)
  expect(pageErrors).toEqual([])

  await mkdir(evidenceDirectory, { recursive: true })
  await page.screenshot({
    path: `${evidenceDirectory}/${screenshotName(testInfo.project.name)}`,
    fullPage: true,
  })
})
