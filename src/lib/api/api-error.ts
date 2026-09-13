export interface ApiProblemDetails {
  detail?: string
  status?: number
  title?: string
  traceId?: string
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly traceId?: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}
