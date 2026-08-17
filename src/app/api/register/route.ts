import { NextResponse } from "next/server"
import { ValidationError } from "yup"

import { createUser, UserAlreadyExistsError } from "@/lib/auth/user-store"
import { registerSchema } from "@/lib/validations/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = await registerSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    })
    const user = await createUser(data)

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return NextResponse.json({ error: error.message }, { status: 409 })
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
