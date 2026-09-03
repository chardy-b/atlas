import { expect, test } from "@playwright/test"

import { projects } from "../../src/data/projects"

const featuredHosts = new Set(
  projects.map((project) => new URL(project.source).hostname),
)

test.describe("Three.js mood board", () => {
  test("desktop filters, opens and closes source dialog without featured-site requests", async ({
    page,
  }) => {
    const requests: string[] = []
    page.on("request", (request) => requests.push(request.url()))
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto("/")
    await expect(
      page.getByRole("heading", { name: /wall of moving ideas/i }),
    ).toBeVisible()
    await expect(page.getByText("12 shown")).toBeVisible()
    await page.getByRole("button", { name: "Shaders" }).click()
    await expect(page.getByText(/shown$/)).toHaveText("5 shown")
    await page.getByRole("button", { name: /No Mercy Michel/i }).click()
    await expect(page.getByRole("dialog")).toBeVisible()
    const link = page.getByRole("link", { name: /original source/i })
    await expect(link).toHaveAttribute("target", "_blank")
    await expect(link).toHaveAttribute("rel", /noopener/)
    await page.keyboard.press("Escape")
    await expect(page.getByRole("dialog")).not.toBeVisible()
    await page.getByRole("button", { name: "All" }).click()
    await expect(page.getByText("12 shown")).toBeVisible()
    const featuredRequests = requests.filter((url) =>
      featuredHosts.has(new URL(url).hostname),
    )
    expect(featuredRequests).toEqual([])
    await expect(page).toHaveScreenshot("home.png", {
      fullPage: true,
      animations: "disabled",
      maxDiffPixels: 2_500,
    })
  })

  test("mobile renders the board and health is healthy", async ({
    page,
    request,
  }) => {
    await page.goto("/")
    await expect(page.locator("#board")).toBeVisible()
    await expect(page.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    )
    const response = await request.get("/api/health")
    expect(response.status()).toBe(200)
    await expect(response.json()).resolves.toEqual({ status: "ok" })
    await page.screenshot({
      path: "test-results/mood-board-mobile.png",
      fullPage: true,
    })
  })
})
