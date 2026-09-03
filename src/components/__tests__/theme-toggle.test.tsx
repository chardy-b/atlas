import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

const setTheme = vi.fn()

vi.mock("next-themes", () => ({
  useTheme: () => ({ theme: "system", setTheme }),
}))

import { ThemeToggle } from "@/components/theme-toggle"

describe("ThemeToggle", () => {
  beforeEach(() => {
    setTheme.mockReset()
  })

  it("renders an accessible control and lets a user select a theme", async () => {
    const user = userEvent.setup()

    render(<ThemeToggle />)

    const trigger = screen.getByRole("button", { name: "Change color theme" })
    expect(trigger).toBeInTheDocument()

    await user.click(trigger)
    await user.click(await screen.findByRole("menuitemradio", { name: "Dark" }))

    expect(setTheme.mock.calls[0]?.[0]).toBe("dark")
  })
})
