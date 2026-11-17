import { NextResponse } from "next/server"

import { Api } from "@/lib/api/api"
import { ApiError } from "@/lib/api/api-error"
import type { StudentPhotoResult } from "@/types/student"

interface RouteContext {
  params: Promise<{ tenantUserId: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { tenantUserId } = await context.params

  try {
    const photo = await Api.get<StudentPhotoResult>(
      `/api/students/${tenantUserId}/photo`,
    )
    return NextResponse.json(photo)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          detail: error.message,
          title: "Nao foi possivel carregar a foto",
          traceId: error.traceId,
        },
        { status: error.status },
      )
    }

    return NextResponse.json(
      { title: "Nao foi possivel carregar a foto" },
      { status: 500 },
    )
  }
}
