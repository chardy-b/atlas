import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { EmptyState } from "@/components/empty-state"
import { ErrorState } from "@/components/error-state"

describe("EmptyState", () => {
  it("renders its content and an optional keyboard-accessible action", async () => {
    const user = userEvent.setup()
    const onCreate = vi.fn()

    render(
      <EmptyState
        title="No reports yet"
        description="Create a report to begin."
        action={<button onClick={onCreate}>Create report</button>}
      />,
    )

    expect(
      screen.getByRole("heading", { name: "No reports yet" }),
    ).toBeInTheDocument()
    expect(screen.getByText("Create a report to begin.")).toBeInTheDocument()

    await user.tab()
    expect(screen.getByRole("button", { name: "Create report" })).toHaveFocus()
    await user.keyboard("{Enter}")
    expect(onCreate).toHaveBeenCalledOnce()
  })
})

describe("ErrorState", () => {
  it("renders a safe message and invokes its optional retry action", async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(
      <ErrorState
        message="We could not load this content. Please try again."
        action={<button onClick={onRetry}>Try again</button>}
      />,
    )

    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not load this content. Please try again.",
    )
    expect(screen.queryByText("provider-secret")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Try again" }))
    expect(onRetry).toHaveBeenCalledOnce()
  })
})
