import { describe, expect, it } from "vitest"

import { clientEnvSchema, parseEnvironment } from "@/lib/env"

describe("environment validation", () => {
  it("allows the template to start without optional environment variables", () => {
    expect(parseEnvironment()).toEqual({})
  })

  it("rejects malformed configured public values with a useful message", () => {
    expect(() =>
      parseEnvironment({ client: { NEXT_PUBLIC_APP_NAME: "" } }),
    ).toThrow(
      "Invalid public environment: NEXT_PUBLIC_APP_NAME cannot be empty",
    )
  })

  it("keeps server-only values out of client-facing configuration", () => {
    const clientConfig = clientEnvSchema.safeParse({
      AI_PROVIDER_API_KEY: "not-for-browser",
    })

    expect(clientConfig.success).toBe(false)
    expect(
      parseEnvironment({ client: { NEXT_PUBLIC_APP_NAME: "Starter" } }),
    ).toEqual({
      NEXT_PUBLIC_APP_NAME: "Starter",
    })
  })
})
