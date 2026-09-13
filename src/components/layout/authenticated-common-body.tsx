import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export function AuthenticatedCommonBody({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex min-h-[calc(100svh-4rem)] flex-1 flex-col gap-8 px-6 py-12",
        className,
      )}
    >
      {children}
    </div>
  )
}
