import { NextResponse } from "next/server"

import { Api } from "@/lib/api/api"
import { ApiError } from "@/lib/api/api-error"
import type { CurrentSubscription } from "@/types/subscription"

export async function GET() {
  try {
    const subscription = await Api.get<CurrentSubscription>(
      "/api/subscription/current",
    )

    return NextResponse.json(subscription)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { title: error.message, traceId: error.traceId },
        { status: error.status },
      )
    }

    return NextResponse.json(
      { title: "Não foi possível consultar a assinatura" },
      { status: 500 },
    )
  }
}
