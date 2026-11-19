import { NextResponse } from "next/server"

import { Api } from "@/lib/api/api"
import { ApiError } from "@/lib/api/api-error"

interface RouteContext {
  params: Promise<{ segments: string[] }>
}

type ProxyMethod = "GET" | "PATCH" | "POST" | "PUT"

export function GET(request: Request, context: RouteContext) {
  return proxyStudentFinanceRequest("GET", request, context)
}

export function POST(request: Request, context: RouteContext) {
  return proxyStudentFinanceRequest("POST", request, context)
}

export function PUT(request: Request, context: RouteContext) {
  return proxyStudentFinanceRequest("PUT", request, context)
}

export function PATCH(request: Request, context: RouteContext) {
  return proxyStudentFinanceRequest("PATCH", request, context)
}

async function proxyStudentFinanceRequest(
  method: ProxyMethod,
  request: Request,
  context: RouteContext,
) {
  const { segments } = await context.params
  const path = segments.map(encodeURIComponent).join("/")
  const backendPath = `/api/student-finance/${path}`

  try {
    const url = new URL(request.url)
    const query = Object.fromEntries(url.searchParams.entries())
    const body = method === "GET" ? undefined : await request.json()
    const idempotencyKey = request.headers.get("Idempotency-Key")
    const config = idempotencyKey
      ? { headers: { "Idempotency-Key": idempotencyKey } }
      : undefined

    const result =
      method === "GET"
        ? await Api.get<unknown>(backendPath, query)
        : method === "POST"
          ? await Api.post<unknown, unknown>(backendPath, body, config)
          : method === "PUT"
            ? await Api.put<unknown, unknown>(backendPath, body, config)
            : await Api.patch<unknown, unknown>(backendPath, body, config)

    return result === undefined || result === null
      ? new NextResponse(null, { status: 204 })
      : NextResponse.json(result)
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          detail: error.message,
          title: "Não foi possível concluir a operação financeira",
          traceId: error.traceId,
        },
        { status: error.status },
      )
    }

    return NextResponse.json(
      { title: "Não foi possível concluir a operação financeira" },
      { status: 500 },
    )
  }
}
