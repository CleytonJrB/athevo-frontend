import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type TrainerFilter =
  | "all"
  | "strength"
  | "group-classes"
  | "functional"
  | "personal"
  | "on-duty"

const filters: Array<{ value: TrainerFilter; label: string; count: number }> = [
  { value: "all", label: "Todos", count: 32 },
  { value: "strength", label: "Musculação", count: 16 },
  { value: "group-classes", label: "Aulas Coletivas / Dança", count: 6 },
  { value: "functional", label: "Crossfit / Funcional", count: 5 },
  { value: "personal", label: "Personal Trainers", count: 5 },
  { value: "on-duty", label: "Em Plantão", count: 14 },
]

interface TrainerFiltersProps {
  activeFilter: TrainerFilter
  onFilterChange: (filter: TrainerFilter) => void
}

export function TrainerFilters({
  activeFilter,
  onFilterChange,
}: TrainerFiltersProps) {
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
                  "rounded-full px-1.5 py-0.5 font-mono text-[0.65rem] leading-none",
                  isActive
                    ? "bg-on-primary-container/10"
                    : filter.value === "on-duty"
                      ? "bg-success/20 text-success"
                      : "bg-surface-container-highest",
                )}
              >
                {filter.count}
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
