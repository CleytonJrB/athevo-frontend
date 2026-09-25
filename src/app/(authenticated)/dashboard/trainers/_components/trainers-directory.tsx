"use client"

import { useMemo, useState } from "react"

import { DataPagination } from "@/components/ui/data-pagination"
import { appToast } from "@/lib/toast"

import { trainers, type Trainer } from "../_data/trainers"
import { TrainerCard } from "./trainer-card"
import { TrainerFilters, type TrainerFilter } from "./trainer-filters"
import { TrainersPageHeader } from "./trainers-page-header"
import { TrainerStats } from "./trainer-stats"

const pageSize = 6

export function TrainersDirectory() {
  const [activeFilter, setActiveFilter] = useState<TrainerFilter>("all")
  const [page, setPage] = useState(1)

  const filteredTrainers = useMemo(() => {
    if (activeFilter === "all") return trainers
    if (activeFilter === "on-duty") {
      return trainers.filter((trainer) => trainer.activity === "on-duty")
    }

    return trainers.filter((trainer) => trainer.category === activeFilter)
  }, [activeFilter])

  const visibleTrainers = filteredTrainers.slice(
    (page - 1) * pageSize,
    page * pageSize,
  )

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

  return (
    <div className="flex flex-col gap-8">
      <TrainersPageHeader
        onSchedule={() => showPendingAction("A grade de horários")}
        onExport={() => showPendingAction("A exportação da equipe")}
        onNewTrainer={() => showPendingAction("O cadastro de professores")}
      />

      <TrainerStats />

      <TrainerFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      <section aria-label="Lista de professores">
        {filteredTrainers.length > 0 ? (
          <>
            <div
              id="trainers-grid"
              className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {visibleTrainers.map((trainer) => (
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

            <DataPagination
              page={page}
              pageSize={pageSize}
              total={filteredTrainers.length}
              anchorId="trainers-grid"
              emptyMessage="Nenhum professor encontrado"
              itemLabel="professores"
              onPageChange={setPage}
              className="mt-6 rounded-xl border border-surface-container-high"
            />
          </>
        ) : (
          <div className="rounded-xl border border-border bg-surface py-16 text-center">
            <p className="font-medium text-on-surface">Nenhum professor encontrado</p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Selecione outra especialidade para visualizar a equipe.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
