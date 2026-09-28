import { NextResponse } from "next/server"

import { Api } from "@/lib/api/api"
import { ApiError } from "@/lib/api/api-error"
import type { ExerciseDetails } from "@/types/exercise"

interface ExerciseRouteContext {
  params: Promise<{ id: string }>
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function GET(
  _request: Request,
  context: ExerciseRouteContext,
) {
  const { id } = await context.params

  if (!uuidPattern.test(id)) {
    return NextResponse.json(
      { title: "Identificador de exercício inválido" },
      { status: 400 },
    )
  }

  try {
    const exercise = await Api.get<ExerciseDetails>(`/api/exercises/${id}`, {
      languageCode: "pt-BR",
    })
    return NextResponse.json(exercise)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          detail: error.message,
          title: "Não foi possível carregar o exercício",
          traceId: error.traceId,
        },
        { status: error.status },
      )
    }

    return NextResponse.json(
      { title: "Não foi possível carregar o exercício" },
      { status: 500 },
    )
  }
}
