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
        "flex mx-auto w-full min-h-[calc(100svh-6.5rem)] flex-1 flex-col gap-8 px-16 py-12",
        className,
      )}
    >
      {children}
    </div>
  )
}
