"use client"

import { useMemo, useState } from "react"
import { ChevronRight, RotateCcw, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StudentInvoiceStatus, type StudentInvoice } from "@/types/student-finance"

import { InvoiceStatusBadge } from "./invoice-status-badge"
import {
  currencyFormatter,
  formatCompetence,
  formatDate,
} from "./my-finance-utils"

type StatusFilter = "all" | "open" | "overdue" | "paid"

export function MyFinanceHistory({
  invoices,
  onSelectInvoice,
}: {
  invoices: StudentInvoice[]
  onSelectInvoice: (invoice: StudentInvoice) => void
}) {
  const [search, setSearch] = useState("")
  const [year, setYear] = useState("all")
  const [status, setStatus] = useState<StatusFilter>("all")

  const years = useMemo(
    () =>
      [...new Set(invoices.map((invoice) => invoice.competence.slice(0, 4)))].sort(
        (left, right) => right.localeCompare(left),
      ),
    [invoices],
  )

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR")

    return invoices.filter((invoice) => {
      const matchesSearch =
        !normalizedSearch ||
        formatCompetence(invoice.competence)
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch) ||
        invoice.planName.toLocaleLowerCase("pt-BR").includes(normalizedSearch)
      const matchesYear = year === "all" || invoice.competence.startsWith(year)
      const matchesStatus =
        status === "all" ||
        (status === "open" &&
          !invoice.overdue &&
          invoice.status !== StudentInvoiceStatus.Paid &&
          invoice.status !== StudentInvoiceStatus.Cancelled) ||
        (status === "overdue" && invoice.overdue) ||
        (status === "paid" && invoice.status === StudentInvoiceStatus.Paid)

      return matchesSearch && matchesYear && matchesStatus
    })
  }, [invoices, search, status, year])

  function resetFilters() {
    setSearch("")
    setYear("all")
    setStatus("all")
  }

  return (
    <section className="space-y-3" aria-labelledby="invoice-history-title">
      <div className="flex flex-col justify-between gap-4 pt-2 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <h2 id="invoice-history-title" className="text-base font-bold text-on-surface">
            Histórico de Faturas
          </h2>
          <span className="rounded-full border border-outline-variant bg-surface-container-high px-2.5 py-0.5 font-mono text-xs text-on-surface-variant">
            {filteredInvoices.length} {filteredInvoices.length === 1 ? "registro" : "registros"}
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative min-w-0 sm:w-52">
            <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-on-surface-variant" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar competência..."
              aria-label="Buscar fatura por competência ou plano"
              className="h-8 bg-surface-container-low pl-8 font-mono text-xs shadow-none"
            />
          </div>
          <select
            value={year}
            onChange={(event) => setYear(event.target.value)}
            aria-label="Filtrar faturas por ano"
            className="h-8 rounded-lg border border-outline-variant bg-surface-container-low px-2.5 font-mono text-xs text-on-surface outline-none focus:border-primary-container"
          >
            <option value="all">Ano: Todos</option>
            {years.map((availableYear) => (
              <option key={availableYear} value={availableYear}>
                {availableYear}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            aria-label="Filtrar faturas por situação"
            className="h-8 rounded-lg border border-outline-variant bg-surface-container-low px-2.5 text-xs text-on-surface outline-none focus:border-primary-container"
          >
            <option value="all">Status: Todos</option>
            <option value="paid">Pagas</option>
            <option value="open">Em aberto</option>
            <option value="overdue">Vencidas</option>
          </select>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            title="Limpar filtros"
            aria-label="Limpar filtros"
            onClick={resetFilters}
          >
            <RotateCcw aria-hidden="true" />
          </Button>
        </div>
      </div>

      {filteredInvoices.length === 0 ? (
        <div className="rounded-xl border border-outline-variant bg-surface-container-low px-6 py-12 text-center">
          <p className="font-medium text-on-surface">Nenhuma fatura encontrada</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Ajuste os filtros para consultar outro período.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low md:block">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-outline-variant bg-surface-container-high/50 text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
                  <th className="px-5 py-3">Competência</th>
                  <th className="px-5 py-3">Vencimento</th>
                  <th className="px-5 py-3">Valor</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60">
                {filteredInvoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="group cursor-pointer transition-colors hover:bg-surface-container-high/40"
                    onClick={() => onSelectInvoice(invoice)}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-on-surface transition-colors group-hover:text-primary-container">
                        {formatCompetence(invoice.competence)}
                      </p>
                      <p className="mt-0.5 font-mono text-xs text-on-surface-variant">
                        #{invoice.id.slice(0, 8)} • {invoice.planName}
                      </p>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-on-surface">
                      {formatDate(invoice.dueDate)}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="font-mono font-semibold text-on-surface">
                        {currencyFormatter.format(invoice.netAmount)}
                      </p>
                      {invoice.discountAmount > 0 && (
                        <p className="mt-0.5 font-mono text-xs text-emerald-400">
                          − {currencyFormatter.format(invoice.discountAmount)} desc.
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <InvoiceStatusBadge invoice={invoice} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs text-on-surface-variant transition-colors hover:text-on-surface"
                        onClick={(event) => {
                          event.stopPropagation()
                          onSelectInvoice(invoice)
                        }}
                      >
                        Detalhes
                        <ChevronRight aria-hidden="true" className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 md:hidden">
            {filteredInvoices.map((invoice) => (
              <button
                key={invoice.id}
                type="button"
                onClick={() => onSelectInvoice(invoice)}
                className="w-full rounded-xl border border-outline-variant bg-surface-container-low p-4 text-left transition-colors hover:border-on-surface-variant/50"
              >
                <span className="flex items-start justify-between gap-3">
                  <span>
                    <span className="block text-xs font-semibold text-on-surface">
                      {formatCompetence(invoice.competence)}
                    </span>
                    <span className="mt-0.5 block font-mono text-xs text-on-surface-variant">
                      #{invoice.id.slice(0, 8)} • {invoice.planName}
                    </span>
                  </span>
                  <InvoiceStatusBadge invoice={invoice} />
                </span>
                <span className="mt-3 flex items-center justify-between border-t border-outline-variant/60 pt-3 text-xs">
                  <span className="font-mono text-on-surface-variant">
                    Venc. {formatDate(invoice.dueDate)}
                  </span>
                  <span className="font-mono font-semibold text-on-surface">
                    {currencyFormatter.format(invoice.netAmount)}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
