"use client"

import { useState, type ReactNode } from "react"
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query"

import { appToast } from "@/lib/toast"

function getMetaString(
  meta: Record<string, unknown> | undefined,
  key: string,
) {
  const value = meta?.[key]
  return typeof value === "string" ? value : undefined
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) => {
            if (mutation.meta?.skipGlobalErrorToast === true) return

            appToast.error(error, {
              fallback: getMetaString(mutation.meta, "errorFallback"),
              title:
                getMetaString(mutation.meta, "errorTitle") ??
                "Não foi possível salvar as alterações",
            })
          },
        }),
        queryCache: new QueryCache({
          onError: (error, query) => {
            if (query.meta?.skipGlobalErrorToast === true) return

            appToast.error(error, {
              fallback: getMetaString(query.meta, "errorFallback"),
              id: `query-error-${query.queryHash}`,
              title:
                getMetaString(query.meta, "errorTitle") ??
                "Não foi possível carregar os dados",
            })
          },
        }),
        defaultOptions: {
          queries: { staleTime: 60_000, retry: 1 },
          mutations: { retry: 0 },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
