import { type SelectHTMLAttributes } from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

export function SelectInput({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-11 w-full appearance-none rounded-md border border-zinc-400 bg-zinc-50 px-4 pr-10 text-sm text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow] focus:border-yellow-400 focus:ring-3 focus:ring-yellow-400/20 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-zinc-500" />
    </div>
  )
}
