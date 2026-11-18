import {
  Ban,
  Eye,
  MoreVertical,
  Percent,
  RotateCcw,
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

import type { FinanceInvoiceAction } from "./finance-action-dialog"
import type { Invoice, InvoiceStatus } from "../_data/invoices"

interface InvoicesTableProps {
  invoices: Invoice[]
  onAction: (action: FinanceInvoiceAction, invoice: Invoice) => void
  onView: (invoice: Invoice) => void
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

const statusPresentation: Record<
  InvoiceStatus,
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

export function InvoicesTable({ invoices, onAction, onView }: InvoicesTableProps) {
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
                  "px-4 py-3 text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase",
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
            const status = statusPresentation[invoice.status]
            const canceled = invoice.status === "canceled"
            const canReceive = invoice.openAmount > 0 && !canceled
            const canReverse = invoice.paidAmount > 0 && !canceled

            return (
              <tr
                key={invoice.id}
                className={cn(
                  "group cursor-pointer transition-colors hover:bg-card/80 focus-within:bg-card/80",
                  invoice.status === "overdue" && "bg-rose-950/10",
                  canceled && "opacity-60",
                )}
                onClick={() => onView(invoice)}
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                        invoice.status === "overdue"
                          ? "border-rose-800/40 bg-rose-900/30 text-rose-300"
                          : invoice.status === "paid"
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
                        <span className="shrink-0 font-mono text-[10px] text-on-surface-variant">
                          #{invoice.enrollment}
                        </span>
                      </div>
                      <p className="truncate text-xs text-on-surface-variant">
                        {invoice.studentEmail}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <p className="font-medium text-on-surface">{invoice.planName}</p>
                  <p className="font-mono text-xs text-on-surface-variant">{invoice.competence}</p>
                </td>
                <td className="px-4 py-3.5">
                  <p
                    className={cn(
                      "font-mono text-on-surface",
                      invoice.status === "overdue" && "font-medium text-rose-400",
                    )}
                  >
                    {dateFormatter.format(new Date(`${invoice.dueDate}T00:00:00Z`))}
                  </p>
                  <p className={cn("text-[11px] text-on-surface-variant", invoice.status === "overdue" && "text-rose-400")}>
                    {invoice.dueLabel}
                  </p>
                </td>
                <td className="px-4 py-3.5 text-right font-mono">
                  <p className="font-medium text-on-surface">
                    {currencyFormatter.format(invoice.billedAmount)}
                  </p>
                  {invoice.paidAmount > 0 && invoice.status === "partial" && (
                    <p className="text-[11px] text-success">
                      Pago: {currencyFormatter.format(invoice.paidAmount)}
                    </p>
                  )}
                  {invoice.discountAmount ? (
                    <p className="text-[11px] text-on-surface-variant">
                      Desc.: {currencyFormatter.format(invoice.discountAmount)}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-3.5 text-right font-mono font-semibold">
                  <span
                    className={cn(
                      invoice.status === "overdue" && "text-rose-400",
                      invoice.status === "partial" && "text-primary-container",
                      invoice.openAmount === 0 && "font-normal text-on-surface-variant",
                    )}
                  >
                    {currencyFormatter.format(invoice.openAmount)}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className={cn("inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium", status.className)}>
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
                          Aplicar desconto
                        </DropdownMenuItem>
                      )}
                      {canReverse && (
                        <DropdownMenuItem onClick={() => onAction("reversal", invoice)} className="text-amber-400">
                          <RotateCcw aria-hidden="true" />
                          Reverter pagamento
                        </DropdownMenuItem>
                      )}
                      {!canceled && (
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

