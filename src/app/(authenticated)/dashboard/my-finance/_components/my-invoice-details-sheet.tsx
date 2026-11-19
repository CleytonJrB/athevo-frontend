import { Building2, CalendarDays, CircleDollarSign, ReceiptText } from "lucide-react"
import type { ReactElement } from "react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { StudentInvoice } from "@/types/student-finance"

import { InvoiceStatusBadge } from "./invoice-status-badge"
import {
  currencyFormatter,
  formatCompetence,
  formatDate,
} from "./my-finance-utils"

export function MyInvoiceDetailsSheet({
  invoice,
  onOpenChange,
}: {
  invoice: StudentInvoice | null
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Sheet open={invoice !== null} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-outline-variant bg-surface sm:max-w-lg">
        {invoice && (
          <>
            <SheetHeader className="border-b border-outline-variant pr-10">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-lg border border-primary-container/25 bg-primary-container/10 text-primary-container">
                  <ReceiptText aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <SheetTitle>Composição da fatura</SheetTitle>
                  <SheetDescription>
                    #{invoice.id.slice(0, 8)} • {formatCompetence(invoice.competence)}
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="space-y-6 p-5">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-outline-variant bg-surface-container-low p-4">
                <div>
                  <p className="text-xs text-on-surface-variant">Situação</p>
                  <div className="mt-2">
                    <InvoiceStatusBadge invoice={invoice} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-on-surface-variant">Saldo atual</p>
                  <p className="mt-1 font-mono text-xl font-bold text-on-surface">
                    {currencyFormatter.format(invoice.balance)}
                  </p>
                </div>
              </div>

              <section aria-labelledby="invoice-values-title">
                <h3 id="invoice-values-title" className="mb-3 text-sm font-semibold text-on-surface">
                  Valores
                </h3>
                <div className="divide-y divide-outline-variant/60 rounded-xl border border-outline-variant bg-surface-container-low px-4">
                  <ValueRow label="Valor do plano" value={currencyFormatter.format(invoice.grossAmount)} />
                  <ValueRow label="Descontos" value={`− ${currencyFormatter.format(invoice.discountAmount)}`} tone="success" />
                  <ValueRow label="Valor da fatura" value={currencyFormatter.format(invoice.netAmount)} strong />
                  <ValueRow label="Total pago" value={currencyFormatter.format(invoice.paidAmount)} tone="success" />
                  <ValueRow label="Saldo pendente" value={currencyFormatter.format(invoice.balance)} strong />
                </div>
              </section>

              <section aria-labelledby="invoice-data-title">
                <h3 id="invoice-data-title" className="mb-3 text-sm font-semibold text-on-surface">
                  Informações da cobrança
                </h3>
                <div className="space-y-3 rounded-xl border border-outline-variant bg-surface-container-low p-4 text-sm">
                  <InfoRow icon={<Building2 />} label="Plano" value={invoice.planName} />
                  <InfoRow icon={<CalendarDays />} label="Vencimento" value={formatDate(invoice.dueDate)} />
                  <InfoRow icon={<CircleDollarSign />} label="Forma de pagamento" value="Pagamento registrado na recepção" />
                </div>
              </section>

              <p className="rounded-lg border border-outline-variant bg-surface-container-high/40 p-3 text-xs leading-relaxed text-on-surface-variant">
                Para registrar ou revisar um pagamento, procure a recepção da academia.
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

function ValueRow({
  label,
  strong = false,
  tone,
  value,
}: {
  label: string
  strong?: boolean
  tone?: "success"
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 text-sm">
      <span className="text-on-surface-variant">{label}</span>
      <span className={`font-mono ${strong ? "font-bold text-on-surface" : tone === "success" ? "text-emerald-400" : "text-on-surface"}`}>
        {value}
      </span>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactElement<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-primary-container [&_svg]:size-4">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-on-surface-variant">{label}</p>
        <p className="truncate font-medium text-on-surface">{value}</p>
      </div>
    </div>
  )
}
