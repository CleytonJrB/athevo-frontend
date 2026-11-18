"use client"

import { useMemo, useState } from "react"
import { ReceiptText } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DataPagination } from "@/components/ui/data-pagination"
import { appToast } from "@/lib/toast"

import {
  FinanceActionDialog,
  type FinanceAction,
  type FinanceActionPayload,
  type FinanceInvoiceAction,
} from "./finance-action-dialog"
import { FinanceFilters, type InvoiceStatusFilter } from "./finance-filters"
import { FinancePageHeader } from "./finance-page-header"
import { FinanceSummary } from "./finance-summary"
import { InvoiceDetailsSheet } from "./invoice-details-sheet"
import { InvoicesTable } from "./invoices-table"
import { invoices as initialInvoices, type Invoice } from "../_data/invoices"

const pageSize = 5

export function FinanceDashboard() {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [search, setSearch] = useState("")
  const [competence, setCompetence] = useState("11/2026")
  const [status, setStatus] = useState<InvoiceStatusFilter>("all")
  const [delinquentOnly, setDelinquentOnly] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [action, setAction] = useState<FinanceAction | null>(null)
  const [actionInvoiceId, setActionInvoiceId] = useState<string | null>(null)

  const filteredInvoices = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR")

    return invoices.filter((invoice) => {
      const matchesSearch =
        !normalizedSearch ||
        invoice.studentName.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
        invoice.studentEmail.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
        invoice.enrollment.toLocaleLowerCase("pt-BR").includes(normalizedSearch)
      const matchesCompetence = competence === "all" || invoice.competence === competence
      const matchesStatus = status === "all" || invoice.status === status
      const matchesDelinquency = !delinquentOnly || invoice.status === "overdue"

      return matchesSearch && matchesCompetence && matchesStatus && matchesDelinquency
    })
  }, [competence, delinquentOnly, invoices, search, status])

  const pageCount = Math.max(1, Math.ceil(filteredInvoices.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visibleInvoices = filteredInvoices.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  )
  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId) ?? null
  const actionInvoice = invoices.find((invoice) => invoice.id === actionInvoiceId) ?? null
  const hasFilters =
    search.trim().length > 0 || competence !== "11/2026" || status !== "all" || delinquentOnly

  function updateFilter(callback: () => void) {
    callback()
    setPage(1)
  }

  function clearFilters() {
    setSearch("")
    setCompetence("11/2026")
    setStatus("all")
    setDelinquentOnly(false)
    setPage(1)
  }

  function openInvoiceAction(nextAction: FinanceInvoiceAction, invoice: Invoice) {
    setActionInvoiceId(invoice.id)
    setAction(nextAction)
  }

  function openGlobalAction(nextAction: Extract<FinanceAction, "settings" | "generate">) {
    setActionInvoiceId(null)
    setAction(nextAction)
  }

  function closeActionDialog() {
    setAction(null)
    setActionInvoiceId(null)
  }

  function handleActionSubmit(nextAction: FinanceAction, payload: FinanceActionPayload) {
    if (nextAction === "settings") {
      closeActionDialog()
      appToast.success(
        "Configurações salvas",
        `A tolerância financeira foi definida em ${payload.graceDays ?? 0} dias.`,
      )
      return
    }

    if (nextAction === "generate") {
      closeActionDialog()
      appToast.success(
        "Faturas em processamento",
        `O lote da competência ${payload.competence ?? "selecionada"} foi enfileirado.`,
      )
      return
    }

    if (!actionInvoice) return

    const invoiceId = actionInvoice.id
    setInvoices((current) =>
      current.map((invoice) => {
        if (invoice.id !== invoiceId) return invoice

        if (nextAction === "payment") {
          const amount = Math.min(Math.max(payload.amount ?? 0, 0), invoice.openAmount)
          const openAmount = roundMoney(invoice.openAmount - amount)
          return {
            ...invoice,
            paidAmount: roundMoney(invoice.paidAmount + amount),
            openAmount,
            status: openAmount === 0 ? "paid" : "partial",
          }
        }

        if (nextAction === "discount") {
          const amount = Math.min(Math.max(payload.amount ?? 0, 0), invoice.openAmount)
          const openAmount = roundMoney(invoice.openAmount - amount)
          return {
            ...invoice,
            discountAmount: roundMoney((invoice.discountAmount ?? 0) + amount),
            openAmount,
            status: openAmount === 0 ? "paid" : invoice.status,
          }
        }

        if (nextAction === "reversal") {
          const amount = Math.min(
            Math.max(payload.amount ?? 0, 0),
            invoice.paidAmount,
          )
          const paidAmount = roundMoney(invoice.paidAmount - amount)
          const openAmount = roundMoney(
            invoice.openAmount + amount,
          )
          return {
            ...invoice,
            paidAmount,
            openAmount,
            status:
              paidAmount > 0
                ? "partial"
                : isPastDue(invoice.dueDate)
                  ? "overdue"
                  : "open",
          }
        }

        return {
          ...invoice,
          openAmount: 0,
          status: "canceled",
        }
      }),
    )

    closeActionDialog()
    const messages: Record<FinanceInvoiceAction, [string, string]> = {
      payment: ["Pagamento confirmado", "O recebimento foi registrado na fatura."],
      discount: ["Desconto aplicado", "O saldo da fatura foi atualizado."],
      reversal: ["Reversão concluída", "O pagamento voltou para o saldo em aberto."],
      cancel: ["Fatura cancelada", "A cobrança foi encerrada com sucesso."],
    }
    appToast.success(...messages[nextAction])
  }

  return (
    <div className="flex flex-col gap-6">
      <FinancePageHeader
        onGenerateInvoices={() => openGlobalAction("generate")}
        onOpenSettings={() => openGlobalAction("settings")}
      />

      <FinanceSummary />

      <FinanceFilters
        search={search}
        competence={competence}
        status={status}
        delinquentOnly={delinquentOnly}
        onSearchChange={(value) => updateFilter(() => setSearch(value))}
        onCompetenceChange={(value) => updateFilter(() => setCompetence(value))}
        onStatusChange={(value) => updateFilter(() => setStatus(value))}
        onDelinquentOnlyChange={(value) => updateFilter(() => setDelinquentOnly(value))}
        onClear={clearFilters}
      />

      <section
        aria-label="Faturas dos alunos"
        className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/30"
      >
        {filteredInvoices.length === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <span className="mb-5 flex size-14 items-center justify-center rounded-full border border-primary-container/20 bg-primary-container/10 text-primary-container">
              <ReceiptText aria-hidden="true" className="size-7" />
            </span>
            <p className="font-medium text-on-surface">Nenhuma fatura encontrada</p>
            <p className="mt-1 max-w-md text-sm text-on-surface-variant">
              {hasFilters
                ? "Não há cobranças que correspondam aos filtros aplicados."
                : "As faturas geradas aparecerão nesta listagem."}
            </p>
            {hasFilters && (
              <Button type="button" variant="outline" onClick={clearFilters} className="mt-5 border-border bg-transparent">
                Limpar filtros
              </Button>
            )}
          </div>
        ) : (
          <>
            <InvoicesTable
              invoices={visibleInvoices}
              onView={(invoice) => setSelectedInvoiceId(invoice.id)}
              onAction={openInvoiceAction}
            />
            <DataPagination
              page={safePage}
              pageSize={pageSize}
              total={filteredInvoices.length}
              anchorId="finance-invoices-table"
              itemLabel="faturas"
              onPageChange={setPage}
            />
          </>
        )}
      </section>

      <InvoiceDetailsSheet
        invoice={selectedInvoice}
        open={selectedInvoice !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedInvoiceId(null)
        }}
        onAction={openInvoiceAction}
      />

      <FinanceActionDialog
        action={action}
        invoice={actionInvoice}
        onOpenChange={(open) => {
          if (!open) closeActionDialog()
        }}
        onSubmit={handleActionSubmit}
      />
    </div>
  )
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

function isPastDue(date: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(`${date}T00:00:00`) < today
}

