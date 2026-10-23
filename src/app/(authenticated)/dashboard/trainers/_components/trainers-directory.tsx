"use client"

import { useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { SearchX, UserRoundPlus } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { DataPagination } from "@/components/ui/data-pagination"
import { appToast } from "@/lib/toast"
import { listTrainers } from "@/services/trainers-service"
import type { Trainer, TrainerSummary } from "@/types/trainer"

import { TrainerCard, TrainerCardSkeleton } from "./trainer-card"
import { TrainerFilters, type TrainerFilter } from "./trainer-filters"
import { TrainersPageHeader } from "./trainers-page-header"
import { TrainerStats } from "./trainer-stats"

const pageSize = 6
const emptySummary: TrainerSummary = { active: 0, inactive: 0, total: 0 }

export function TrainersDirectory() {
  const { data: session, status: sessionStatus } = useSession()
  const [activeFilter, setActiveFilter] = useState<TrainerFilter>("all")
  const [page, setPage] = useState(1)
  const active = activeFilter === "all" ? undefined : activeFilter === "active"

  const trainersQuery = useQuery({
    queryKey: ["trainers", session?.user.tenantId, { active, page, pageSize }],
    queryFn: ({ signal }) => listTrainers({ active, page, pageSize }, signal),
    enabled: sessionStatus === "authenticated" && Boolean(session?.user.tenantId),
    placeholderData: keepPreviousData,
    meta: {
      errorTitle: "Não foi possível carregar os professores",
    },
  })

  function handleFilterChange(filter: TrainerFilter) {
    setActiveFilter(filter)
    setPage(1)
  }

  function showPendingAction(action: string, trainer?: Trainer) {
    appToast.info(
      trainer
        ? `${action} de ${trainer.name} estará disponível em breve.`
        : `${action} estará disponível em breve.`,
    )
  }

  const trainers = trainersQuery.data?.items ?? []
  const summary = trainersQuery.data?.summary ?? emptySummary
  const total = trainersQuery.data?.totalCount ?? 0
  const isPending = sessionStatus === "loading" || trainersQuery.isPending
  const isFiltered = activeFilter !== "all"

  return (
    <div className="flex flex-col gap-8">
      <TrainersPageHeader
        onSchedule={() => showPendingAction("A grade de horários")}
        onExport={() => showPendingAction("A exportação da equipe")}
        onNewTrainer={() => showPendingAction("O cadastro de professores")}
      />

      <TrainerStats summary={summary} loading={isPending} />

      <TrainerFilters
        activeFilter={activeFilter}
        summary={summary}
        loading={isPending}
        onFilterChange={handleFilterChange}
      />

      <section
        aria-label="Lista de professores"
        aria-busy={trainersQuery.isFetching}
      >
        {trainersQuery.isError ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-border bg-surface px-6 text-center">
            <p className="font-medium text-on-surface">
              Não foi possível carregar os professores
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Não foi possível carregar a equipe agora. Tente novamente em alguns instantes.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4 border-outline-variant bg-transparent px-4 text-on-surface hover:bg-surface-container-high"
              onClick={() => trainersQuery.refetch()}
            >
              Tentar novamente
            </Button>
          </div>
        ) : !isPending && total === 0 ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-border bg-surface px-6 text-center">
            <span className="mb-5 flex size-14 items-center justify-center rounded-full border border-primary-container/20 bg-primary-container/10 text-primary-container">
              {isFiltered ? (
                <SearchX aria-hidden="true" className="size-7" />
              ) : (
                <UserRoundPlus aria-hidden="true" className="size-7" />
              )}
            </span>
            <p className="font-medium text-on-surface">
              {isFiltered
                ? "Nenhum professor encontrado"
                : "Nenhum professor cadastrado"}
            </p>
            <p className="mt-1 max-w-md text-sm text-on-surface-variant">
              {isFiltered
                ? "Não há professores com o status selecionado."
                : "Os professores vinculados a esta academia aparecerão aqui."}
            </p>
            {isFiltered && (
              <Button
                type="button"
                variant="outline"
                className="mt-5 border-outline-variant bg-transparent px-4 text-on-surface hover:bg-surface-container-high"
                onClick={() => handleFilterChange("all")}
              >
                Limpar filtro
              </Button>
            )}
          </div>
        ) : (
          <>
            <div
              id="trainers-grid"
              className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {isPending
                ? Array.from({ length: pageSize }, (_, index) => (
                    <TrainerCardSkeleton key={index} />
                  ))
                : trainers.map((trainer) => (
                    <TrainerCard
                      key={trainer.id}
                      trainer={trainer}
                      onEdit={(selectedTrainer) =>
                        showPendingAction("A edição", selectedTrainer)
                      }
                      onManageSchedule={(selectedTrainer) =>
                        showPendingAction("A gestão de horários", selectedTrainer)
                      }
                      onView={(selectedTrainer) =>
                        showPendingAction("O perfil", selectedTrainer)
                      }
                    />
                  ))}
            </div>

            {!isPending && total > 0 && (
              <DataPagination
                page={page}
                pageSize={pageSize}
                total={total}
                anchorId="trainers-grid"
                itemLabel="professores"
                onPageChange={setPage}
                className="mt-6 rounded-xl border border-surface-container-high"
              />
            )}
          </>
        )}
      </section>
    </div>
  )
}
