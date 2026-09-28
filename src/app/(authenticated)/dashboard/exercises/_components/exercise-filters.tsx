import { Building2, Library, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { ExerciseScope } from "@/types/exercise"

interface ExerciseFiltersProps {
  onSearchChange: (search: string) => void
  onScopeChange: (scope: ExerciseScope) => void
  search: string
  scope: ExerciseScope
}

const scopes: Array<{
  icon?: typeof Library
  label: string
  value: ExerciseScope
}> = [
  { label: "Todos", value: "all" },
  { icon: Library, label: "Catálogo", value: "catalog" },
  { icon: Building2, label: "Da academia", value: "custom" },
]

export function ExerciseFilters({
  onSearchChange,
  onScopeChange,
  search,
  scope,
}: ExerciseFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-4">
      <label className="relative min-w-64 flex-1 md:max-w-md">
        <span className="sr-only">Buscar exercício por nome</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 z-10 size-5 -translate-y-1/2 text-on-surface-variant"
        />
        <Input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar exercício por nome..."
          className="h-10 border-border bg-card pr-4 pl-10 text-sm text-on-surface shadow-none placeholder:text-on-surface-variant focus-visible:border-primary-container focus-visible:ring-primary-container/20"
        />
      </label>

      <div
        className="flex max-w-full gap-1 overflow-x-auto rounded-md border border-border bg-card p-1"
        aria-label="Filtrar por origem do exercício"
      >
        {scopes.map(({ icon: Icon, label, value }) => {
          const isActive = scope === value

          return (
            <Button
              key={value}
              type="button"
              variant="ghost"
              aria-pressed={isActive}
              onClick={() => onScopeChange(value)}
              className={cn(
                "h-8 rounded px-3 text-xs whitespace-nowrap",
                isActive
                  ? "bg-surface-container-high font-semibold text-primary-container hover:bg-surface-container-high"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
              )}
            >
              {Icon && <Icon aria-hidden="true" />}
              {label}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
