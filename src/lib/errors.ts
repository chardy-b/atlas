const GENERIC_USER_MESSAGE = "Something went wrong. Please try again."

export function toError(error: unknown): Error {
  if (error instanceof Error) return error

  if (typeof error === "string") return new Error(error)

  try {
    return new Error(JSON.stringify(error))
  } catch {
    return new Error("Unknown error")
  }
}

export function getUserFacingErrorMessage(error: unknown): string {
  void error
  return GENERIC_USER_MESSAGE
}

export function getErrorDiagnostic(error: unknown): {
  name: string
  message: string
} {
  const normalized = toError(error)
  return { name: normalized.name, message: normalized.message }
}
