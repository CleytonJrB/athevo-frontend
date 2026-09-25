import { ArrowRight, BadgeCheck, Edit3, MoreVertical, UserRoundCog } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import type { Trainer, TrainerActivity } from "../_data/trainers"

interface TrainerCardProps {
  trainer: Trainer
  onEdit: (trainer: Trainer) => void
  onManageSchedule: (trainer: Trainer) => void
  onView: (trainer: Trainer) => void
}

const activityDotStyles: Record<TrainerActivity, string> = {
  "on-duty": "bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]",
  "in-class": "bg-primary-container shadow-[0_0_8px_rgba(250,204,21,0.6)]",
  available: "bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]",
  "in-service": "bg-primary-container shadow-[0_0_8px_rgba(250,204,21,0.6)]",
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function TrainerCard({
  trainer,
  onEdit,
  onManageSchedule,
  onView,
}: TrainerCardProps) {
  return (
    <article className="group flex h-full flex-col justify-between rounded-xl border border-surface-container-high bg-surface p-4 transition-colors hover:border-outline-variant">
      <div className="mb-3">
        <div className="mb-3 flex min-h-10 items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <Avatar size="lg" className="size-10 border-2 border-primary-container/40 p-0.5">
              <AvatarFallback className="bg-surface-container text-sm font-bold text-primary-container">
                {getInitials(trainer.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="truncate text-[15px] leading-tight font-semibold text-on-surface">
                {trainer.name}
              </h2>
              <span className="mt-0.5 inline-block max-w-full truncate rounded border border-primary-container/20 bg-primary-container/10 px-2 py-0.5 font-mono text-xs text-primary-container">
                {trainer.specialty}
              </span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Mais opções para ${trainer.name}`}
                  className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                />
              }
            >
              <MoreVertical aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(trainer)}>
                <Edit3 aria-hidden="true" />
                Editar professor
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onManageSchedule(trainer)}>
                <UserRoundCog aria-hidden="true" />
                Gerenciar horários
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mb-3 flex min-w-0 items-center gap-1.5 border-b border-surface-container-high pb-2.5 text-xs text-on-surface-variant">
          <BadgeCheck aria-hidden="true" className="size-4 shrink-0 text-success" />
          <span className="shrink-0">CREF {trainer.cref}</span>
          <span aria-hidden="true" className="shrink-0">·</span>
          <span className="truncate" title={trainer.shift}>{trainer.shift}</span>
        </div>

        <div className="grid auto-rows-fr grid-cols-2 gap-2.5">
          <div className="flex min-w-0 flex-col justify-between rounded-lg border border-surface-container bg-surface-container-low p-2">
            <p className="mb-0.5 truncate text-xs text-on-surface-variant" title={trainer.primaryMetricLabel}>
              {trainer.primaryMetricLabel}
            </p>
            <p className="text-[18px] leading-tight font-semibold text-on-surface">
              {trainer.primaryMetricValue}
            </p>
          </div>
          <div className="flex min-w-0 flex-col justify-between rounded-lg border border-surface-container bg-surface-container-low p-2">
            <p className="mb-0.5 truncate text-xs text-on-surface-variant" title="Carga horária semanal">
              Carga horária semanal
            </p>
            <p className="text-[18px] leading-tight font-semibold text-on-surface">
              {trainer.weeklyHours}h{" "}
              <span className="text-xs font-normal text-on-surface-variant">/ sem</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-surface-container-high pt-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className={cn("size-2 shrink-0 rounded-full", activityDotStyles[trainer.activity])}
          />
          <span className="truncate text-xs font-medium text-on-surface">
            {trainer.activityLabel}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onView(trainer)}
          className="h-7 shrink-0 gap-1 px-1 text-xs font-semibold text-primary-container hover:bg-primary-container/10 hover:text-primary-container"
        >
          Ver perfil
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
    </article>
  )
}
