import "@tanstack/react-query"

interface AppReactQueryMeta extends Record<string, unknown> {
  errorFallback?: string
  errorTitle?: string
  skipGlobalErrorToast?: boolean
}

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: AppReactQueryMeta
    queryMeta: AppReactQueryMeta
  }
}
