import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { Api } from "@/lib/api/api"
import { ApiError } from "@/lib/api/api-error"
import type { ExercisePage } from "@/types/exercise"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  try {
    const exercises = await Api.get<ExercisePage>("/api/exercises", {
      categoryId: searchParams.get("categoryId") ?? undefined,
      equipmentId: searchParams.get("equipmentId") ?? undefined,
      isCustom: searchParams.get("isCustom") ?? undefined,
      languageCode: "pt-BR",
      muscleId: searchParams.get("muscleId") ?? undefined,
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 10,
      search: searchParams.get("search") ?? undefined,
      source: searchParams.get("source") ?? undefined,
    })
    return NextResponse.json(exercises)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          detail: error.message,
          title: "Não foi possível carregar os exercícios",
          traceId: error.traceId,
        },
        { status: error.status },
      )
    }

    return NextResponse.json(
      { title: "Não foi possível carregar os exercícios" },
      { status: 500 },
    )
  }
}
