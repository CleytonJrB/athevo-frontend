import { NextResponse } from "next/server"

import { Api } from "@/lib/api/api"
import { ApiError } from "@/lib/api/api-error"
import type { StudentInvitationRequestResult } from "@/types/student"

interface RouteContext {
  params: Promise<{ tenantUserId: string }>
}

export async function POST(_request: Request, context: RouteContext) {
  const { tenantUserId } = await context.params

  try {
    const result = await Api.post<StudentInvitationRequestResult>(
      `/api/students/${tenantUserId}/invitation/resend`,
    )
    return NextResponse.json(result, { status: 202 })
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          detail: error.message,
          title: "Não foi possível reenviar o convite",
          traceId: error.traceId,
        },
        { status: error.status },
      )
    }

    return NextResponse.json(
      { title: "Não foi possível reenviar o convite" },
      { status: 500 },
    )
  }
}
