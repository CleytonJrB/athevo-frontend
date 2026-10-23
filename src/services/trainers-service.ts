import axios, { isAxiosError } from "axios"

import type { TrainerListParams, TrainerPage } from "@/types/trainer"

interface ApiProblemDetails {
  detail?: string
  title?: string
}

function getTrainerListErrorMessage(status?: number) {
  if (status === 401) {
    return "Sua sessão expirou. Entre novamente para continuar."
  }

  if (status === 403) {
    return "Seu perfil não tem acesso à lista de professores."
  }

  if (status === 404) {
    return "A lista de professores não está disponível no momento."
  }

  return "Não foi possível carregar a equipe agora. Tente novamente em alguns instantes."
}

export async function listTrainers(
  params: TrainerListParams,
  signal?: AbortSignal,
) {
  try {
    const response = await axios.get<TrainerPage>("/api/trainers", {
      params,
      signal,
    })
    return response.data
  } catch (error) {
    if (isAxiosError<ApiProblemDetails>(error)) {
      throw new Error(getTrainerListErrorMessage(error.response?.status))
    }

    throw error
  }
}
