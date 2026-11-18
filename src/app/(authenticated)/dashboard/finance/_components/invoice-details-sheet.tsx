import { CalendarDays, History, WalletCards } from "lucide-react"

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

import type { FinanceInvoiceAction } from "./finance-action-dialog"
import type { Invoice } from "../_data/invoices"

interface InvoiceDetailsSheetProps {
  invoice: Invoice | null
  open: boolean
  onAction: (action: FinanceInvoiceAction, invoice: Invoice) => void
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
  invoice,
  open,
  onAction,
  onOpenChange,
}: InvoiceDetailsSheetProps) {
  if (!invoice) return null

  const canReceive = invoice.openAmount > 0 && invoice.status !== "canceled"
  const canReverse = invoice.paidAmount > 0 && invoice.status !== "canceled"
  const actionCount = Number(canReverse) + Number(canReceive) * 2

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
            Fatura #{invoice.id.replace("invoice-", "FAT-2026-")}
          </SheetTitle>
          <SheetDescription>Competência {invoice.competence}</SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 pb-5">
          <section className="rounded-lg border border-border bg-card p-4">
            <p className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
              Dados do aluno
            </p>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold text-on-surface">{invoice.studentName}</p>
                <p className="truncate text-xs text-on-surface-variant">{invoice.studentEmail}</p>
              </div>
              <span className="shrink-0 font-mono text-xs text-on-surface-variant">
                #{invoice.enrollment}
              </span>
            </div>
            <span className="mt-3 inline-flex rounded border border-border bg-surface-container px-2 py-1 text-xs text-on-surface">
              {invoice.planName}
            </span>
          </section>

          <section className="rounded-lg border border-border bg-card p-4">
            <p className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
              Composição do valor
            </p>
            <dl className="mt-3 space-y-2 text-sm">
              <ValueRow label="Valor faturado" value={currencyFormatter.format(invoice.billedAmount)} />
              {invoice.discountAmount ? (
                <ValueRow label="Desconto" value={`− ${currencyFormatter.format(invoice.discountAmount)}`} />
              ) : null}
              <ValueRow label="Total pago" value={currencyFormatter.format(invoice.paidAmount)} valueClassName="text-success" />
              <div className="border-t border-border pt-2">
                <ValueRow
                  label="Saldo em aberto"
                  value={currencyFormatter.format(invoice.openAmount)}
                  valueClassName={invoice.openAmount > 0 ? "text-primary-container" : "text-on-surface"}
                />
              </div>
            </dl>
          </section>

          <div className="grid grid-cols-2 gap-3">
            <section className="rounded-lg border border-border bg-card p-3">
              <CalendarDays aria-hidden="true" className="size-4 text-on-surface-variant" />
              <p className="mt-2 text-[10px] tracking-wider text-on-surface-variant uppercase">Vencimento</p>
              <p className="mt-1 font-mono text-sm font-semibold text-on-surface">
                {dateFormatter.format(new Date(`${invoice.dueDate}T00:00:00Z`))}
              </p>
              <p className="text-[11px] text-on-surface-variant">{invoice.dueLabel}</p>
            </section>
            <section className="rounded-lg border border-border bg-card p-3">
              <History aria-hidden="true" className="size-4 text-on-surface-variant" />
              <p className="mt-2 text-[10px] tracking-wider text-on-surface-variant uppercase">Status</p>
              <p className="mt-1 text-sm font-semibold text-primary-container">
                {getStatusLabel(invoice.status)}
              </p>
              <p className="text-[11px] text-on-surface-variant">Atualizado no histórico</p>
            </section>
          </div>

          <section className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
                Histórico de eventos
              </p>
              <span className="text-[10px] text-on-surface-variant">Auditoria</span>
            </div>
            <ol className="mt-4 space-y-4 border-l border-border pl-4">
              {invoice.paidAmount > 0 && (
                <HistoryItem title="Pagamento registrado" description={`${currencyFormatter.format(invoice.paidAmount)} conciliado na fatura.`} tone="success" />
              )}
              {invoice.discountAmount ? (
                <HistoryItem title="Desconto aplicado" description={`${currencyFormatter.format(invoice.discountAmount)} concedido pela gestão.`} tone="primary" />
              ) : null}
              <HistoryItem title="Fatura gerada" description={`Cobrança da competência ${invoice.competence}.`} />
            </ol>
          </section>
        </div>

        <SheetFooter
          className={cn(
            "grid gap-2 border-t border-border bg-card p-3",
            actionCount === 1 && "grid-cols-1",
            actionCount === 2 && "grid-cols-2",
            actionCount === 3 && "grid-cols-3",
          )}
        >
          {canReverse && (
            <Button
              type="button"
              variant="outline"
              onClick={() => runAction("reversal")}
              className="h-11 w-full whitespace-normal border-border bg-transparent px-1.5 text-center text-[11px] leading-tight font-semibold text-primary-container hover:bg-surface-container"
            >
              Reverter Pagamento
            </Button>
          )}
          {canReceive && (
            <Button
              type="button"
              variant="outline"
              onClick={() => runAction("discount")}
              className="h-11 w-full whitespace-normal border-border bg-transparent px-1.5 text-center text-[11px] leading-tight font-semibold text-primary-container hover:bg-surface-container"
            >
              Aplicar Desconto
            </Button>
          )}
          {canReceive && (
            <Button
              type="button"
              onClick={() => runAction("payment")}
              className="h-11 w-full whitespace-normal bg-primary-container px-1.5 text-center text-[11px] leading-tight font-semibold text-black hover:bg-primary-container"
            >
              Registrar Pagamento
            </Button>
          )}
        </SheetFooter>
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
        className={`absolute top-1.5 -left-[1.2rem] size-2 rounded-full ${
          tone === "success" ? "bg-success" : tone === "primary" ? "bg-primary-container" : "bg-on-surface-variant"
        }`}
      />
      <p className="text-xs font-medium text-on-surface">{title}</p>
      <p className="mt-0.5 text-[11px] text-on-surface-variant">{description}</p>
    </li>
  )
}

function getStatusLabel(status: Invoice["status"]) {
  return {
    open: "Em aberto",
    partial: "Parcialmente paga",
    paid: "Paga",
    overdue: "Vencida",
    canceled: "Cancelada",
  }[status]
}

