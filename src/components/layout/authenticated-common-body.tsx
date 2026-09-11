import type { ReactNode } from "react"

export function AuthenticatedCommonBody({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] flex-1 flex-col gap-8 px-6 py-12">
      {children}
    </div>
  )
}
