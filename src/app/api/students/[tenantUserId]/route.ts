import { NextResponse } from "next/server"

import { Api } from "@/lib/api/api"
import { ApiError } from "@/lib/api/api-error"
import type { StudentDetails } from "@/types/student"

interface RouteContext {
  params: Promise<{ tenantUserId: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { tenantUserId } = await context.params

  try {
    const student = await Api.get<StudentDetails>(
      `/api/students/${tenantUserId}`,
    )
    return NextResponse.json(student)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          detail: error.message,
          title: "Nao foi possivel carregar o aluno",
          traceId: error.traceId,
        },
        { status: error.status },
      )
    }

    return NextResponse.json(
      { title: "Nao foi possivel carregar o aluno" },
      { status: 500 },
    )
  }
}
