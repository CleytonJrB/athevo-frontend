import { Check, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { RadioGroupItem } from "@/components/ui/radio-group"

interface SelectCardProps {
  id: string
  value: string
  icon: LucideIcon
  title: string
  description: string
  selected: boolean
  disabled?: boolean
}

export function SelectCard({
  id,
  value,
  icon: Icon,
  title,
  description,
  selected,
  disabled = false,
}: SelectCardProps) {
  return (
    <label
      htmlFor={id}
      className={cn("block h-full", disabled ? "cursor-not-allowed" : "cursor-pointer")}
    >
      <RadioGroupItem
        id={id}
        value={value}
        disabled={disabled}
        className="peer sr-only"
      />
      <span
        className={cn(
          "relative block h-full min-h-44 rounded-lg border border-white/8 bg-zinc-900/70 p-5 text-left outline-none transition peer-data-checked:border-yellow-400 peer-data-checked:bg-yellow-400/8 peer-data-checked:ring-1 peer-data-checked:ring-yellow-400/40 peer-focus-visible:border-yellow-400 peer-focus-visible:ring-3 peer-focus-visible:ring-yellow-400/20",
          selected && "border-yellow-400 bg-yellow-400/8 ring-1 ring-yellow-400/40",
          disabled
            ? "opacity-40"
            : "hover:border-yellow-400/40 hover:bg-zinc-900"
        )}
      >
        {selected ? (
          <span className="absolute top-4 right-4 flex size-5 items-center justify-center rounded-full bg-yellow-400 text-black">
            <Check className="size-3" />
          </span>
        ) : null}
        <span className="flex size-9 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
          <Icon className="size-4.5" />
        </span>
        <span className="mt-4 block text-sm font-semibold text-zinc-100">{title}</span>
        <span className="mt-2 block text-xs leading-5 text-zinc-500">{description}</span>
      </span>
    </label>
  )
}
