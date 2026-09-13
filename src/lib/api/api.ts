import "server-only"

import axios, { isAxiosError, type AxiosRequestConfig } from "axios"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth/config"
import { ApiError, type ApiProblemDetails } from "@/lib/api/api-error"
import { getApiUrl } from "@/lib/api/api-url"

type ApiRequestConfig = Omit<
  AxiosRequestConfig,
  "baseURL" | "data" | "method" | "params" | "url"
>

export type ApiQueryParams = Record<
  string,
  | boolean
  | number
  | string
  | null
  | undefined
  | readonly (boolean | number | string)[]
>

class ApiClient {
  get<TResponse>(
    url: string,
    params?: ApiQueryParams,
    config?: ApiRequestConfig
  ) {
    return this.request<TResponse>({ ...config, method: "GET", params, url })
  }

  post<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: ApiRequestConfig
  ) {
    return this.request<TResponse>({ ...config, data, method: "POST", url })
  }

  put<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: ApiRequestConfig
  ) {
    return this.request<TResponse>({ ...config, data, method: "PUT", url })
  }

  patch<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: ApiRequestConfig
  ) {
    return this.request<TResponse>({ ...config, data, method: "PATCH", url })
  }

  delete<TResponse>(url: string, config?: ApiRequestConfig) {
    return this.request<TResponse>({ ...config, method: "DELETE", url })
  }

  private async request<TResponse>(config: AxiosRequestConfig) {
    this.ensureRelativeApiUrl(config.url)

    const session = await getServerSession(authOptions)

    if (
      session?.error === "RefreshAccessTokenError" ||
      !session?.accessToken
    ) {
      throw new ApiError(401, "Sessao expirada")
    }

    try {
      const response = await axios.request<TResponse>({
        ...config,
        baseURL: getApiUrl(),
        headers: {
          Accept: "application/json",
          ...config.headers,
          Authorization: `Bearer ${session.accessToken}`,
        },
        maxRedirects: 0,
        timeout: config.timeout ?? 15_000,
        withCredentials: false,
      })

      return response.data
    } catch (error) {
      throw this.toApiError(error)
    }
  }

  private ensureRelativeApiUrl(url?: string) {
    if (!url?.startsWith("/api/") || url.startsWith("//")) {
      throw new Error("Api requests require a relative /api/ URL")
    }
  }

  private toApiError(error: unknown) {
    if (error instanceof ApiError) return error

    if (!isAxiosError<ApiProblemDetails>(error)) {
      return new ApiError(500, "Nao foi possivel concluir a solicitacao")
    }

    const problem = error.response?.data
    const status = error.response?.status ?? 503

    return new ApiError(
      status,
      problem?.detail ?? problem?.title ?? this.defaultMessage(status),
      problem?.traceId
    )
  }

  private defaultMessage(status: number) {
    if (status === 401) return "Sessao expirada"
    if (status === 403) return "Acesso negado"
    if (status === 404) return "Recurso nao encontrado"
    if (status === 429) return "Aguarde antes de tentar novamente"

    return "Nao foi possivel concluir a solicitacao"
  }
}

export const Api = new ApiClient()
