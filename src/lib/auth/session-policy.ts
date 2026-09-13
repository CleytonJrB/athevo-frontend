import "server-only"

function readSeconds(
  variable: string,
  fallback: number,
  minimum: number,
  maximum: number
) {
  const configured = process.env[variable]
  if (!configured) return fallback

  const seconds = Number(configured)
  if (!Number.isInteger(seconds) || seconds < minimum || seconds > maximum) {
    throw new Error(
      `${variable} must be an integer between ${minimum} and ${maximum} seconds`
    )
  }

  return seconds
}

export const sessionPolicy = {
  maxAgeSeconds: readSeconds(
    "ATHEVO_AUTH_SESSION_MAX_AGE_SECONDS",
    30 * 24 * 60 * 60,
    24 * 60 * 60,
    90 * 24 * 60 * 60
  ),
  refreshBeforeExpirationMs:
    readSeconds(
      "ATHEVO_AUTH_REFRESH_EARLY_SECONDS",
      6 * 60,
      30,
      60 * 60
    ) * 1_000,
  refetchIntervalSeconds: readSeconds(
    "ATHEVO_AUTH_SESSION_REFETCH_SECONDS",
    5 * 60,
    30,
    15 * 60
  ),
} as const
