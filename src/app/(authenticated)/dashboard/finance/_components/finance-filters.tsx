import { ChevronDown, Search } from "lucide-react"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { InvoiceStatus } from "../_data/invoices"

export type InvoiceStatusFilter = "all" | InvoiceStatus

interface FinanceFiltersProps {
  competence: string
  delinquentOnly: boolean
  search: string
  status: InvoiceStatusFilter
  onClear: () => void
  onCompetenceChange: (competence: string) => void
  onDelinquentOnlyChange: (checked: boolean) => void
  onSearchChange: (search: string) => void
  onStatusChange: (status: InvoiceStatusFilter) => void
}

export function FinanceFilters({
  competence,
  delinquentOnly,
  search,
  status,
  onClear,
  onCompetenceChange,
  onDelinquentOnlyChange,
  onSearchChange,
  onStatusChange,
}: FinanceFiltersProps) {
  return (
    <section
      aria-label="Filtros financeiros"
      className="rounded-xl border border-border bg-surface p-3.5"
    >
      <div className="flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:flex-wrap">
          <label className="relative min-w-60 flex-1 xl:max-w-xl">
            <span className="sr-only">Buscar aluno por nome, e-mail ou matrícula</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-on-surface-variant"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Buscar por nome, e-mail ou matrícula..."
              className="h-10 border-border bg-card pr-3 pl-9 text-sm shadow-none focus-visible:border-primary-container focus-visible:ring-primary-container/20"
            />
          </label>

          <SelectField
            label="Competência"
            value={competence}
            onChange={onCompetenceChange}
            className="sm:w-48"
          >
            <option value="all">Todas as competências</option>
            <option value="11/2026">Novembro / 2026</option>
            <option value="10/2026">Outubro / 2026</option>
            <option value="09/2026">Setembro / 2026</option>
          </SelectField>

          <SelectField
            label="Status da fatura"
            value={status}
            onChange={(value) => onStatusChange(value as InvoiceStatusFilter)}
            className="sm:w-44"
          >
            <option value="all">Todos os status</option>
            <option value="open">Em aberto</option>
            <option value="partial">Parcial</option>
            <option value="paid">Paga</option>
            <option value="overdue">Vencida</option>
            <option value="canceled">Cancelada</option>
          </SelectField>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex cursor-pointer items-center gap-2 font-medium text-rose-400">
            <Checkbox
              checked={delinquentOnly}
              onCheckedChange={onDelinquentOnlyChange}
              aria-label="Exibir apenas alunos inadimplentes"
            />
            Apenas inadimplentes
          </label>
          <span aria-hidden="true" className="hidden h-4 w-px bg-border sm:block" />
          <button
            type="button"
            onClick={onClear}
            className="font-medium text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Limpar
          </button>
        </div>
      </div>
    </section>
  )
}

interface SelectFieldProps {
  children: React.ReactNode
  className?: string
  label: string
  value: string
  onChange: (value: string) => void
}

function SelectField({
  children,
  className,
  label,
  value,
  onChange,
}: SelectFieldProps) {
  return (
    <label className={`relative ${className ?? ""}`}>
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full appearance-none rounded-md border border-border bg-card py-2 pr-9 pl-3 text-sm text-on-surface outline-none transition-colors hover:bg-surface-container focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-on-surface-variant"
      />
    </label>
  )
}

