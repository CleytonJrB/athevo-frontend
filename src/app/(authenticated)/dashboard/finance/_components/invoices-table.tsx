import {
  Ban,
  Eye,
  MoreVertical,
  Percent,
  WalletCards,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  StudentInvoiceStatus,
  type StudentInvoice,
} from "@/types/student-finance"

import type { FinanceInvoiceAction } from "./finance-action-dialog"

interface InvoicesTableProps {
  canManage: boolean
  invoices: StudentInvoice[]
  onAction: (action: FinanceInvoiceAction, invoice: StudentInvoice) => void
  onView: (invoice: StudentInvoice) => void
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

type InvoicePresentationStatus = "open" | "partial" | "paid" | "overdue" | "canceled"

const statusPresentation: Record<
  InvoicePresentationStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Em aberto",
    className: "border-border bg-surface-container text-on-surface",
  },
  partial: {
    label: "Parcial",
    className:
      "border-primary-container/20 bg-primary-container/10 text-primary-container",
  },
  paid: {
    label: "Paga",
    className: "border-success/20 bg-success/10 text-success",
  },
  overdue: {
    label: "Vencida",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  },
  canceled: {
    label: "Cancelada",
    className: "border-border bg-surface-container text-on-surface-variant",
  },
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function InvoicesTable({ canManage, invoices, onAction, onView }: InvoicesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table id="finance-invoices-table" className="w-full min-w-260 border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-card/60">
            {[
              ["Aluno", "text-left"],
              ["Plano e competência", "text-left"],
              ["Vencimento", "text-left"],
              ["Valor faturado", "text-right"],
              ["Saldo aberto", "text-right"],
              ["Status", "text-center"],
              ["Ações", "text-right"],
            ].map(([label, alignment]) => (
              <th
                key={label}
                scope="col"
                className={cn(
                  "px-4 py-3 text-xs font-semibold tracking-wider text-on-surface-variant uppercase",
                  alignment,
                )}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border text-sm">
          {invoices.map((invoice) => {
            const presentationStatus = getPresentationStatus(invoice)
            const status = statusPresentation[presentationStatus]
            const canceled = invoice.status === StudentInvoiceStatus.Cancelled
            const canReceive = canManage && invoice.balance > 0 && !canceled

            return (
              <tr
                key={invoice.id}
                className={cn(
                  "group cursor-pointer transition-colors hover:bg-card/80 focus-within:bg-card/80",
                  invoice.overdue && "bg-rose-950/10",
                  canceled && "opacity-60",
                )}
                onClick={() => onView(invoice)}
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                        invoice.overdue
                          ? "border-rose-800/40 bg-rose-900/30 text-rose-300"
                          : invoice.status === StudentInvoiceStatus.Paid
                            ? "border-success/20 bg-success/10 text-success"
                            : "border-border bg-surface-container text-primary-container",
                      )}
                    >
                      {getInitials(invoice.studentName)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn("truncate font-medium text-on-surface", canceled && "line-through")}>
                          {invoice.studentName}
                        </p>
                        <span className="shrink-0 font-mono text-xs text-on-surface-variant">
                          #{invoice.studentTenantUserId.slice(0, 8)}
                        </span>
                      </div>
                      <p className="truncate text-xs text-on-surface-variant">
                        Identificação do aluno
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <p className="font-medium text-on-surface">{invoice.planName}</p>
                  <p className="font-mono text-xs text-on-surface-variant">{formatCompetence(invoice.competence)}</p>
                </td>
                <td className="px-4 py-3.5">
                  <p
                    className={cn(
                      "font-mono text-on-surface",
                      invoice.overdue && "font-medium text-rose-400",
                    )}
                  >
                    {dateFormatter.format(new Date(`${invoice.dueDate}T00:00:00Z`))}
                  </p>
                  <p className={cn("text-xs text-on-surface-variant", invoice.overdue && "text-rose-400")}>
                    {getDueLabel(invoice)}
                  </p>
                </td>
                <td className="px-4 py-3.5 text-right font-mono">
                  <p className="font-medium text-on-surface">
                    {currencyFormatter.format(invoice.netAmount)}
                  </p>
                  {invoice.paidAmount > 0 && invoice.status === StudentInvoiceStatus.PartiallyPaid && (
                    <p className="text-xs text-success">
                      Pago: {currencyFormatter.format(invoice.paidAmount)}
                    </p>
                  )}
                  {invoice.discountAmount ? (
                    <p className="text-xs text-on-surface-variant">
                      Desc.: {currencyFormatter.format(invoice.discountAmount)}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-semibold">
                  <span
                    className={cn(
                      invoice.overdue && "text-rose-400",
                      invoice.status === StudentInvoiceStatus.PartiallyPaid && "text-primary-container",
                      invoice.balance === 0 && "font-normal text-on-surface-variant",
                    )}
                  >
                    {currencyFormatter.format(invoice.balance)}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-xs font-medium", status.className)}>
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right" onClick={(event) => event.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Ações da fatura de ${invoice.studentName}`}
                          className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                        />
                      }
                    >
                      <MoreVertical aria-hidden="true" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem onClick={() => onView(invoice)}>
                        <Eye aria-hidden="true" />
                        Ver detalhes
                      </DropdownMenuItem>
                      {canReceive && (
                        <DropdownMenuItem onClick={() => onAction("payment", invoice)} className="text-success">
                          <WalletCards aria-hidden="true" />
                          Registrar pagamento
                        </DropdownMenuItem>
                      )}
                      {canReceive && (
                        <DropdownMenuItem onClick={() => onAction("discount", invoice)} className="text-primary-container">
                          <Percent aria-hidden="true" />
                          Programar desconto
                        </DropdownMenuItem>
                      )}
                      {canManage && !canceled && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem variant="destructive" onClick={() => onAction("cancel", invoice)}>
                            <Ban aria-hidden="true" />
                            Cancelar fatura
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function getPresentationStatus(invoice: StudentInvoice): InvoicePresentationStatus {
  if (invoice.status === StudentInvoiceStatus.Cancelled) return "canceled"
  if (invoice.status === StudentInvoiceStatus.Paid) return "paid"
  if (invoice.status === StudentInvoiceStatus.PartiallyPaid) return "partial"
  return invoice.overdue ? "overdue" : "open"
}

function getDueLabel(invoice: StudentInvoice) {
  if (invoice.status === StudentInvoiceStatus.Cancelled) return "Cancelada"
  if (invoice.status === StudentInvoiceStatus.Paid) return "Liquidada"
  if (invoice.overdue) return "Vencida"
  return "A vencer"
}

function formatCompetence(value: string) {
  const [year, month] = value.split("-")
  return `${month}/${year}`
}

