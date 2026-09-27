import axios, { isAxiosError } from "axios"

import type { StudentListParams, StudentPage } from "@/types/student"

interface ApiProblemDetails {
  detail?: string
  title?: string
}

function getStudentListErrorMessage(status?: number) {
  if (status === 401) {
    return "Sua sessão expirou. Entre novamente para continuar."
  }

  if (status === 403) {
    return "Seu perfil não tem acesso à lista de alunos."
  }

  if (status === 404) {
    return "A lista de alunos não está disponível no momento."
  }

  return "Não foi possível carregar a lista agora. Tente novamente em alguns instantes."
}

export async function listStudents(
  params: StudentListParams,
  signal?: AbortSignal,
) {
  try {
    const response = await axios.get<StudentPage>("/api/students", {
      params,
      signal,
    })
    return response.data
  } catch (error) {
    if (isAxiosError<ApiProblemDetails>(error)) {
      throw new Error(getStudentListErrorMessage(error.response?.status))
    }

    throw error
  }
}
