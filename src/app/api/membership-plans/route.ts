import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

import { Api } from "@/lib/api/api"
import { ApiError } from "@/lib/api/api-error"
import type { MembershipPlan } from "@/types/membership-plan"

export async function GET(request: NextRequest) {
  try {
    const active = request.nextUrl.searchParams.get("active")
    const plans = await Api.get<MembershipPlan[]>("/api/membership-plans", {
      active: active === null ? undefined : active,
    })
    return NextResponse.json(plans)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          detail: error.message,
          title: "Não foi possível carregar os planos",
          traceId: error.traceId,
        },
        { status: error.status },
      )
    }

    return NextResponse.json(
      { title: "Não foi possível carregar os planos" },
      { status: 500 },
    )
  }
}
