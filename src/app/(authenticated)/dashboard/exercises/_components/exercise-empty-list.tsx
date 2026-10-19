import { Dumbbell, SearchX } from "lucide-react"

import { Button } from "@/components/ui/button"

interface ExerciseEmptyListProps {
  filtered: boolean
  onClearFilters: () => void
}

export function ExerciseEmptyList({
  filtered,
  onClearFilters,
}: ExerciseEmptyListProps) {
  const Icon = filtered ? SearchX : Dumbbell

  return (
    <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-outline-variant bg-surface-glass px-6 text-center">
      <Icon aria-hidden="true" className="mb-4 size-10 text-on-surface-variant" />
      <h2 className="text-lg font-semibold text-on-surface">
        {filtered ? "Nenhum exercício encontrado" : "Biblioteca sem exercícios"}
      </h2>
      <p className="mt-1 text-sm text-on-surface-variant">
        {filtered
          ? "Tente buscar outro nome ou alterar o filtro de origem."
          : "Cadastre um exercício da academia para começar sua biblioteca."}
      </p>

      {filtered && (
        <Button
          type="button"
          variant="outline"
          onClick={onClearFilters}
          className="mt-5 px-2 border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-high"
        >
          Limpar filtros
        </Button>
      )}
    </div>
  )
}
