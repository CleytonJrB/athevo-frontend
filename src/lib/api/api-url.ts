import "server-only"

export function getApiUrl() {
  const apiUrl =
    process.env.ATHEVO_API_URL ??
    (process.env.NODE_ENV === "development" ? "http://localhost:5115" : undefined)

  if (!apiUrl) {
    throw new Error("ATHEVO_API_URL is not configured")
  }

  return apiUrl.replace(/\/$/, "")
}
