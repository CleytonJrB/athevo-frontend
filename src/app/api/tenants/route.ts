import { NextResponse } from "next/server"

import { Api } from "@/lib/api/api"
import { ApiError } from "@/lib/api/api-error"
import type { AcademyListItem } from "@/types/academy"

export async function GET() {
  try {
    const tenants = await Api.get<AcademyListItem[]>("/api/tenants")
    return NextResponse.json(tenants)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { title: error.message, traceId: error.traceId },
        { status: error.status }
      )
    }

    return NextResponse.json(
      { title: "Nao foi possivel carregar as academias" },
      { status: 500 }
    )
  }
}
