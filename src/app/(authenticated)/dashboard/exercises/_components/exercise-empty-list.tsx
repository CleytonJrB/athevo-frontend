import { SearchX } from "lucide-react";

export function ExerciseEmptyList() {
  return (
    <div className="flex min-h-72 max-w-md flex-col items-center justify-center self-center rounded-xl border border-dashed border-outline-variant bg-surface-glass px-6 text-center">
      <SearchX aria-hidden="true" className="mb-4 size-10 text-on-surface-variant" />
      <h2 className="text-lg font-semibold text-on-surface">Nenhum exercício encontrado</h2>
      <p className="mt-1 text-sm text-on-surface-variant">
        Tente buscar outro nome ou selecionar uma categoria diferente.
      </p>
    </div>
  )
}