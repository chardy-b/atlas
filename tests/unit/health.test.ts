import { describe, expect, it } from "vitest"

import { GET } from "@/app/api/health/route"

describe("GET /api/health", () => {
  it("returns a healthy, minimal JSON response", async () => {
    const response = GET()
    const payload = await response.json()

    expect(response.status).toBe(200)
    expect(response.headers.get("Cache-Control")).toContain("no-store")
    expect(payload).toEqual({ status: "ok" })
    expect(Object.keys(payload)).toEqual(["status"])
  })
})
