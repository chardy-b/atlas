import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createFrameLoop, viewSettings } from "./world-runtime"

describe("woodland frame scheduling", () => {
  let pending: Map<number, FrameRequestCallback>
  let id: number
  beforeEach(() => {
    pending = new Map()
    id = 0
    vi.stubGlobal(
      "requestAnimationFrame",
      vi.fn((fn: FrameRequestCallback) => {
        pending.set(++id, fn)
        return id
      }),
    )
    vi.stubGlobal(
      "cancelAnimationFrame",
      vi.fn((key: number) => pending.delete(key)),
    )
  })
  afterEach(() => vi.unstubAllGlobals())
  const frame = (time: number) => {
    const work = [...pending.values()]
    pending.clear()
    work.forEach((fn) => fn(time))
  }
  it("cancels hidden-tab work and resumes without a time jump", () => {
    const draw = vi.fn(),
      loop = createFrameLoop(draw)
    loop.invalidate()
    frame(100)
    frame(116)
    expect(draw).toHaveBeenLastCalledWith(0.016)
    loop.visibility(true)
    expect(pending.size).toBe(0)
    loop.invalidate()
    expect(pending.size).toBe(0)
    loop.visibility(false)
    frame(10000)
    expect(draw).toHaveBeenLastCalledWith(0.016)
    loop.dispose()
    expect(pending.size).toBe(0)
  })
  it("paused scenes render once and redraw on input without advancing animation", () => {
    const draw = vi.fn(),
      loop = createFrameLoop(draw)
    loop.pause(true)
    frame(100)
    expect(pending.size).toBe(0)
    loop.invalidate()
    loop.invalidate()
    expect(pending.size).toBe(1)
    frame(1000)
    expect(draw).toHaveBeenLastCalledWith(0)
    loop.pause(false)
    frame(1100)
    expect(pending.size).toBe(1)
    loop.dispose()
    loop.invalidate()
    expect(pending.size).toBe(0)
  })
  it("caps quality and authors a more distant portrait framing", () => {
    expect(viewSettings(390, 495, 3)).toEqual({
      portrait: true,
      mobile: true,
      dpr: 1.25,
      distance: 19.3,
    })
    expect(viewSettings(1400, 740, 2)).toEqual({
      portrait: false,
      mobile: false,
      dpr: 1.75,
      distance: 15.2,
    })
  })
})
