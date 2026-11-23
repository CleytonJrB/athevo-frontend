import axios, { isAxiosError } from "axios"

import type {
  AcceptStudentInvitationInput,
  CreateStudentInvitationInput,
  StudentInvitationLookupResult,
  StudentInvitationRequestResult,
  StudentDetails,
  StudentListParams,
  StudentPage,
  StudentPhotoResult,
  StudentPhotoUploadAuthorization,
} from "@/types/student"

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

export async function getStudentDetails(
  tenantUserId: string,
  signal?: AbortSignal,
) {
  try {
    const response = await axios.get<StudentDetails>(
      `/api/students/${tenantUserId}`,
      { signal },
    )
    return response.data
  } catch (error) {
    if (isAxiosError<ApiProblemDetails>(error)) {
      throw new Error(getStudentListErrorMessage(error.response?.status))
    }

    throw error
  }
}

export async function getStudentPhoto(
  tenantUserId: string,
  signal?: AbortSignal,
) {
  const response = await axios.get<StudentPhotoResult>(
    `/api/students/${tenantUserId}/photo`,
    { signal },
  )
  return response.data
}

export async function createStudentInvitation(input: CreateStudentInvitationInput) {
  const response = await axios.post<StudentInvitationRequestResult>("/api/students", input)
  return response.data
}

export async function resendStudentInvitation(tenantUserId: string) {
  const response = await axios.post<StudentInvitationRequestResult>(
    `/api/students/${tenantUserId}/invitation/resend`,
  )
  return response.data
}

export async function deleteStudent(tenantUserId: string) {
  await axios.delete(`/api/students/${tenantUserId}`)
}

export async function uploadStudentPhoto(tenantUserId: string, file: File) {
  const authorization = await axios.post<StudentPhotoUploadAuthorization>(
    `/api/students/${tenantUserId}/photo/uploads`,
    { byteSize: file.size, contentType: file.type },
  )

  const uploadUrl = new URL(authorization.data.uploadUrl)
  const loopbackHosts = new Set(["127.0.0.1", "::1", "localhost"])
  const storageUsesLoopback = loopbackHosts.has(uploadUrl.hostname)
  const pageUsesLoopback = loopbackHosts.has(window.location.hostname)
  const requiresServerFallback =
    (window.location.protocol === "https:" && uploadUrl.protocol === "http:") ||
    (storageUsesLoopback && !pageUsesLoopback)

  try {
    if (requiresServerFallback) throw new Error("Mixed-content upload")

    await axios.put(authorization.data.uploadUrl, file, {
      headers: authorization.data.headers,
      maxBodyLength: 5 * 1024 * 1024,
      withCredentials: false,
    })
  } catch {
    const formData = new FormData()
    formData.append("photo", file)

    const fallback = await axios.post<StudentPhotoResult>(
      `/api/students/${tenantUserId}/photo/upload-fallback`,
      formData,
    )
    return fallback.data
  }

  const confirmation = await axios.post<StudentPhotoResult>(
    `/api/students/${tenantUserId}/photo/uploads/${authorization.data.assetId}/confirm`,
  )
  return confirmation.data
}

export async function lookupStudentInvitation(token: string) {
  const response = await axios.post<StudentInvitationLookupResult>(
    "/api/student-invitations/lookup",
    { token },
  )
  return response.data
}

export async function acceptStudentInvitation(input: AcceptStudentInvitationInput) {
  await axios.post("/api/student-invitations/accept", input)
}
