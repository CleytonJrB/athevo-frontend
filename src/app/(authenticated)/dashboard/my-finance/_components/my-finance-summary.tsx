import { Check, CircleDollarSign, Clock3 } from "lucide-react"
import type { ReactNode } from "react"

import type { StudentInvoice } from "@/types/student-finance"

import {
  currencyFormatter,
  formatCompetence,
  formatDate,
  getInvoiceTone,
} from "./my-finance-utils"

export function MyFinanceSummary({ invoices }: { invoices: StudentInvoice[] }) {
  const pendingInvoices = invoices.filter(
    (invoice) => invoice.balance > 0 && getInvoiceTone(invoice) !== "cancelled",
  )
  const nextInvoice = [...pendingInvoices].sort((left, right) =>
    left.dueDate.localeCompare(right.dueDate),
  )[0]
  const openBalance = pendingInvoices.reduce(
    (total, invoice) => total + invoice.balance,
    0,
  )
  const hasOverdueInvoice = pendingInvoices.some((invoice) => invoice.overdue)
  const latestPlan = invoices[0]?.planName

  return (
    <section aria-label="Resumo financeiro" className="grid gap-4 md:grid-cols-3">
      <SummaryCard
        label="Situação atual"
        icon={<Check className="size-3" />}
        badge={hasOverdueInvoice ? "Com pendência" : "Em dia"}
        badgeTone={hasOverdueInvoice ? "danger" : "success"}
        title={hasOverdueInvoice ? "Pagamento pendente" : "Pagamentos em dia"}
        description={
          hasOverdueInvoice
            ? "Existe uma mensalidade vencida"
            : "Sem pendências no cadastro"
        }
        footerLabel="Plano ativo:"
        footerValue={latestPlan ?? "Não informado"}
      />

      <SummaryCard
        label="Próxima mensalidade"
        icon={<Clock3 className="size-3" />}
        badge={nextInvoice ? getNextInvoiceBadge(nextInvoice) : "Sem cobrança"}
        badgeTone={nextInvoice?.overdue ? "danger" : "info"}
        title={nextInvoice ? currencyFormatter.format(nextInvoice.balance) : "—"}
        description={
          nextInvoice
            ? `Vencimento em ${formatDate(nextInvoice.dueDate)}`
            : "Nenhuma mensalidade pendente"
        }
        footerLabel="Competência:"
        footerValue={nextInvoice ? formatCompetence(nextInvoice.competence) : "—"}
      />

      <SummaryCard
        label="Saldo em aberto"
        icon={<CircleDollarSign className="size-3" />}
        badge={openBalance > 0 ? "Pendente" : "Quitado"}
        badgeTone={openBalance > 0 ? "warning" : "success"}
        title={currencyFormatter.format(openBalance)}
        description={
          openBalance > 0 ? `${pendingInvoices.length} fatura(s) pendente(s)` : "Nenhuma fatura pendente"
        }
        footerLabel="Situação:"
        footerValue={openBalance > 0 ? "Regularize na recepção" : "Acesso regularizado"}
      />
    </section>
  )
}

function getNextInvoiceBadge(invoice: StudentInvoice) {
  if (invoice.overdue) return "Vencida"
  return "Em aberto"
}

function SummaryCard({
  badge,
  badgeTone,
  description,
  footerLabel,
  footerValue,
  icon,
  label,
  title,
}: {
  badge: string
  badgeTone: "danger" | "info" | "success" | "warning"
  description: string
  footerLabel: string
  footerValue: string
  icon: ReactNode
  label: string
  title: string
}) {
  const toneClasses = {
    danger: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    info: "border-blue-500/30 bg-blue-500/10 text-blue-400",
    success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-400",
  }

  return (
    <article className="flex min-h-36 flex-col justify-between rounded-xl border border-outline-variant bg-surface-container-low p-3.5 transition-colors hover:border-on-surface-variant/40">
      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-[11px] font-medium tracking-wider text-on-surface-variant uppercase">
            {label}
          </span>
          <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${toneClasses[badgeTone]}`}>
            {icon}
            {badge}
          </span>
        </div>
        <p className="text-lg font-bold text-on-surface">{title}</p>
        <p className="mt-0.5 text-xs text-on-surface-variant">{description}</p>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-outline-variant/60 pt-3 text-xs">
        <span className="font-mono text-on-surface-variant">{footerLabel}</span>
        <span className="truncate text-right font-mono font-medium text-on-surface">
          {footerValue}
        </span>
      </div>
    </article>
  )
}
