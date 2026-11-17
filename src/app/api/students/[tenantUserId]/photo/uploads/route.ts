import { NextResponse } from "next/server"

import { Api } from "@/lib/api/api"
import { ApiError } from "@/lib/api/api-error"
import type { StudentPhotoUploadAuthorization } from "@/types/student"

interface RouteContext {
  params: Promise<{ tenantUserId: string }>
}

export async function POST(request: Request, context: RouteContext) {
  const { tenantUserId } = await context.params
  const body = (await request.json()) as { byteSize: number; contentType: string }

  try {
    const result = await Api.post<StudentPhotoUploadAuthorization, typeof body>(
      `/api/students/${tenantUserId}/photo/uploads`,
      body,
    )
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { detail: error.message, title: "Nao foi possivel iniciar o envio da foto", traceId: error.traceId },
        { status: error.status },
      )
    }
    return NextResponse.json({ title: "Nao foi possivel iniciar o envio da foto" }, { status: 500 })
  }
}
