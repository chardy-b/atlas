import "server-only"

import { z } from "zod"

/** Server-only values. Do not import this module from Client Components. */
export const serverEnvSchema = z.object({
  AI_PROVIDER_API_KEY: z
    .string()
    .trim()
    .min(1, "AI_PROVIDER_API_KEY cannot be empty")
    .optional(),
})

/** Values with NEXT_PUBLIC_ are intentionally safe to expose to every visitor. */
export const clientEnvSchema = z
  .object({
    NEXT_PUBLIC_APP_NAME: z
      .string()
      .trim()
      .min(1, "NEXT_PUBLIC_APP_NAME cannot be empty")
      .optional(),
  })
  .strict()

export function parseEnvironment(
  input: {
    server?: Record<string, string | undefined>
    client?: Record<string, string | undefined>
  } = {},
) {
  const parsedServerEnv = serverEnvSchema.safeParse({
    AI_PROVIDER_API_KEY: input.server?.AI_PROVIDER_API_KEY,
  })

  if (!parsedServerEnv.success) {
    throw new Error(
      `Invalid server environment: ${parsedServerEnv.error.issues.map((issue) => issue.message).join(", ")}`,
    )
  }

  const parsedClientEnv = clientEnvSchema.safeParse({
    NEXT_PUBLIC_APP_NAME: input.client?.NEXT_PUBLIC_APP_NAME,
  })

  if (!parsedClientEnv.success) {
    throw new Error(
      `Invalid public environment: ${parsedClientEnv.error.issues.map((issue) => issue.message).join(", ")}`,
    )
  }

  return {
    ...parsedServerEnv.data,
    ...parsedClientEnv.data,
  }
}

export const env = parseEnvironment({
  server: process.env,
  client: process.env,
})
