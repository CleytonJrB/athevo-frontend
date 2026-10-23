import { BadgeCheck, UserRoundCheck, UserRoundX } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import type { TrainerSummary } from "@/types/trainer"

interface TrainerStatsProps {
  loading?: boolean
  summary: TrainerSummary
}

export function TrainerStats({ loading = false, summary }: TrainerStatsProps) {
  const stats = [
    {
      icon: BadgeCheck,
      label: "Total de professores",
      value: summary.total,
      detail: "Equipe cadastrada",
      tone: "text-primary-container",
    },
    {
      icon: UserRoundCheck,
      label: "Professores ativos",
      value: summary.active,
      detail: "Acesso habilitado",
      tone: "text-success",
    },
    {
      icon: UserRoundX,
      label: "Professores inativos",
      value: summary.inactive,
      detail: "Acesso desabilitado",
      tone: "text-on-surface-variant",
    },
  ]

  return (
    <section
      aria-label="Resumo da equipe técnica"
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      {stats.map((stat) => {
        const Icon = stat.icon

        return (
          <article
            key={stat.label}
            className="rounded-xl border border-surface-container-high bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-on-surface-variant">
                  {stat.label}
                </p>
                {loading ? (
                  <Skeleton className="mt-3 h-9 w-16" />
                ) : (
                  <p className="mt-2 text-4xl leading-none font-bold text-on-surface">
                    {stat.value}
                  </p>
                )}
              </div>
              <span className={`rounded-lg bg-surface-container p-2 ${stat.tone}`}>
                <Icon aria-hidden="true" className="size-5" />
              </span>
            </div>
            <p className="mt-4 text-xs text-on-surface-variant">{stat.detail}</p>
          </article>
        )
      })}
    </section>
  )
}
