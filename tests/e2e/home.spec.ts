import { expect, test } from "@playwright/test"

test("homepage provides an accessible theme control and a stable visual baseline", async ({
  page,
}) => {
  await page.goto("/")

  await expect(
    page.getByRole("heading", { name: /practical starting point/i }),
  ).toBeVisible()
  await expect(
    page.getByRole("button", { name: "Change color theme" }),
  ).toBeVisible()

  await page.getByRole("button", { name: "Change color theme" }).click()
  await page.getByRole("menuitemradio", { name: "Light" }).click()
  await expect(page.locator("html")).not.toHaveClass(/dark/)
  await page.keyboard.press("Escape")
  await expect(page.getByRole("menu")).not.toBeVisible()

  await page.emulateMedia({ colorScheme: "light" })
  await expect(page).toHaveScreenshot("home.png", {
    animations: "disabled",
    fullPage: true,
  })
})

test("health endpoint is healthy and exposes only its status", async ({
  request,
}) => {
  const response = await request.get("/api/health")

  expect(response.status()).toBe(200)
  await expect(response).toBeOK()
  await expect(response.json()).resolves.toEqual({ status: "ok" })
})
