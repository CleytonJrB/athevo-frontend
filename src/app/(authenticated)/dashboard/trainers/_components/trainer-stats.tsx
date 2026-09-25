import { BadgeCheck, CheckCircle2 } from "lucide-react"

const stats = [
  {
    label: "Total de Professores",
    value: "32",
    badge: "100% CREF ativo",
    detail: "Equipe ativa",
    tone: "success" as const,
  },
  {
    label: "Em Atendimento Agora",
    value: "14",
    badge: "Turno atual: Tarde",
    detail: "43% do quadro",
    tone: "active" as const,
  },
  {
    label: "Média de Alunos / Prof",
    value: "28",
    badge: "Ideal: 25–30",
    detail: "Equilibrada",
    tone: "balanced" as const,
  },
  {
    label: "Aulas & Plantões Hoje",
    value: "18",
    badge: "Na grade",
    detail: "6 salas ativas",
    tone: "default" as const,
  },
]

export function TrainerStats() {
  return (
    <section aria-label="Resumo da equipe técnica" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="group rounded-xl border border-surface-container-high bg-surface p-6 transition-colors hover:border-outline-variant"
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-on-surface-variant">{stat.label}</p>
            <span
              className={
                stat.tone === "success"
                  ? "inline-flex shrink-0 items-center gap-1 rounded-full border border-success/20 bg-success/10 px-2 py-0.5 text-xs text-success"
                  : stat.tone === "active"
                    ? "shrink-0 rounded-full border border-primary-container/30 bg-primary-container/10 px-2 py-0.5 text-xs text-primary-container"
                    : "shrink-0 rounded-full border border-surface-container-high bg-surface-container-high px-2 py-0.5 text-xs text-on-surface-variant"
              }
            >
              {stat.tone === "success" && <BadgeCheck aria-hidden="true" className="size-3.5" />}
              {stat.badge}
            </span>
          </div>
          <div className="flex items-end justify-between gap-3">
            <p className="flex items-center gap-2 text-4xl leading-none font-bold text-on-surface">
              {stat.value}
              {stat.tone === "active" && (
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                />
              )}
            </p>
            <p
              className={
                stat.tone === "active" || stat.tone === "balanced"
                  ? "flex items-center gap-1 text-xs font-medium text-success"
                  : "text-xs text-on-surface-variant"
              }
            >
              {stat.tone === "balanced" && (
                <CheckCircle2 aria-hidden="true" className="size-3.5" />
              )}
              {stat.detail}
            </p>
          </div>
        </article>
      ))}
    </section>
  )
}
