"use client"

import Image from "next/image"
import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import { AlertTriangle, ExternalLink, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { getExerciseDetails } from "@/services/exercises-service"
import type { ExerciseAttribution } from "@/types/exercise"

interface ExerciseDetailsSheetProps {
  exerciseId: string | null
  onOpenChange: (open: boolean) => void
  open: boolean
}

function Attribution({ attribution }: { attribution: ExerciseAttribution }) {
  return (
    <div className="space-y-2 border-l-2 border-primary-container/40 pl-3 text-xs text-on-surface-variant">
      <p className="font-medium text-on-surface">
        {attribution.title ?? "Conteúdo sem título informado"}
      </p>
      <p>
        Autor: {attribution.author ?? "não informado pela fonte"}
      </p>
      <div className="flex flex-wrap gap-x-3 gap-y-1">
        {attribution.objectUrl && (
          <a
            href={attribution.objectUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary-container hover:underline"
          >
            Origem <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        )}
        {attribution.authorUrl && (
          <a
            href={attribution.authorUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary-container hover:underline"
          >
            Perfil do autor <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        )}
        {attribution.licenseUrl ? (
          <a
            href={attribution.licenseUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-primary-container hover:underline"
          >
            {attribution.license} <ExternalLink aria-hidden="true" className="size-3" />
          </a>
        ) : (
          <span>{attribution.license}</span>
        )}
      </div>
      {attribution.isModified && (
        <p className="flex items-start gap-2 text-primary-container">
          <AlertTriangle aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          Alterado pela Athevo: {attribution.modificationNotice}
        </p>
      )}
    </div>
  )
}

export function ExerciseDetailsSheet({
  exerciseId,
  onOpenChange,
  open,
}: ExerciseDetailsSheetProps) {
  const detailsQuery = useQuery({
    queryKey: ["exercise-details", exerciseId],
    queryFn: ({ signal }) => getExerciseDetails(exerciseId!, signal),
    enabled: open && exerciseId !== null,
    meta: {
      errorTitle: "Não foi possível carregar o exercício",
    },
  })

  const exercise = detailsQuery.data

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-border sm:max-w-xl">
        <SheetHeader className="border-b border-border pr-12">
          <SheetTitle>{exercise?.name ?? "Detalhes do exercício"}</SheetTitle>
          <SheetDescription>
            Informações, mídia, origem e licenças do conteúdo.
          </SheetDescription>
        </SheetHeader>

        {detailsQuery.isPending ? (
          <div className="space-y-4 p-5">
            <Skeleton className="h-52 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : detailsQuery.isError || !exercise ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
            <p className="font-medium text-on-surface">Detalhes indisponíveis</p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => detailsQuery.refetch()}
            >
              Tentar novamente
            </Button>
          </div>
        ) : (
          <div className="space-y-7 p-5">
            <section>
              <h3 className="text-xs font-semibold uppercase text-on-surface-variant">
                Descrição
              </h3>
              <p className="mt-2 whitespace-pre-line leading-6 text-on-surface">
                {exercise.description || "Descrição não informada."}
              </p>
            </section>

            {exercise.attribution && (
              <section>
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase text-on-surface-variant">
                  <ShieldCheck aria-hidden="true" className="size-4" />
                  Crédito do conteúdo exibido
                </h3>
                <Attribution attribution={exercise.attribution} />
              </section>
            )}

            {exercise.media.map((media) => (
              <figure key={media.id} className="space-y-3">
                {media.type === 3 ? (
                  <video
                    controls
                    preload="metadata"
                    className="aspect-video w-full rounded-md border border-border bg-black"
                  >
                    <source src={media.url} />
                  </video>
                ) : (
                  <div className="relative aspect-video overflow-hidden rounded-md border border-border bg-surface">
                    <Image
                      src={media.url}
                      alt={media.attribution?.title ?? exercise.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 576px"
                      className="object-contain"
                    />
                  </div>
                )}
                {media.attribution && (
                  <figcaption>
                    <Attribution attribution={media.attribution} />
                  </figcaption>
                )}
              </figure>
            ))}

            {exercise.translations.length > 0 && (
              <section>
                <h3 className="mb-3 text-xs font-semibold uppercase text-on-surface-variant">
                  Traduções e licenças
                </h3>
                <div className="space-y-4">
                  {exercise.translations.map((translation) => (
                    <div key={translation.languageCode}>
                      <p className="mb-2 font-medium text-on-surface">
                        {translation.languageCode} · {translation.name}
                      </p>
                      {translation.attribution && (
                        <Attribution attribution={translation.attribution} />
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <p className="border-t border-border pt-5 text-xs text-on-surface-variant">
              Consulte a página pública de{" "}
              <Link
                href="/fontes-e-licencas"
                className="text-primary-container hover:underline"
              >
                Fontes e licenças
              </Link>
              .
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
