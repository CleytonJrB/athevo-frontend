import { CircleAlert, ReceiptText, WalletCards } from "lucide-react"

import type { StudentInvoice } from "@/types/student-finance"

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export function FinanceSummary({ invoices }: { invoices: StudentInvoice[] }) {
  const billed = invoices.reduce((total, invoice) => total + invoice.netAmount, 0)
  const received = invoices.reduce((total, invoice) => total + invoice.paidAmount, 0)
  const open = invoices.reduce((total, invoice) => total + invoice.balance, 0)
  const overdue = invoices.filter((invoice) => invoice.overdue)
  const overdueAmount = overdue.reduce((total, invoice) => total + invoice.balance, 0)

  const summary = [
    {
      label: "Faturado nesta página",
      value: currencyFormatter.format(billed),
      detail: `${invoices.length} fatura(s) carregada(s)`,
      icon: ReceiptText,
      valueClassName: "text-on-surface",
      detailClassName: "text-on-surface-variant",
    },
    {
      label: "Recebido nesta página",
      value: currencyFormatter.format(received),
      detail: "Pagamentos registrados",
      icon: ReceiptText,
      valueClassName: "text-success",
      detailClassName: "text-on-surface-variant",
    },
    {
      label: "Em aberto nesta página",
      value: currencyFormatter.format(open),
      detail: "Saldo das faturas carregadas",
      icon: WalletCards,
      valueClassName: "text-primary-container",
      detailClassName: "text-on-surface-variant",
    },
    {
      label: "Vencido nesta página",
      value: currencyFormatter.format(overdueAmount),
      detail: `${overdue.length} fatura(s) vencida(s)`,
      icon: CircleAlert,
      valueClassName: "text-rose-400",
      detailClassName: "text-rose-400",
    },
  ]

  return (
    <section aria-label="Resumo financeiro da página" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summary.map((item) => {
        const Icon = item.icon
        return (
          <article key={item.label} className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-outline-variant">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold tracking-wider text-on-surface-variant uppercase">
                  {item.label}
                </p>
                <p className={`mt-2 truncate font-mono text-2xl font-bold ${item.valueClassName}`}>
                  {item.value}
                </p>
              </div>
              <span className="rounded-lg bg-surface-container p-2 text-on-surface-variant">
                <Icon aria-hidden="true" className="size-5" />
              </span>
            </div>
            <p className={`mt-3 text-xs ${item.detailClassName}`}>{item.detail}</p>
          </article>
        )
      })}
    </section>
  )
}
