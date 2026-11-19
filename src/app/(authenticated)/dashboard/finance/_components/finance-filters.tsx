import { ChevronDown } from "lucide-react"

import { StudentInvoiceStatus } from "@/types/student-finance"

export type InvoiceStatusFilter = "all" | StudentInvoiceStatus

interface FinanceFiltersProps {
  status: InvoiceStatusFilter
  onStatusChange: (status: InvoiceStatusFilter) => void
}

export function FinanceFilters({ status, onStatusChange }: FinanceFiltersProps) {
  return (
    <section
      aria-label="Filtros financeiros"
      className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3.5 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-on-surface-variant">
        Consulte as faturas emitidas para os alunos da academia.
      </p>
      <label className="relative w-full sm:w-48">
        <span className="sr-only">Status da fatura</span>
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value === "all"
                ? "all"
                : (Number(event.target.value) as StudentInvoiceStatus),
            )
          }
          className="h-10 w-full appearance-none rounded-md border border-border bg-card py-2 pr-9 pl-3 text-sm text-on-surface outline-none transition-colors hover:bg-surface-container focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
        >
          <option value="all">Todos os status</option>
          <option value={StudentInvoiceStatus.Open}>Em aberto</option>
          <option value={StudentInvoiceStatus.PartiallyPaid}>Parcial</option>
          <option value={StudentInvoiceStatus.Paid}>Paga</option>
          <option value={StudentInvoiceStatus.Cancelled}>Cancelada</option>
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-on-surface-variant"
        />
      </label>
    </section>
  )
}
