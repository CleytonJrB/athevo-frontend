import React from "react";

import {
  TrendingUp
} from "lucide-react";

const cards = [
  { label: "Alunos ativos", value: "2.184" },
  { label: "Check-ins hoje", value: "412" },
  { label: "Receita do mês", value: "R$ 82k" },
];

const statistics = [42, 56, 50, 68, 72, 64, 88];

export default function ExempAthevo() {
  return (
    // <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(250,204,21,0.18),transparent_60%)] blur-3xl" />
    <div className="relative w-full h-1vh rounded-[28px] border border-white/8 bg-white/5 p-2 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="overflow-hidden rounded-[22px] border border-white/6 bg-zinc-950">
        <div className="border-b border-white/6 bg-zinc-900/80 px-5 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-zinc-300">Painel executivo</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-white">Performance da academia</p>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
              Receita +18,2%
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {cards.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/6 bg-zinc-900 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/6 bg-zinc-900 p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-300">Retenção semanal</p>
                  <p className="mt-1 text-xs text-zinc-500">Últimos 7 dias</p>
                </div>
                <p className="text-sm font-semibold text-yellow-300">94%</p>
              </div>
              <div className="mt-6 flex gap-3">
                {statistics.map((height, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex h-44 w-full flex-col justify-end">
                      <div
                        className="w-[70%] rounded-t-md bg-linear-to-t from-yellow-500 via-yellow-300 to-yellow-100"
                        style={{ height: `${height}%` }}
                      />
                    </div>

                    <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">
                      {`D${index + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/6 bg-zinc-900 p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-400">
                  <TrendingUp className="size-5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Receita</p>
                  <p className="text-lg font-semibold text-white">+R$ 12.450</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/6 bg-zinc-900 p-5">
              <p className="text-sm font-medium text-zinc-300">Alertas operacionais</p>
              <div className="mt-4 space-y-3">
                {[
                  "21 mensalidades vencem nas próximas 24h",
                  "5 avaliações físicas pendentes",
                  "2 treinadores com agenda lotada",
                ].map((alert) => (
                  <div key={alert} className="rounded-xl border border-white/6 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-400">
                    {alert}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-yellow-400/15 bg-linear-to-br from-yellow-400/10 to-transparent p-5">
              <p className="text-sm font-medium text-white">Automação inteligente</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Configure sequências para cobrança, retenção e reengajamento sem sair do painel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}