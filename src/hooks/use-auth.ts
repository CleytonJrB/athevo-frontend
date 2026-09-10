"use client"

import { useCallback, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (session?.error === "RefreshAccessTokenError") {
      void signOut({ callbackUrl: "/login" })
    }
  }, [session?.error])
  const initials = (session?.user?.name ?? "Usuario")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  const logout = useCallback(async () => {
    await signOut({ callbackUrl: "/login" })
  }, [])

  return {
    user: session?.user ?? null,
    initials,
    status,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    logout,
  }
}
