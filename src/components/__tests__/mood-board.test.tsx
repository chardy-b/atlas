import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { MoodBoard } from "@/components/mood-board"

describe("MoodBoard", () => {
  it("filters projects and reports the visible count", async () => {
    const user = userEvent.setup()
    render(<MoodBoard />)

    expect(screen.getByText("12 shown")).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Product" }))

    expect(screen.getByText("1 shown")).toBeVisible()
    expect(
      screen.getByRole("button", { name: /No Mercy Michel/i }),
    ).toBeVisible()
    expect(screen.queryByRole("button", { name: /PolyTrack/i })).toBeNull()
  })

  it("opens an accessible detail dialog with a safe source link", async () => {
    const user = userEvent.setup()
    render(<MoodBoard />)

    await user.click(screen.getByRole("button", { name: /Bruno Simon/i }))

    const dialog = screen.getByRole("dialog")
    expect(dialog).toBeVisible()
    expect(screen.getByRole("heading", { name: "Bruno Simon" })).toBeVisible()
    const source = screen.getByRole("link", { name: /original source/i })
    expect(source).toHaveAttribute("href", "https://bruno-simon.com/")
    expect(source).toHaveAttribute("target", "_blank")
    expect(source).toHaveAttribute("rel", expect.stringContaining("noopener"))

    await user.keyboard("{Escape}")
    expect(screen.queryByRole("dialog")).toBeNull()
  })
})
