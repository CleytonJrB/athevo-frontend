import { NextResponse } from "next/server"

import { ApiError } from "@/lib/api/api-error"
import { publicApiPost } from "@/lib/api/public-api"
import type { AcceptStudentInvitationInput } from "@/types/student"

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AcceptStudentInvitationInput
    await publicApiPost<void, AcceptStudentInvitationInput>(
      "/api/student-invitations/accept",
      body,
    )
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          detail: error.status === 400 ? error.message : undefined,
          title: error.status === 429
            ? "Aguarde antes de tentar novamente"
            : "Convite indisponivel",
        },
        { status: error.status },
      )
    }

    return NextResponse.json({ title: "Convite indisponivel" }, { status: 500 })
  }
}
