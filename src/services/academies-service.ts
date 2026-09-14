import axios, { isAxiosError } from "axios"

import type { AcademyListItem } from "@/types/academy"

export type { AcademyListItem } from "@/types/academy"

interface ApiProblemDetails {
  detail?: string
  title?: string
}

export async function listAcademies(signal?: AbortSignal) {
  try {
    const response = await axios.get<AcademyListItem[]>("/api/tenants", {
      signal,
    })
    return response.data
  } catch (error) {
    if (isAxiosError<ApiProblemDetails>(error)) {
      throw new Error(
        error.response?.data.detail ??
          error.response?.data.title ??
          "Nao foi possivel carregar as academias"
      )
    }

    throw error
  }
}
