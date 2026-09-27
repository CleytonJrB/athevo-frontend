import { Edit3, Eye, MoreVertical } from "lucide-react"

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
import type { Student, StudentStatus } from "@/types/student"

interface StudentsTableProps {
  loading?: boolean
  students: Student[]
  onEdit: (student: Student) => void
  onView: (student: Student) => void
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
}

const checkInFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "short",
  year: "numeric",
})

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

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
  onEdit,
  onView,
}: StudentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table id="students-table" className="w-full min-w-220 border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-surface">
            {[
              ["Aluno", "text-left"],
              ["Plano", "text-left"],
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
              const status = statusPresentation[student.active ? "active" : "inactive"]

              return (
                <tr
                  key={student.id}
                  className="group transition-colors hover:bg-surface focus-within:bg-surface"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <Avatar size="lg">
                        <AvatarFallback className="bg-surface-container text-sm font-semibold text-on-surface-variant">
                          {getInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
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
                        <DropdownMenuContent align="end" className="w-44">
                          <DropdownMenuItem onClick={() => onView(student)}>
                            <Eye aria-hidden="true" />
                            Ver perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(student)}>
                            <Edit3 aria-hidden="true" />
                            Editar cadastro
                          </DropdownMenuItem>
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
