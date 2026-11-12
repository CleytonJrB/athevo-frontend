import { NextResponse } from "next/server"

import { ApiError } from "@/lib/api/api-error"
import { publicApiPost } from "@/lib/api/public-api"
import type { StudentInvitationLookupResult } from "@/types/student"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { token?: string }
    const result = await publicApiPost<
      StudentInvitationLookupResult,
      { token?: string }
    >("/api/student-invitations/lookup", body)
    return NextResponse.json(result)
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500
    return NextResponse.json(
      { title: status === 429 ? "Aguarde antes de tentar novamente" : "Convite indisponivel" },
      { status },
    )
  }
}
