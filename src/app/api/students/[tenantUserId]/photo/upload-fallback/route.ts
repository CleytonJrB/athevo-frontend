import { NextResponse } from "next/server"
import axios, { isAxiosError } from "axios"

import { Api } from "@/lib/api/api"
import { ApiError } from "@/lib/api/api-error"
import type {
  StudentPhotoResult,
  StudentPhotoUploadAuthorization,
} from "@/types/student"

interface RouteContext {
  params: Promise<{ tenantUserId: string }>
}

const maximumPhotoBytes = 5 * 1024 * 1024
const supportedContentTypes = new Set(["image/jpeg", "image/png", "image/webp"])

export async function POST(request: Request, context: RouteContext) {
  const { tenantUserId } = await context.params

  try {
    const formData = await request.formData()
    const photo = formData.get("photo")

    if (!(photo instanceof File)) {
      return NextResponse.json(
        { detail: "Selecione uma foto para enviar." },
        { status: 400 },
      )
    }

    if (
      !supportedContentTypes.has(photo.type) ||
      photo.size < 1 ||
      photo.size > maximumPhotoBytes
    ) {
      return NextResponse.json(
        { detail: "Use uma imagem JPEG, PNG ou WebP de ate 5 MB." },
        { status: 400 },
      )
    }

    const authorization = await Api.post<
      StudentPhotoUploadAuthorization,
      { byteSize: number; contentType: string }
    >(`/api/students/${tenantUserId}/photo/uploads`, {
      byteSize: photo.size,
      contentType: photo.type,
    })

    try {
      await axios.put(
        authorization.uploadUrl,
        Buffer.from(await photo.arrayBuffer()),
        {
          headers: authorization.headers,
          maxBodyLength: maximumPhotoBytes,
          maxContentLength: maximumPhotoBytes,
          timeout: 15_000,
          withCredentials: false,
        },
      )
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined
      return NextResponse.json(
        {
          detail: status
            ? `O armazenamento recusou o envio da foto (HTTP ${status}).`
            : "O frontend nao conseguiu se conectar ao armazenamento local.",
        },
        { status: 502 },
      )
    }

    const result = await Api.post<StudentPhotoResult>(
      `/api/students/${tenantUserId}/photo/uploads/${authorization.assetId}/confirm`,
    )

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          detail: error.message,
          title: "Nao foi possivel enviar a foto",
          traceId: error.traceId,
        },
        { status: error.status },
      )
    }

    return NextResponse.json(
      { detail: "Nao foi possivel concluir o envio da foto." },
      { status: 500 },
    )
  }
}
