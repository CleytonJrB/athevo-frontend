import type { ReactNode } from "react"

import { AuthProvider } from "@/components/providers/auth-provider"
import { QueryProvider } from "@/components/providers/query-provider"
import { Toaster } from "@/components/ui/toast"
import { TooltipProvider } from "@/components/ui/tooltip"

interface ProvidersProps {
  children: ReactNode
  sessionRefetchInterval: number
}

export function Providers({
  children,
  sessionRefetchInterval,
}: ProvidersProps) {
  return (
    <TooltipProvider>
      <AuthProvider refetchInterval={sessionRefetchInterval}>
        <QueryProvider>{children}</QueryProvider>
      </AuthProvider>
      <Toaster limit={3} timeout={5_000} />
    </TooltipProvider>
  )
}
