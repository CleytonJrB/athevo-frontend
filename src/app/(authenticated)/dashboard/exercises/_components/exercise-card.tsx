import { BicepsFlexed, Dumbbell } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import type { ExerciseListItem } from "@/types/exercise"

export function ExerciseCard({ exercise }: { exercise: ExerciseListItem }) {
  const equipment = exercise.equipment.map((item) => item.name).join(", ")
  const muscles = exercise.primaryMuscles.map((item) => item.name).join(", ")

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-surface-glass backdrop-blur-xl transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-outline hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
      <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-border bg-surface">
        <Dumbbell
          aria-hidden="true"
          strokeWidth={1.35}
          className="relative size-16 text-surface-container-highest transition-[color,transform] duration-500 group-hover:scale-110 group-hover:text-primary-container/55"
        />
        <span className="absolute top-3 right-3 rounded border border-border bg-card px-2 py-1 text-xs text-on-surface">
          {exercise.isCustom ? "Da academia" : "Catálogo"}
        </span>
      </div>

      <div className="p-6">
        <h2 className="truncate text-xl font-semibold text-on-surface transition-colors group-hover:text-primary-container">
          {exercise.name}
        </h2>
        <p className="mt-1 truncate text-xs font-medium text-primary-container">
          {exercise.category?.name ?? "Sem categoria"}
        </p>

        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <Dumbbell aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-on-surface-variant" />
            <div className="min-w-0">
              <dt className="sr-only">Equipamentos</dt>
              <dd className="line-clamp-2 text-on-surface-variant">
                {equipment || "Sem equipamento"}
              </dd>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <BicepsFlexed aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-on-surface-variant" />
            <div className="min-w-0">
              <dt className="sr-only">Músculos principais</dt>
              <dd className="line-clamp-2 text-on-surface-variant">
                {muscles || "Músculos não informados"}
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </article>
  )
}

export function ExerciseCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface-glass">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="space-y-4 p-6">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <div className="space-y-3 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  )
}
