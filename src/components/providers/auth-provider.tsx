"use client"

import type { ReactNode } from "react"
import { SessionProvider } from "next-auth/react"

interface AuthProviderProps {
  children: ReactNode
  refetchInterval: number
}

export function AuthProvider({
  children,
  refetchInterval,
}: AuthProviderProps) {
  return (
    <SessionProvider
      refetchInterval={refetchInterval}
      refetchWhenOffline={false}
    >
      {children}
    </SessionProvider>
  )
}
