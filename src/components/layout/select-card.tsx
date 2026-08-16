import { Check, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface SelectCardProps {
  icon: LucideIcon
  title: string
  description: string
  selected: boolean
  disabled?: boolean
  onBlur?: () => void
  onSelect: () => void
}

export function SelectCard({
  icon: Icon,
  title,
  description,
  selected,
  disabled = false,
  onBlur,
  onSelect,
}: SelectCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      className={cn(
        "relative h-full min-h-44 cursor-pointer rounded-lg border border-white/8 bg-zinc-900/70 p-5 text-left outline-none transition hover:border-yellow-400/40 hover:bg-zinc-900 focus-visible:border-yellow-400 focus-visible:ring-3 focus-visible:ring-yellow-400/20",
        selected && "border-yellow-400 bg-yellow-400/8 ring-1 ring-yellow-400/40",
        disabled && "cursor-not-allowed opacity-40 hover:border-white/8 hover:bg-zinc-900/70"
      )}
      onBlur={onBlur}
      onClick={onSelect}
    >
      {selected ? (
        <span className="absolute top-4 right-4 flex size-5 items-center justify-center rounded-full bg-yellow-400 text-black">
          <Check className="size-3" />
        </span>
      ) : null}
      <span className="flex size-9 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
        <Icon className="size-4.5" />
      </span>
      <h3 className="mt-4 text-sm font-semibold text-zinc-100">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-zinc-500">{description}</p>
    </button>
  )
}
