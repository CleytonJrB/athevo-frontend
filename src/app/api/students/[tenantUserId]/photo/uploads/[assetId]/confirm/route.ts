import { NextResponse } from "next/server"

import { Api } from "@/lib/api/api"
import { ApiError } from "@/lib/api/api-error"
import type { StudentPhotoResult } from "@/types/student"

interface RouteContext {
  params: Promise<{ assetId: string; tenantUserId: string }>
}

export async function POST(_request: Request, context: RouteContext) {
  const { assetId, tenantUserId } = await context.params
  try {
    const result = await Api.post<StudentPhotoResult>(
      `/api/students/${tenantUserId}/photo/uploads/${assetId}/confirm`,
    )
    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { detail: error.message, title: "Nao foi possivel confirmar a foto", traceId: error.traceId },
        { status: error.status },
      )
    }
    return NextResponse.json({ title: "Nao foi possivel confirmar a foto" }, { status: 500 })
  }
}
