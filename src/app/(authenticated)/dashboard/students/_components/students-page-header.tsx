import { ChevronDown, ListFilter, Plus } from "lucide-react"

import { AuthenticatedCommonTitle } from "@/components/layout/authenticated-common-title"
import { Button } from "@/components/ui/button"
import type { StudentStatus } from "../_data/students"

export type StudentStatusFilter = "all" | StudentStatus

interface StudentsPageHeaderProps {
  filtersVisible: boolean
  status: StudentStatusFilter
  onFiltersToggle: () => void
  onNewStudent: () => void
  onStatusChange: (status: StudentStatusFilter) => void
}

export function StudentsPageHeader({
  filtersVisible,
  status,
  onFiltersToggle,
  onNewStudent,
  onStatusChange,
}: StudentsPageHeaderProps) {
  return (
    <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 -z-10 size-64 rounded-full bg-primary-container/5 blur-[80px]"
      />

      <AuthenticatedCommonTitle
        title="Alunos"
        subTitle="Gerencie os matriculados, planos e frequências."
      />

      <div className="flex flex-wrap items-center gap-2">
        <label className="relative">
          <span className="sr-only">Filtrar alunos por status</span>
          <select
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as StudentStatusFilter)
            }
            className="h-10 appearance-none rounded-md border border-border bg-card py-2 pr-10 pl-4 text-sm text-on-surface outline-none transition-colors hover:bg-surface-container focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativo</option>
            <option value="pending">Pendente</option>
            <option value="delinquent">Inadimplente</option>
          </select>
          <ChevronDown
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-on-surface-variant"
          />
        </label>

        <Button
          type="button"
          variant="outline"
          aria-expanded={filtersVisible}
          aria-controls="student-filters"
          onClick={onFiltersToggle}
          className="h-10 border-border bg-transparent px-4 text-on-surface hover:bg-surface-container"
        >
          <ListFilter aria-hidden="true" />
          Filtros
        </Button>

        <Button
          type="button"
          onClick={onNewStudent}
          className="h-10 self-start rounded-md bg-primary-container px-6 font-bold text-black hover:bg-primary-container hover:shadow-[0_0_20px_rgba(250,204,21,0.4)] md:self-auto"
        >
          <Plus aria-hidden="true" className="size-5" />
          Novo Aluno
        </Button>
      </div>
    </div>
  )
}
