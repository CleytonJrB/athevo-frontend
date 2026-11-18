import { CircleAlert, ReceiptText, TrendingUp, WalletCards } from "lucide-react"

const summary = [
  {
    label: "Receita prevista",
    value: "R$ 54.890,00",
    detail: "+8,2% vs. mês anterior",
    icon: TrendingUp,
    valueClassName: "text-on-surface",
    detailClassName: "text-success",
  },
  {
    label: "Total recebido",
    value: "R$ 38.450,00",
    detail: "70,05% quitado · 182 faturas",
    icon: ReceiptText,
    valueClassName: "text-success",
    detailClassName: "text-on-surface-variant",
  },
  {
    label: "Saldo em aberto",
    value: "R$ 11.240,00",
    detail: "48 faturas a vencer",
    icon: WalletCards,
    valueClassName: "text-primary-container",
    detailClassName: "text-on-surface-variant",
  },
  {
    label: "Inadimplência",
    value: "19 alunos",
    detail: "R$ 5.200,00 vencido · 4,4%",
    icon: CircleAlert,
    valueClassName: "text-rose-400",
    detailClassName: "text-rose-400",
  },
]

export function FinanceSummary() {
  return (
    <section
      aria-label="Resumo financeiro"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {summary.map((item) => {
        const Icon = item.icon

        return (
          <article
            key={item.label}
            className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-outline-variant"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold tracking-wider text-on-surface-variant uppercase">
                  {item.label}
                </p>
                <p
                  className={`mt-2 truncate font-mono text-2xl font-bold tracking-tight ${item.valueClassName}`}
                >
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

