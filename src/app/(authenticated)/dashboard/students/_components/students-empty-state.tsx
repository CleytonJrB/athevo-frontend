import { SearchX, UserRoundPlus } from "lucide-react"

import { Button } from "@/components/ui/button"

interface StudentsEmptyStateProps {
  filtered: boolean
  onClearFilters: () => void
}

export function StudentsEmptyState({
  filtered,
  onClearFilters,
}: StudentsEmptyStateProps) {
  const Icon = filtered ? SearchX : UserRoundPlus

  return (
    <div
      role="status"
      className="flex min-h-80 flex-col items-center justify-center px-6 py-12 text-center"
    >
      <span className="mb-5 flex size-14 items-center justify-center rounded-full border border-primary-container/20 bg-primary-container/10 text-primary-container">
        <Icon aria-hidden="true" className="size-7" />
      </span>
      <h2 className="text-lg font-semibold text-on-surface">
        {filtered ? "Nenhum aluno encontrado" : "Nenhum aluno cadastrado"}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-on-surface-variant">
        {filtered
          ? "Não encontramos alunos com os filtros atuais. Limpe os filtros ou tente outra busca."
          : "Cadastre o primeiro aluno para começar a gerenciar os vínculos desta academia."}
      </p>

      {filtered ? (
        <Button
          type="button"
          variant="outline"
          onClick={onClearFilters}
          className="mt-6 border-outline-variant bg-transparent px-5 text-on-surface hover:bg-surface-container-high"
        >
          Limpar filtros
        </Button>
      ) : (
        <Button
          href="/dashboard/students/new"
          className="mt-6 bg-primary-container px-5 font-semibold text-black hover:bg-primary-container/90"
        >
          <UserRoundPlus aria-hidden="true" />
          Cadastrar aluno
        </Button>
      )}
    </div>
  )
}
