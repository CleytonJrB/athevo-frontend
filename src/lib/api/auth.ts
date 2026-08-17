import type { RegisterFormData } from "@/lib/validations/auth"

export interface AuthResponse {
  user: { id: string; name: string; email: string }
}

export async function register(
  data: RegisterFormData
): Promise<AuthResponse> {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  const result = (await response.json()) as AuthResponse & { error?: string }

  if (!response.ok) {
    throw new Error(result.error ?? "Não foi possível criar a conta")
  }

  return result
}
