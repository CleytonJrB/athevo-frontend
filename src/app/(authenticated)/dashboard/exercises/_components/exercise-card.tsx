import { cn } from "@/lib/utils"

import type { ExerciseDifficulty, Exercise } from "../_data/exercises"

const difficultyColor: Record<ExerciseDifficulty, string> = {
  Iniciante: "bg-success",
  Intermediário: "bg-primary-container",
  Avançado: "bg-destructive",
}

export function ExerciseCard({ exercise }: { exercise: Exercise }) {
  const Icon = exercise.icon

  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-surface-glass backdrop-blur-xl transition-[border-color,transform,box-shadow] hover:-translate-y-0.5 hover:border-outline hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)]">
      <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-border bg-surface">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08),transparent_68%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <Icon
          aria-hidden="true"
          strokeWidth={1.35}
          className="relative size-16 text-surface-container-highest transition-[color,transform] duration-500 group-hover:scale-110 group-hover:text-primary-container/55"
        />
        <span className="absolute top-3 right-3 rounded border border-border bg-card px-2 py-1 text-xs text-on-surface">
          {exercise.equipment}
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-semibold text-on-surface transition-colors group-hover:text-primary-container">
              {exercise.name}
            </h2>
            <p className="mt-1 text-xs font-medium tracking-[0.02em] text-primary-container">
              {exercise.muscleGroup}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1">
            <span
              aria-hidden="true"
              className={cn("size-2 rounded-full", difficultyColor[exercise.difficulty])}
            />
            <span className="text-xs font-medium text-on-surface-variant">
              {exercise.difficulty}
            </span>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-on-surface-variant">
          {exercise.description}
        </p>
      </div>
    </article>
  )
}
