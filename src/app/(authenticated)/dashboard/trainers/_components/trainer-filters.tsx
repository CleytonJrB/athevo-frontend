import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TrainerSummary } from "@/types/trainer"

export type TrainerFilter = "all" | "active" | "inactive"

interface TrainerFiltersProps {
  activeFilter: TrainerFilter
  loading?: boolean
  onFilterChange: (filter: TrainerFilter) => void
  summary: TrainerSummary
}

export function TrainerFilters({
  activeFilter,
  loading = false,
  onFilterChange,
  summary,
}: TrainerFiltersProps) {
  const filters: Array<{ value: TrainerFilter; label: string; count: number }> = [
    { value: "all", label: "Todos", count: summary.total },
    { value: "active", label: "Ativos", count: summary.active },
    { value: "inactive", label: "Inativos", count: summary.inactive },
  ]

  return (
    <div className="max-w-full overflow-x-auto pb-1">
      <div className="flex w-max items-center gap-2" aria-label="Filtrar professores">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value

          return (
            <Button
              key={filter.value}
              type="button"
              variant={isActive ? "default" : "outline"}
              aria-pressed={isActive}
              onClick={() => onFilterChange(filter.value)}
              className={cn(
                "h-9 gap-2 rounded-lg px-4 text-xs whitespace-nowrap",
                isActive
                  ? "bg-primary-container font-semibold text-on-primary-container hover:bg-primary-container/90"
                  : "border-surface-container-high bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
              )}
            >
              {filter.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 font-mono text-xs leading-none",
                  isActive
                    ? "bg-on-primary-container/10"
                    : "bg-surface-container-highest",
                )}
              >
                {loading ? "—" : filter.count}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
