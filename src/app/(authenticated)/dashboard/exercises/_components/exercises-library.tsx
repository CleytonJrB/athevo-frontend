"use client"

import { useEffect, useState } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { DataPagination } from "@/components/ui/data-pagination"
import { TenantRole } from "@/lib/tenant-role"
import {
  ExerciseServiceError,
  listExercises,
} from "@/services/exercises-service"
import type { ExerciseScope } from "@/types/exercise"

import { ExerciseCard, ExerciseCardSkeleton } from "./exercise-card"
import { ExerciseEmptyList } from "./exercise-empty-list"
import { ExerciseDetailsSheet } from "./exercise-details-sheet"
import { ExerciseFilters } from "./exercise-filters"
import { ExercisesPageHeader } from "./exercises-page-header"

const pageSize = 10

export function ExercisesLibrary() {
  const { data: session, status: sessionStatus } = useSession()
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [scope, setScope] = useState<ExerciseScope>("all")
  const [page, setPage] = useState(1)
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [search])

  const isCustom = scope === "all" ? undefined : scope === "custom"
  const exercisesQuery = useQuery({
    queryKey: [
      "exercises",
      session?.user.tenantId,
      { isCustom, page, pageSize, search: debouncedSearch },
    ],
    queryFn: ({ signal }) =>
      listExercises(
        {
          isCustom,
          languageCode: "pt-BR",
          page,
          pageSize,
          search: debouncedSearch || undefined,
        },
        signal,
      ),
    enabled: sessionStatus === "authenticated" && Boolean(session?.user.tenantId),
    placeholderData: keepPreviousData,
    meta: { skipGlobalErrorToast: true },
  })

  function handleScopeChange(nextScope: ExerciseScope) {
    setScope(nextScope)
    setPage(1)
  }

  function clearFilters() {
    setSearch("")
    setDebouncedSearch("")
    setScope("all")
    setPage(1)
  }

  const exercises = exercisesQuery.data?.items ?? []
  const total = exercisesQuery.data?.totalCount ?? 0
  const isPending = sessionStatus === "loading" || exercisesQuery.isPending
  const hasActiveFilters = scope !== "all" || debouncedSearch.length > 0
  const isAccessDenied =
    exercisesQuery.error instanceof ExerciseServiceError &&
    exercisesQuery.error.status === 403
  const isOwner = session?.user.role === TenantRole.Owner

  return (
    <>
      <ExercisesPageHeader />

      <ExerciseFilters
        search={search}
        scope={scope}
        onSearchChange={setSearch}
        onScopeChange={handleScopeChange}
      />

      <section id="exercises-list" aria-busy={exercisesQuery.isFetching}>
        {exercisesQuery.isError ? (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-border bg-surface-glass px-6 text-center">
            <p className="font-medium text-on-surface">
              {isAccessDenied
                ? isOwner
                  ? "Biblioteca temporariamente bloqueada"
                  : "Biblioteca de exercícios indisponível"
                : "Não foi possível carregar os exercícios"}
            </p>
            <p className="mt-1 max-w-md text-sm text-on-surface-variant">
              {isAccessDenied
                ? isOwner
                  ? "O período gratuito terminou ou o plano da academia precisa ser renovado. Entre em contato com o suporte para liberar a biblioteca."
                  : "Peça ao proprietário da academia para verificar o plano da Athevo."
                : "Verifique sua conexão ou tente novamente em alguns instantes."}
            </p>
            {!isAccessDenied && (
              <Button
                type="button"
                variant="outline"
                className="mt-5 border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-high"
                onClick={() => exercisesQuery.refetch()}
              >
                Tentar novamente
              </Button>
            )}
          </div>
        ) : !isPending && total === 0 ? (
          <ExerciseEmptyList
            filtered={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {isPending
                ? Array.from({ length: 6 }, (_, index) => (
                    <ExerciseCardSkeleton key={index} />
                  ))
                : exercises.map((exercise) => (
                    <ExerciseCard
                      key={exercise.id}
                      exercise={exercise}
                      onSelect={(item) => setSelectedExerciseId(item.id)}
                    />
                  ))}
            </div>
            <DataPagination
              page={page}
              pageSize={pageSize}
              total={total}
              anchorId="exercises-list"
              itemLabel="exercícios"
              onPageChange={setPage}
              className="mt-6 rounded-lg border border-border"
            />
          </>
        )}
      </section>

      <ExerciseDetailsSheet
        exerciseId={selectedExerciseId}
        open={selectedExerciseId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedExerciseId(null)
        }}
      />
    </>
  )
}
