import { ArrowRight, Edit3, Mail, MoreVertical, UserRoundCog } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Trainer } from "@/types/trainer"

interface TrainerCardProps {
  trainer: Trainer
  onEdit: (trainer: Trainer) => void
  onManageSchedule: (trainer: Trainer) => void
  onView: (trainer: Trainer) => void
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
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
              <span className="mt-0.5 inline-block max-w-full truncate rounded border border-primary-container/20 bg-primary-container/10 px-2 py-0.5 text-xs text-primary-container">
                {trainer.specialty ?? "Especialidade não informada"}
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

        <div className="mb-3 flex min-w-0 items-center gap-2 border-b border-surface-container-high pb-3 text-xs text-on-surface-variant">
          <Mail aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate" title={trainer.email}>
            {trainer.email}
          </span>
        </div>

        <div className="grid auto-rows-fr grid-cols-2 gap-2.5">
          <div className="flex min-w-0 flex-col justify-between rounded-lg border border-surface-container bg-surface-container-low p-2.5">
            <p className="mb-1 text-xs text-on-surface-variant">Cadastro</p>
            <p className="truncate text-sm font-semibold text-on-surface">
              {dateFormatter.format(new Date(trainer.createdAt))}
            </p>
          </div>
          <div className="flex min-w-0 flex-col justify-between rounded-lg border border-surface-container bg-surface-container-low p-2.5">
            <p className="mb-1 text-xs text-on-surface-variant">Registro profissional</p>
            <p className="truncate text-sm font-semibold text-on-surface">
              {trainer.registrationNumber ?? "—"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-surface-container-high pt-2.5">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className={cn(
              "size-2 shrink-0 rounded-full",
              trainer.active
                ? "bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]"
                : "bg-on-surface-variant",
            )}
          />
          <span className="truncate text-xs font-medium text-on-surface">
            {trainer.active ? "Cadastro ativo" : "Cadastro inativo"}
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

export function TrainerCardSkeleton() {
  return (
    <div className="flex h-58 flex-col rounded-xl border border-surface-container-high bg-surface p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-5 w-44" />
        </div>
      </div>
      <Skeleton className="mt-4 h-4 w-4/5" />
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <Skeleton className="h-16" />
        <Skeleton className="h-16" />
      </div>
      <Skeleton className="mt-auto h-7 w-full" />
    </div>
  )
}
