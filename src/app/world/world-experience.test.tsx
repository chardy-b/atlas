import { act, fireEvent, render, screen, waitFor } from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { WorldExperience } from "./world-experience"

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  dispose: vi.fn(),
  pause: vi.fn(),
  reset: vi.fn(),
  zoom: vi.fn(),
}))
vi.mock("./world-renderer", () => ({ createWorld: mocks.create }))
let mediaChange: () => void
let media: {
  matches: boolean
  addEventListener: ReturnType<typeof vi.fn>
  removeEventListener: ReturnType<typeof vi.fn>
}
beforeEach(() => {
  vi.clearAllMocks()
  media = {
    matches: false,
    addEventListener: vi.fn((_event, fn) => {
      mediaChange = fn
    }),
    removeEventListener: vi.fn(),
  }
  vi.stubGlobal("matchMedia", () => media)
  mocks.create.mockReturnValue({
    dispose: mocks.dispose,
    pause: mocks.pause,
    reset: mocks.reset,
    zoom: mocks.zoom,
  })
})
afterEach(() => vi.unstubAllGlobals())
it("loads lazily, exposes controls and disposes on unmount", async () => {
  const { unmount } = render(<WorldExperience />)
  expect(screen.getByText("Finding the forest…")).toBeVisible()
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Reset view" })).toBeEnabled(),
  )
  fireEvent.click(screen.getByRole("button", { name: "Reset view" }))
  expect(mocks.reset).toHaveBeenCalledOnce()
  fireEvent.click(screen.getByRole("button", { name: "Zoom in" }))
  expect(mocks.zoom).toHaveBeenCalledWith(1)
  fireEvent.click(screen.getByRole("button", { name: "Pause animation" }))
  expect(mocks.pause).toHaveBeenCalledWith(true)
  expect(
    screen.getByRole("button", { name: "Resume animation" }),
  ).toHaveAttribute("aria-pressed", "true")
  unmount()
  expect(mocks.dispose).toHaveBeenCalledOnce()
  expect(media.removeEventListener).toHaveBeenCalledWith("change", mediaChange)
})
it("honors reduced motion at startup and live preference changes", async () => {
  media.matches = true
  render(<WorldExperience />)
  await waitFor(() =>
    expect(
      screen.getByRole("button", { name: "Resume animation" }),
    ).toBeEnabled(),
  )
  expect(mocks.create).toHaveBeenCalledWith(
    expect.any(HTMLCanvasElement),
    true,
    expect.any(Function),
  )
  media.matches = false
  act(() => mediaChange())
  expect(mocks.pause).toHaveBeenCalledWith(false)
})
it("provides a retry with a fresh canvas after context loss", async () => {
  const { container } = render(<WorldExperience />)
  await waitFor(() => expect(mocks.create).toHaveBeenCalledOnce())
  const oldCanvas = container.querySelector("canvas")
  act(() => mocks.create.mock.calls[0][2]())
  expect(screen.getByRole("button", { name: "Reset view" })).toBeDisabled()
  fireEvent.click(screen.getByRole("button", { name: "Try again" }))
  await waitFor(() => expect(mocks.create).toHaveBeenCalledTimes(2))
  expect(container.querySelector("canvas")).not.toBe(oldCanvas)
  expect(mocks.dispose).toHaveBeenCalledOnce()
})
it("keeps a readable fallback when WebGL construction throws", async () => {
  mocks.create.mockImplementationOnce(() => {
    throw new Error("WebGL unavailable")
  })
  render(<WorldExperience />)
  expect(
    await screen.findByText("A quiet moment in the clearing"),
  ).toBeVisible()
  expect(screen.getByRole("button", { name: "Try again" })).toBeEnabled()
})
it("does not create a renderer after unmount during import", async () => {
  const { unmount } = render(<WorldExperience />)
  unmount()
  await act(async () => {
    await Promise.resolve()
  })
  expect(mocks.create).not.toHaveBeenCalled()
})
