import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"

interface PasswordToggleProps {
  className?: string
  shown: boolean
  onToggle: () => void
}

export function PasswordToggle({ className, shown, onToggle }: PasswordToggleProps) {
  const Icon = shown ? EyeOff : Eye

  return (
    <button
      type="button"
      className={cn(
        "absolute inset-y-0 right-0 flex w-11 cursor-pointer items-center justify-center text-zinc-500 transition hover:text-zinc-800",
        className,
      )}
      aria-label={shown ? "Ocultar senha" : "Mostrar senha"}
      onClick={onToggle}
    >
      <Icon className="size-4" />
    </button>
  )
}
