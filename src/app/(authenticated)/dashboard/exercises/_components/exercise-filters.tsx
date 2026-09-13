import { ListFilter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { exerciseCategories } from "../_data/exercises"

interface ExerciseFiltersProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
  onSearchChange: (search: string) => void
  onToggleMore: () => void
  search: string
  showMore: boolean
}

const visibleCategoryCount = 6

export function ExerciseFilters({
  activeCategory,
  onCategoryChange,
  onSearchChange,
  onToggleMore,
  search,
  showMore,
}: ExerciseFiltersProps) {
  const categories = showMore
    ? exerciseCategories
    : exerciseCategories.slice(0, visibleCategoryCount)

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
          className="h-10 rounded-lg border-border bg-card pr-4 pl-10 text-sm text-on-surface shadow-none placeholder:text-on-surface-variant focus-visible:border-primary-container focus-visible:ring-primary-container/20"
        />
      </label>

      <div className="flex max-w-full gap-2 overflow-x-auto pb-2" aria-label="Filtrar por grupo muscular">
        {categories.map((category) => {
          const isActive = activeCategory === category

          return (
            <Button
              key={category}
              type="button"
              variant={isActive ? "default" : "outline"}
              aria-pressed={isActive}
              onClick={() => onCategoryChange(category)}
              className={cn(
                "h-8 rounded-full px-4 text-xs whitespace-nowrap",
                isActive
                  ? "bg-primary-container font-semibold text-black hover:bg-primary-container/90"
                  : "border-border bg-card text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
              )}
            >
              {category}
            </Button>
          )
        })}

        <Button
          type="button"
          variant="outline"
          aria-expanded={showMore}
          onClick={onToggleMore}
          className="h-8 rounded-full border-border bg-card px-4 text-xs text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
        >
          <ListFilter aria-hidden="true" />
          {showMore ? "Menos" : "Mais"}
        </Button>
      </div>
    </div>
  )
}
