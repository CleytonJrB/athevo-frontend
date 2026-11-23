"use client"

import { useState } from "react"
import type { ReactElement, ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { AlertTriangle, FileText, Info, ReceiptText, RotateCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { listMyStudentInvoices } from "@/services/student-finance-service"
import { StudentInvoiceStatus, type StudentInvoice } from "@/types/student-finance"

import { MyFinanceHistory } from "./my-finance-history"
import { MyFinanceSummary } from "./my-finance-summary"
import { MyInvoiceDetailsSheet } from "./my-invoice-details-sheet"
import {
  currencyFormatter,
  formatCompetence,
  formatDate,
} from "./my-finance-utils"

export function MyFinanceDashboard() {
  const { data: session, status: sessionStatus } = useSession()
  const [selectedInvoice, setSelectedInvoice] = useState<StudentInvoice | null>(null)
  const invoicesQuery = useQuery({
    queryKey: ["student-finance", session?.user.tenantId, "my-invoices"],
    queryFn: ({ signal }) =>
      listMyStudentInvoices({ page: 1, pageSize: 100 }, signal),
    enabled: sessionStatus === "authenticated" && Boolean(session?.user.tenantId),
    meta: {
      errorTitle: "Não foi possível carregar seus dados financeiros",
    },
  })

  const invoices = invoicesQuery.data ?? []
  const nextInvoice = [...invoices]
    .filter(
      (invoice) =>
        invoice.balance > 0 && invoice.status !== StudentInvoiceStatus.Cancelled,
    )
    .sort((left, right) => left.dueDate.localeCompare(right.dueDate))[0]

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-on-surface">
            Meu Financeiro
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Consulte suas mensalidades e o histórico de pagamentos.
          </p>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant">
          <Info aria-hidden="true" className="size-3.5" />
          <span>Pagamentos registrados presencialmente na recepção</span>
        </div>
      </header>

      {invoicesQuery.isError ? (
        <FinanceState
          icon={<AlertTriangle />}
          title="Não foi possível carregar seus dados financeiros"
          description="Houve uma oscilação na conexão. Tente novamente em alguns instantes."
          action={
            <Button type="button" onClick={() => invoicesQuery.refetch()}>
              <RotateCw aria-hidden="true" />
              Tentar novamente
            </Button>
          }
          tone="danger"
        />
      ) : invoicesQuery.isPending ? (
        <MyFinanceSkeleton />
      ) : invoices.length === 0 ? (
        <FinanceState
          icon={<ReceiptText />}
          title="Nenhuma fatura encontrada no momento"
          description="Você ainda não possui faturas geradas nesta academia ou seu plano está em processamento."
        />
      ) : (
        <>
          <MyFinanceSummary invoices={invoices} />

          {nextInvoice && (
            <section className="flex flex-col justify-between gap-4 rounded-xl border border-outline-variant bg-surface-container-low p-4 sm:flex-row sm:items-center">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded border border-primary-container/30 bg-primary-container/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary-container">
                    Próxima Fatura
                  </span>
                  <span className="truncate font-mono text-xs text-on-surface-variant">
                    #{nextInvoice.id.slice(0, 8)} • Competência {formatCompetence(nextInvoice.competence)}
                  </span>
                </div>
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <span className="font-mono text-xl font-bold text-on-surface">
                    {currencyFormatter.format(nextInvoice.netAmount)}
                  </span>
                  {nextInvoice.discountAmount > 0 && (
                    <>
                      <span className="font-mono text-xs text-on-surface-variant line-through">
                        {currencyFormatter.format(nextInvoice.grossAmount)}
                      </span>
                      <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-xs text-emerald-400">
                        − {currencyFormatter.format(nextInvoice.discountAmount)} desconto
                      </span>
                    </>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant">
                  Vencimento em <strong className="font-mono text-on-surface">{formatDate(nextInvoice.dueDate)}</strong> ({nextInvoice.planName})
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3 sm:border-l sm:border-outline-variant sm:pl-4">
                <div className="hidden text-right lg:block">
                  <span className="block font-mono text-xs text-on-surface-variant">
                    Academia ativa
                  </span>
                  <span className="block max-w-44 truncate text-xs text-on-surface-variant">
                    {session?.user.tenantName ?? "Academia"}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInvoice(nextInvoice)}
                >
                  <FileText aria-hidden="true" className="text-primary-container" />
                  Ver composição
                </Button>
              </div>
            </section>
          )}

          <MyFinanceHistory
            invoices={invoices}
            onSelectInvoice={setSelectedInvoice}
          />
        </>
      )}

      <MyInvoiceDetailsSheet
        invoice={selectedInvoice}
        onOpenChange={(open) => {
          if (!open) setSelectedInvoice(null)
        }}
      />
    </div>
  )
}

function FinanceState({
  action,
  description,
  icon,
  title,
  tone = "default",
}: {
  action?: ReactNode
  description: string
  icon: ReactElement<{ className?: string }>
  title: string
  tone?: "danger" | "default"
}) {
  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-low px-6 py-16 text-center">
      <span
        className={`mx-auto mb-4 flex size-14 items-center justify-center rounded-full border [&_svg]:size-7 ${
          tone === "danger"
            ? "border-rose-500/20 bg-rose-500/10 text-rose-400"
            : "border-outline-variant bg-surface-container-high text-on-surface-variant"
        }`}
      >
        {icon}
      </span>
      <h2 className="text-lg font-bold text-on-surface">{title}</h2>
      <p className="mx-auto mt-1 max-w-md text-sm text-on-surface-variant">
        {description}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </section>
  )
}

function MyFinanceSkeleton() {
  return (
    <div aria-label="Carregando dados financeiros" className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-36 rounded-xl border border-outline-variant bg-surface-container-low p-4">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="mt-4 h-6 w-3/4" />
            <Skeleton className="mt-2 h-3 w-1/2" />
            <Skeleton className="mt-5 h-3 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-28 w-full rounded-xl" />
      <Skeleton className="h-80 w-full rounded-xl" />
    </div>
  )
}
