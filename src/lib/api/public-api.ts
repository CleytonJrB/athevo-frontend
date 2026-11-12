import "server-only"

import axios, { isAxiosError } from "axios"

import { ApiError, type ApiProblemDetails } from "@/lib/api/api-error"
import { getApiUrl } from "@/lib/api/api-url"

export async function publicApiPost<TResponse, TBody>(url: string, data: TBody) {
  if (!url.startsWith("/api/") || url.startsWith("//")) {
    throw new Error("Api requests require a relative /api/ URL")
  }

  try {
    const response = await axios.post<TResponse>(url, data, {
      baseURL: getApiUrl(),
      headers: { Accept: "application/json" },
      maxRedirects: 0,
      timeout: 15_000,
      withCredentials: false,
    })
    return response.data
  } catch (error) {
    if (!isAxiosError<ApiProblemDetails>(error)) {
      throw new ApiError(500, "Nao foi possivel concluir a solicitacao")
    }

    const problem = error.response?.data
    throw new ApiError(
      error.response?.status ?? 503,
      problem?.detail ?? problem?.title ?? "Nao foi possivel concluir a solicitacao",
      problem?.traceId,
    )
  }
}
