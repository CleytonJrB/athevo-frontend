import "server-only"

import type { RegisterFormData } from "@/lib/validations/auth"

export interface BackendAuthUser {
  id: string
  firstName: string
  lastName: string
  name: string
  email: string
  tenantId: string
  tenantName: string
  role: string
}

export interface BackendAuthResponse {
  accessToken: string
  expiresAt: string
  user: BackendAuthUser
}

interface ProblemDetails {
  detail?: string
  title?: string
}

export class AthevoApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message)
  }
}

function getApiUrl() {
  const apiUrl =
    process.env.ATHEVO_API_URL ??
    (process.env.NODE_ENV === "development" ? "http://localhost:5115" : undefined)

  if (!apiUrl) {
    throw new Error("ATHEVO_API_URL is not configured")
  }

  return apiUrl.replace(/\/$/, "")
}

async function authenticate(
  path: "login" | "register",
  body: unknown
): Promise<BackendAuthResponse> {
  const response = await fetch(`${getApiUrl()}/api/auth/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  })
  const result = (await response.json().catch(() => ({}))) as
    | BackendAuthResponse
    | ProblemDetails

  if (!response.ok) {
    const problem = result as ProblemDetails
    throw new AthevoApiError(
      response.status,
      problem.detail ?? problem.title ?? "Nao foi possivel autenticar"
    )
  }

  return result as BackendAuthResponse
}

export function loginWithApi(email: string, password: string) {
  return authenticate("login", { email, password })
}

export function registerWithApi(data: RegisterFormData) {
  return authenticate("register", data)
}
