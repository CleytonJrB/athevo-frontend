import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { Api } from "@/lib/api/api"
import { ApiError } from "@/lib/api/api-error"
import type { TrainerPage } from "@/types/trainer"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  try {
    const trainers = await Api.get<TrainerPage>("/api/trainers", {
      active: searchParams.get("active") ?? undefined,
      page: searchParams.get("page") ?? 1,
      pageSize: searchParams.get("pageSize") ?? 6,
      search: searchParams.get("search") ?? undefined,
    })
    return NextResponse.json(trainers)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          detail: error.message,
          title: "Não foi possível carregar os professores",
          traceId: error.traceId,
        },
        { status: error.status },
      )
    }

    return NextResponse.json(
      { title: "Não foi possível carregar os professores" },
      { status: 500 },
    )
  }
}
