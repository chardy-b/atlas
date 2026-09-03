import { describe, expect, it } from "vitest"

import {
  getErrorDiagnostic,
  getUserFacingErrorMessage,
  toError,
} from "@/lib/errors"

describe("error utilities", () => {
  it("keeps an Error instance intact for diagnostics", () => {
    const original = new Error("request failed")

    expect(toError(original)).toBe(original)
    expect(getErrorDiagnostic(original)).toEqual({
      name: "Error",
      message: "request failed",
    })
  })

  it("converts a caught string into an Error", () => {
    expect(toError("request failed")).toEqual(new Error("request failed"))
  })

  it("does not expose arbitrary provider data to users", () => {
    const providerError = {
      token: "provider-secret",
      detail: "internal endpoint",
    }

    expect(toError(providerError)).toBeInstanceOf(Error)
    expect(getUserFacingErrorMessage(providerError)).toBe(
      "Something went wrong. Please try again.",
    )
    expect(getUserFacingErrorMessage(providerError)).not.toContain(
      "provider-secret",
    )
    expect(getUserFacingErrorMessage(providerError)).not.toContain(
      "internal endpoint",
    )
  })
})
