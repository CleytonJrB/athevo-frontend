import type { ReactNode } from "react"

import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/components/providers/auth-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <AuthProvider>
        <QueryProvider>{children}</QueryProvider>
      </AuthProvider>
    </TooltipProvider>
  )
}