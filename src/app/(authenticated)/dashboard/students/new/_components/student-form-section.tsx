import type { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface StudentFormSectionProps extends React.ComponentProps<"section"> {
  icon: LucideIcon
  title: string
}

export function StudentFormSection({
  children,
  className,
  icon: Icon,
  title,
  ...props
}: StudentFormSectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-surface-glass p-6 shadow-xl shadow-black/10 backdrop-blur-xl",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1 bg-primary-container/50"
      />
      <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold text-on-surface">
        <Icon aria-hidden="true" className="size-5 text-primary-container" />
        {title}
      </h2>
      {children}
    </section>
  )
}
