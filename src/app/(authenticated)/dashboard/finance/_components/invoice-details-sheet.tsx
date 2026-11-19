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
import {
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
            <p className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
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
            <p className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
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
              <p className="mt-2 text-[10px] tracking-wider text-on-surface-variant uppercase">Vencimento</p>
              <p className="mt-1 font-mono text-sm font-semibold text-on-surface">
                {dateFormatter.format(new Date(`${invoice.dueDate}T00:00:00Z`))}
              </p>
              <p className="text-[11px] text-on-surface-variant">{getDueLabel(invoice)}</p>
            </section>
            <section className="rounded-lg border border-border bg-card p-3">
              <History aria-hidden="true" className="size-4 text-on-surface-variant" />
              <p className="mt-2 text-[10px] tracking-wider text-on-surface-variant uppercase">Status</p>
              <p className="mt-1 text-sm font-semibold text-primary-container">{getStatusLabel(invoice)}</p>
              <p className="text-[11px] text-on-surface-variant">Situação atual da fatura</p>
            </section>
          </div>

          <section className="rounded-lg border border-border bg-card p-4">
            <p className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
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
              Cadastrar desconto
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
      <p className="mt-0.5 text-[11px] text-on-surface-variant">{description}</p>
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
