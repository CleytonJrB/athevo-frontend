import axios, { isAxiosError } from "axios"

import type {
  ExerciseDetails,
  ExerciseListParams,
  ExercisePage,
} from "@/types/exercise"

interface ApiProblemDetails {
  detail?: string
  title?: string
}

export class ExerciseServiceError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message)
    this.name = "ExerciseServiceError"
  }
}

function getExerciseErrorMessage(status?: number) {
  if (status === 401) {
    return "Sua sessão expirou. Entre novamente para continuar."
  }

  if (status === 403) {
    return "A biblioteca de exercícios está indisponível. Peça ao proprietário da academia para verificar o plano da Athevo."
  }

  if (status === 404) {
    return "O exercício solicitado não foi encontrado."
  }

  if (status === 429) {
    return "Muitas consultas foram realizadas. Aguarde antes de tentar novamente."
  }

  return "Não foi possível carregar os exercícios agora. Tente novamente em alguns instantes."
}

export async function listExercises(
  params: ExerciseListParams,
  signal?: AbortSignal,
) {
  try {
    const response = await axios.get<ExercisePage>("/api/exercises", {
      params,
      signal,
    })
    return response.data
  } catch (error) {
    if (isAxiosError<ApiProblemDetails>(error)) {
      throw new ExerciseServiceError(
        getExerciseErrorMessage(error.response?.status),
        error.response?.status,
      )
    }

    throw error
  }
}

export async function getExerciseDetails(id: string, signal?: AbortSignal) {
  try {
    const response = await axios.get<ExerciseDetails>(`/api/exercises/${id}`, {
      params: { languageCode: "pt-BR" },
      signal,
    })
    return response.data
  } catch (error) {
    if (isAxiosError<ApiProblemDetails>(error)) {
      throw new ExerciseServiceError(
        getExerciseErrorMessage(error.response?.status),
        error.response?.status,
      )
    }

    throw error
  }
}
