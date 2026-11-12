import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { Api } from "@/lib/api/api"
import { ApiError } from "@/lib/api/api-error"
import type { StudentPage } from "@/types/student"
import type {
  CreateStudentInvitationInput,
  StudentInvitationRequestResult,
} from "@/types/student"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  try {
    const students = await Api.get<StudentPage>("/api/students", {
      active: searchParams.get("active") ?? undefined,
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 10,
      search: searchParams.get("search") ?? undefined,
    })
    return NextResponse.json(students)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          detail: error.message,
          title: "Não foi possível carregar os alunos",
          traceId: error.traceId,
        },
        { status: error.status },
      )
    }

    return NextResponse.json(
      { title: "Não foi possível carregar os alunos" },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateStudentInvitationInput
    const result = await Api.post<
      StudentInvitationRequestResult,
      CreateStudentInvitationInput
    >("/api/students/invitations", body)
    return NextResponse.json(result, { status: 202 })
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          detail: error.message,
          title: "Nao foi possivel enviar o convite",
          traceId: error.traceId,
        },
        { status: error.status },
      )
    }

    return NextResponse.json(
      { title: "Nao foi possivel enviar o convite" },
      { status: 500 },
    )
  }
}
