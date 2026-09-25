import { CalendarDays, Download, Dumbbell, UserPlus } from "lucide-react"

import { AuthenticatedCommonTitle } from "@/components/layout/authenticated-common-title"
import { Button } from "@/components/ui/button"

interface TrainersPageHeaderProps {
  onExport: () => void
  onNewTrainer: () => void
  onSchedule: () => void
}

export function TrainersPageHeader({
  onExport,
  onNewTrainer,
  onSchedule,
}: TrainersPageHeaderProps) {
  return (
    <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -left-20 -z-10 size-64 rounded-full bg-primary-container/5 blur-3xl"
      />

      <AuthenticatedCommonTitle
        title="Gestão de Professores"
        subTitle="Acompanhe e gerencie a equipe de instrutores, especialidades e plantões da sua academia."
      />

      <div className="flex w-full flex-wrap items-center gap-2 md:w-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onSchedule}
          className="h-10 border-surface-container-high bg-surface-container px-4 text-on-surface hover:border-outline-variant hover:bg-surface-container-high"
        >
          <CalendarDays aria-hidden="true" />
          Grade de horários
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onExport}
          className="h-10 border-surface-container-high bg-surface-container px-4 text-on-surface hover:border-outline-variant hover:bg-surface-container-high"
        >
          <Download aria-hidden="true" />
          Exportar
        </Button>
        <Button
          type="button"
          onClick={onNewTrainer}
          className="h-10 bg-primary-container px-5 font-bold text-black shadow-[0_4px_14px_rgba(250,204,21,0.2)] hover:bg-primary-container/90"
        >
          <UserPlus aria-hidden="true" />
          Novo Professor
        </Button>
      </div>
    </div>
  )
}
