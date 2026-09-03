import { render, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { AmbientScene } from "@/components/ambient-scene"

const mocks = vi.hoisted(() => ({
  rendererDispose: vi.fn(),
  geometryDispose: vi.fn(),
  materialDispose: vi.fn(),
  render: vi.fn(),
  setSize: vi.fn(),
  rendererCreated: vi.fn(),
}))

vi.mock("three", () => ({
  Scene: class {
    add = vi.fn()
  },
  PerspectiveCamera: class {
    position = { z: 0 }
    aspect = 1
    updateProjectionMatrix = vi.fn()
  },
  IcosahedronGeometry: class {
    dispose = mocks.geometryDispose
  },
  MeshBasicMaterial: class {
    dispose = mocks.materialDispose
  },
  Mesh: class {
    rotation = { x: 0, y: 0 }
  },
  WebGLRenderer: class {
    constructor() {
      mocks.rendererCreated()
    }
    dispose = mocks.rendererDispose
    render = mocks.render
    setPixelRatio = vi.fn()
    setSize = mocks.setSize
  },
}))

function setReducedMotion(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }),
  )
}

describe("AmbientScene", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
      () => ({}) as never,
    )
    vi.stubGlobal("requestAnimationFrame", vi.fn().mockReturnValue(42))
    vi.stubGlobal("cancelAnimationFrame", vi.fn())
  })

  it("does not initialize WebGL when reduced motion is requested", async () => {
    setReducedMotion(true)
    render(<AmbientScene />)
    await Promise.resolve()
    expect(mocks.rendererCreated).not.toHaveBeenCalled()
  })

  it("initializes, resizes, renders and disposes the Three.js scene", async () => {
    setReducedMotion(false)
    const { unmount } = render(<AmbientScene />)

    await waitFor(() => expect(mocks.rendererCreated).toHaveBeenCalledOnce())
    expect(mocks.setSize).toHaveBeenCalled()
    expect(mocks.render).toHaveBeenCalled()

    unmount()
    expect(mocks.geometryDispose).toHaveBeenCalled()
    expect(mocks.materialDispose).toHaveBeenCalled()
    expect(mocks.rendererDispose).toHaveBeenCalled()
    expect(cancelAnimationFrame).toHaveBeenCalled()
  })
})
