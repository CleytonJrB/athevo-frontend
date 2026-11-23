"use client"

import { CalendarDays, History, WalletCards } from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { listStudentDiscounts } from "@/services/student-finance-service"
import {
  StudentDiscountRecurrence,
  StudentDiscountType,
  StudentInvoiceStatus,
  type StudentInvoice,
} from "@/types/student-finance"

import type { FinanceInvoiceAction } from "./finance-action-dialog"

interface InvoiceDetailsSheetProps {
  canManage: boolean
  invoice: StudentInvoice | null
  open: boolean
  onAction: (action: FinanceInvoiceAction, invoice: StudentInvoice) => void
  onOpenChange: (open: boolean) => void
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
})

export function InvoiceDetailsSheet({
  canManage,
  invoice,
  open,
  onAction,
  onOpenChange,
}: InvoiceDetailsSheetProps) {
  const discountsQuery = useQuery({
    queryKey: ["student-finance", "discounts", invoice?.enrollmentId],
    queryFn: ({ signal }) => listStudentDiscounts(invoice!.enrollmentId, signal),
    enabled: open && Boolean(invoice?.enrollmentId),
    meta: { errorTitle: "Não foi possível carregar os descontos" },
  })

  if (!invoice) return null

  const canReceive =
    canManage &&
    invoice.balance > 0 &&
    invoice.status !== StudentInvoiceStatus.Cancelled

  function runAction(action: FinanceInvoiceAction) {
    onOpenChange(false)
    onAction(action, invoice!)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full border-border bg-surface sm:max-w-md">
        <SheetHeader className="border-b border-border p-5 pr-12">
          <SheetTitle className="flex items-center gap-2 text-base font-semibold">
            <WalletCards aria-hidden="true" className="size-5 text-primary-container" />
            Fatura #{invoice.id.slice(0, 8)}
          </SheetTitle>
          <SheetDescription>Competência {formatCompetence(invoice.competence)}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-5">
          <section className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
              Dados do aluno
            </p>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-on-surface">{invoice.studentName}</p>
                <p className="truncate text-xs text-on-surface-variant">Aluno da academia</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-on-surface-variant">
                #{invoice.studentTenantUserId.slice(0, 8)}
              </span>
            </div>
            <span className="mt-3 inline-flex rounded border border-border bg-surface-container px-2 py-1 text-xs text-on-surface">
              {invoice.planName}
            </span>
          </section>

          <section className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
                Descontos programados
              </p>
              <span className="text-xs text-on-surface-variant">
                {discountsQuery.data?.length ?? 0} registro(s)
              </span>
            </div>

            {discountsQuery.isPending ? (
              <p className="mt-3 text-xs text-on-surface-variant">Carregando descontos...</p>
            ) : discountsQuery.isError ? (
              <button
                type="button"
                onClick={() => discountsQuery.refetch()}
                className="mt-3 text-xs font-medium text-primary-container hover:underline"
              >
                Tentar carregar novamente
              </button>
            ) : discountsQuery.data?.length ? (
              <ul className="mt-3 space-y-2">
                {discountsQuery.data.map((discount) => (
                  <li key={discount.id} className="rounded-md border border-border bg-surface px-3 py-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-on-surface">{discount.name}</p>
                        <p className="mt-0.5 text-xs text-on-surface-variant">
                          A partir de {formatDate(discount.validFrom)} · {getDiscountRecurrence(discount.recurrence)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-mono text-xs font-semibold text-primary-container">
                          {formatDiscountValue(discount.type, discount.value, discount.currency)}
                        </p>
                        <p className={cn("text-xs", discount.active ? "text-success" : "text-on-surface-variant")}>
                          {getDiscountStatus(discount)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-xs text-on-surface-variant">Nenhum desconto cadastrado para esta matrícula.</p>
            )}
          </section>

          <section className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
              Composição do valor
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <ValueRow label="Valor bruto" value={currencyFormatter.format(invoice.grossAmount)} />
              {invoice.discountAmount > 0 && (
                <ValueRow label="Desconto" value={`− ${currencyFormatter.format(invoice.discountAmount)}`} />
              )}
              <ValueRow label="Valor líquido" value={currencyFormatter.format(invoice.netAmount)} />
              <ValueRow label="Total pago" value={currencyFormatter.format(invoice.paidAmount)} valueClassName="text-success" />
              <div className="border-t border-border pt-2">
                <ValueRow
                  label="Saldo em aberto"
                  value={currencyFormatter.format(invoice.balance)}
                  valueClassName={invoice.balance > 0 ? "text-primary-container" : "text-on-surface"}
                />
              </div>
            </dl>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <section className="rounded-lg border border-border bg-card p-3">
              <CalendarDays aria-hidden="true" className="size-4 text-on-surface-variant" />
              <p className="mt-2 text-xs tracking-wider text-on-surface-variant uppercase">Vencimento</p>
              <p className="mt-1 font-mono text-sm font-semibold text-on-surface">
                {dateFormatter.format(new Date(`${invoice.dueDate}T00:00:00Z`))}
              </p>
              <p className="text-xs text-on-surface-variant">{getDueLabel(invoice)}</p>
            </section>
            <section className="rounded-lg border border-border bg-card p-3">
              <History aria-hidden="true" className="size-4 text-on-surface-variant" />
              <p className="mt-2 text-xs tracking-wider text-on-surface-variant uppercase">Status</p>
              <p className="mt-1 text-sm font-semibold text-primary-container">{getStatusLabel(invoice)}</p>
              <p className="text-xs text-on-surface-variant">Situação atual da fatura</p>
            </section>
          </div>

          <section className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
              Resumo da fatura
            </p>
            <ol className="mt-4 space-y-4 border-l border-border pl-4">
              {invoice.paidAmount > 0 && (
                <HistoryItem title="Total recebido" description={`${currencyFormatter.format(invoice.paidAmount)} registrado na fatura.`} tone="success" />
              )}
              {invoice.discountAmount > 0 && (
                <HistoryItem title="Desconto calculado" description={`${currencyFormatter.format(invoice.discountAmount)} considerado na geração.`} tone="primary" />
              )}
              <HistoryItem title="Fatura gerada" description={`Cobrança da competência ${formatCompetence(invoice.competence)}.`} />
            </ol>
          </section>
        </div>

        {canReceive && (
          <SheetFooter className="grid grid-cols-2 gap-2 border-t border-border bg-card p-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => runAction("discount")}
              className="h-10 w-full border-border bg-transparent text-xs font-semibold text-primary-container hover:bg-surface-container"
            >
              Programar desconto
            </Button>
            <Button
              type="button"
              onClick={() => runAction("payment")}
              className="h-10 w-full bg-primary-container text-xs font-semibold text-black hover:bg-primary-container"
            >
              Registrar pagamento
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

function ValueRow({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-on-surface-variant">{label}</dt>
      <dd className={`font-mono font-medium ${valueClassName ?? "text-on-surface"}`}>{value}</dd>
    </div>
  )
}

function HistoryItem({ title, description, tone = "default" }: { title: string; description: string; tone?: "default" | "primary" | "success" }) {
  return (
    <li className="relative">
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1.5 -left-[1.2rem] size-2 rounded-full",
          tone === "success" && "bg-success",
          tone === "primary" && "bg-primary-container",
          tone === "default" && "bg-on-surface-variant",
        )}
      />
      <p className="text-xs font-medium text-on-surface">{title}</p>
      <p className="mt-0.5 text-xs text-on-surface-variant">{description}</p>
    </li>
  )
}

function getStatusLabel(invoice: StudentInvoice) {
  if (invoice.status === StudentInvoiceStatus.Cancelled) return "Cancelada"
  if (invoice.status === StudentInvoiceStatus.Paid) return "Paga"
  if (invoice.status === StudentInvoiceStatus.PartiallyPaid) return "Parcialmente paga"
  return invoice.overdue ? "Vencida" : "Em aberto"
}

function getDueLabel(invoice: StudentInvoice) {
  if (invoice.status === StudentInvoiceStatus.Cancelled) return "Cancelada"
  if (invoice.status === StudentInvoiceStatus.Paid) return "Liquidada"
  return invoice.overdue ? "Vencida" : "A vencer"
}

function formatCompetence(value: string) {
  const [year, month] = value.split("-")
  return `${month}/${year}`
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`))
}

function formatDiscountValue(
  type: StudentDiscountType,
  value: number,
  currency?: string,
) {
  if (type === StudentDiscountType.Percentage) return `${value}%`
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: currency ?? "BRL",
  }).format(value)
}

function getDiscountRecurrence(recurrence: StudentDiscountRecurrence) {
  return recurrence === StudentDiscountRecurrence.Recurring ? "recorrente" : "uma competência"
}

function getDiscountStatus(discount: {
  active: boolean
  recurrence: StudentDiscountRecurrence
  usedAt?: string
  validUntil?: string
}) {
  if (!discount.active) return "Inativo"
  if (discount.usedAt && discount.recurrence === StudentDiscountRecurrence.OneTime) return "Utilizado"
  if (discount.validUntil && discount.validUntil < new Date().toISOString().slice(0, 10)) return "Expirado"
  return "Ativo"
}
