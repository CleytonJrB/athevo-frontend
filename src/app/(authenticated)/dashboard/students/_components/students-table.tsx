import { Camera, Edit3, Eye, LoaderCircle, MoreVertical, Send, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Student, StudentStatus } from "@/types/student"

import { StudentAvatar } from "./student-avatar"

interface StudentsTableProps {
  loading?: boolean
  students: Student[]
  onDelete?: (student: Student) => void
  onEdit: (student: Student) => void
  onResendInvitation: (student: Student) => void
  onUploadPhoto: (student: Student) => void
  onView: (student: Student) => void
  resendingStudentId?: string | null
  uploadingPhotoStudentId?: string | null
}

const statusPresentation: Record<
  StudentStatus,
  { label: string; className: string; dotClassName: string }
> = {
  active: {
    label: "Ativo",
    className: "border-success/20 bg-success/10 text-success",
    dotClassName: "bg-success",
  },
  inactive: {
    label: "Inativo",
    className: "border-outline-variant bg-surface-container text-on-surface-variant",
    dotClassName: "bg-on-surface-variant",
  },
  pendingInvitation: {
    label: "Convite pendente",
    className: "border-primary-container/30 bg-primary-container/10 text-primary-container",
    dotClassName: "bg-primary-container",
  },
}

const checkInFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "short",
  year: "numeric",
})

function StudentsTableSkeleton() {
  return Array.from({ length: 5 }, (_, index) => (
    <tr key={index} className="border-b border-border last:border-0">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-3 w-48" />
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-28" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-6 w-20 rounded-full" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="h-4 w-24" />
      </td>
      <td className="px-6 py-4">
        <Skeleton className="ml-auto size-8" />
      </td>
    </tr>
  ))
}

export function StudentsTable({
  loading = false,
  students,
  onDelete,
  onEdit,
  onResendInvitation,
  onUploadPhoto,
  onView,
  resendingStudentId = null,
  uploadingPhotoStudentId = null,
}: StudentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table id="students-table" className="w-full min-w-220 border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-surface">
            {[
              ["Aluno", "text-left"],
              ["Plano", "text-left"],
              ["Professor", "text-left"],
              ["Status", "text-left"],
              ["Último check-in", "text-left"],
              ["Ações", "text-right"],
            ].map(([label, align]) => (
              <th
                key={label}
                scope="col"
                className={cn(
                  "px-6 py-4 text-xs font-semibold tracking-wider text-on-surface-variant uppercase",
                  align,
                )}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {loading ? (
            <StudentsTableSkeleton />
          ) : (
            students.map((student) => {
              const status = statusPresentation[
                student.canResendInvitation
                  ? "pendingInvitation"
                  : student.active
                    ? "active"
                    : "inactive"
              ]
              const isResendingInvitation = resendingStudentId === student.tenantUserId
              const isUploadingPhoto =
                uploadingPhotoStudentId === student.tenantUserId

              return (
                <tr
                  key={student.id}
                  className="group transition-colors hover:bg-surface focus-within:bg-surface"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <StudentAvatar
                        hasPhoto={student.hasPhoto}
                        name={student.name}
                        tenantUserId={student.tenantUserId}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-on-surface">
                          {student.name}
                        </p>
                        <p className="truncate font-mono text-xs text-on-surface-variant">
                          {student.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface">
                    {student.planName ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface">
                    {student.trainerName ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium",
                        status.className,
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn("size-1.5 rounded-full", status.dotClassName)}
                      />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {student.lastCheckInAt
                      ? checkInFormatter.format(new Date(student.lastCheckInAt))
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        title={`Editar ${student.name}`}
                        aria-label={`Editar ${student.name}`}
                        onClick={() => onEdit(student)}
                        className="text-on-surface-variant hover:bg-surface-container hover:text-primary-container"
                      >
                        <Edit3 aria-hidden="true" />
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Mais opções para ${student.name}`}
                              className="text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                            />
                          }
                        >
                          <MoreVertical aria-hidden="true" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1.5">
                          <DropdownMenuItem
                            className="gap-2 py-1.5"
                            onClick={() => onView(student)}
                          >
                            <Eye aria-hidden="true" />
                            Ver perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 py-1.5"
                            onClick={() => onEdit(student)}
                          >
                            <Edit3 aria-hidden="true" />
                            Editar cadastro
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 py-1.5"
                            disabled={isUploadingPhoto}
                            onClick={() => onUploadPhoto(student)}
                          >
                            {isUploadingPhoto ? (
                              <LoaderCircle aria-hidden="true" className="animate-spin" />
                            ) : (
                              <Camera aria-hidden="true" />
                            )}
                            {isUploadingPhoto
                              ? "Enviando foto..."
                              : student.hasPhoto
                                ? "Alterar foto"
                                : student.hasPendingPhoto
                                  ? "Reenviar foto"
                                  : "Enviar foto"}
                          </DropdownMenuItem>
                          {student.canResendInvitation && (
                            <DropdownMenuItem
                              className="gap-2 py-1.5"
                              disabled={isResendingInvitation}
                              onClick={() => onResendInvitation(student)}
                            >
                              {isResendingInvitation ? (
                                <LoaderCircle aria-hidden="true" className="animate-spin" />
                              ) : (
                                <Send aria-hidden="true" />
                              )}
                              {isResendingInvitation ? "Reenviando..." : "Reenviar convite"}
                            </DropdownMenuItem>
                          )}
                          {onDelete && (
                            <>
                              <DropdownMenuSeparator className="my-1.5" />
                              <DropdownMenuItem
                                variant="destructive"
                                className="gap-2 py-1.5 hover:bg-destructive/15 focus:bg-destructive/20 dark:hover:bg-destructive/25"
                                onClick={() => onDelete(student)}
                              >
                                <Trash2 aria-hidden="true" />
                                Excluir aluno
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
