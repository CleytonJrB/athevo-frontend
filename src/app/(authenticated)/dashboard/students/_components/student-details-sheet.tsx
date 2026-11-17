"use client"

import { useQuery } from "@tanstack/react-query"
import { CalendarDays, CreditCard, Dumbbell, Mail } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { getStudentDetails } from "@/services/students-service"

import { StudentAvatar } from "./student-avatar"

interface StudentDetailsSheetProps {
  onOpenChange: (open: boolean) => void
  open: boolean
  tenantUserId: string | null
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
})

export function StudentDetailsSheet({
  onOpenChange,
  open,
  tenantUserId,
}: StudentDetailsSheetProps) {
  const { data: session } = useSession()
  const detailsQuery = useQuery({
    queryKey: ["students", session?.user.tenantId, tenantUserId, "details"],
    queryFn: ({ signal }) => getStudentDetails(tenantUserId!, signal),
    enabled: open && Boolean(tenantUserId) && Boolean(session?.user.tenantId),
    meta: {
      errorTitle: "Nao foi possivel carregar o aluno",
    },
  })
  const student = detailsQuery.data

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full border-border bg-surface sm:max-w-md">
        <SheetHeader className="border-b border-border px-6 py-5">
          <SheetTitle>Detalhes do aluno</SheetTitle>
          <SheetDescription>
            Informacoes da matricula na academia atual.
          </SheetDescription>
        </SheetHeader>

        {detailsQuery.isPending ? (
          <div className="space-y-6 px-6 py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="size-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        ) : detailsQuery.isError ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="font-medium text-on-surface">
              Nao foi possivel carregar os detalhes
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Verifique sua conexao e tente novamente.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => detailsQuery.refetch()}
            >
              Tentar novamente
            </Button>
          </div>
        ) : student ? (
          <div className="overflow-y-auto px-6 py-5">
            <div className="flex items-center gap-4 border-b border-border pb-5">
              <StudentAvatar
                className="size-16"
                hasPhoto={student.hasPhoto}
                name={student.name}
                tenantUserId={student.tenantUserId}
              />
              <div className="min-w-0">
                <p className="truncate text-lg font-semibold text-on-surface">
                  {student.name}
                </p>
                <p className="truncate text-sm text-on-surface-variant">
                  {student.active ? "Aluno ativo" : "Aluno inativo"}
                </p>
              </div>
            </div>

            <dl className="divide-y divide-border">
              <DetailRow icon={Mail} label="E-mail" value={student.email} />
              <DetailRow
                icon={CreditCard}
                label="Plano"
                value={student.planName ?? "Sem plano atual"}
              />
              <DetailRow
                icon={Dumbbell}
                label="Professor principal"
                value={student.trainerName ?? "Nao vinculado"}
              />
              <DetailRow
                icon={CalendarDays}
                label="Cadastro"
                value={dateFormatter.format(new Date(student.createdAt))}
              />
            </dl>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

interface DetailRowProps {
  icon: typeof Mail
  label: string
  value: string
}

function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
  return (
    <div className="flex gap-3 py-4">
      <Icon aria-hidden="true" className="mt-0.5 size-4 text-primary-container" />
      <div className="min-w-0">
        <dt className="text-xs font-medium text-on-surface-variant">{label}</dt>
        <dd className="mt-1 break-words text-sm text-on-surface">{value}</dd>
      </div>
    </div>
  )
}
