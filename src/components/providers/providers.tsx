import type { ReactNode } from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

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
    </TooltipProvider>
  )
}
