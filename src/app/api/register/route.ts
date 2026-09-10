import { NextResponse } from "next/server"
import { ValidationError } from "yup"

import { AthevoApiError, registerWithApi } from "@/lib/auth/athevo-api"
import { registerSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await registerSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    })
    const result = await registerWithApi(data)

    return NextResponse.json({ user: result.user }, { status: 201 })
  } catch (error) {
    if (error instanceof AthevoApiError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: error.errors[0] ?? "Dados de cadastro inválidos" },
        { status: 400 }
      )
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Corpo da requisição inválido" }, { status: 400 })
    }

    console.error("Failed to register user", error)
    return NextResponse.json({ error: "Não foi possível criar a conta" }, { status: 500 })
  }
}
