import { Check, LoaderCircle } from "lucide-react"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { formatAcademySummary, getAcademyInitials } from "@/lib/academy"
import { cn } from "@/lib/utils"
import type { AcademyListItem } from "@/types/academy"

interface AcademySwitcherItemProps {
  academy: AcademyListItem
  active: boolean
  disabled: boolean
  switching: boolean
  onSelect: (academy: AcademyListItem) => void
}

export function AcademySwitcherItem({
  academy,
  active,
  disabled,
  switching,
  onSelect,
}: AcademySwitcherItemProps) {
  const summary = formatAcademySummary(academy)

  return (
    <DropdownMenuItem
      aria-current={active ? "true" : undefined}
      disabled={disabled}
      onClick={() => onSelect(academy)}
      className={cn(
        "group/academy min-h-12 cursor-pointer gap-2.5 rounded-lg border border-transparent p-2 focus:bg-surface-container-high/70",
        active &&
          "cursor-default border-primary-container/30 bg-primary-container/10 focus:bg-primary-container/15"
      )}
    >
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md border border-outline-variant/40 bg-surface-container-highest text-xs font-semibold text-on-surface",
          active &&
            "border-primary-container bg-primary-container text-on-primary-container"
        )}
      >
        {switching ? (
          <LoaderCircle className="size-3.5 animate-spin" />
        ) : (
          getAcademyInitials(academy.name)
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col text-left">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="truncate text-xs font-semibold text-on-surface transition-colors group-focus/academy:text-primary-container">
            {academy.name}
          </span>
          {active && (
            <span className="shrink-0 rounded bg-primary-container/20 px-1.5 py-0.5 text-[9px] font-medium text-primary-container">
              Atual
            </span>
          )}
        </div>
        <span className="truncate text-[11px] text-on-surface-variant">
          {summary}
        </span>
      </div>
      {active && <Check className="ml-1 size-4 text-primary-container" />}
    </DropdownMenuItem>
  )
}
