import { Edit3, Eye, MoreVertical } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import type { Student, StudentStatus } from "../_data/students"

interface StudentsTableProps {
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
  pending: {
    label: "Pendente",
    className:
      "border-primary-container/20 bg-primary-container/10 text-primary-container",
    dotClassName: "bg-primary-container",
  },
  delinquent: {
    label: "Inadimplente",
    className: "border-destructive/20 bg-destructive/10 text-destructive",
    dotClassName: "bg-destructive",
  },
}

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function StudentsTable({ students, onEdit, onView }: StudentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table id="students-table" className="w-full min-w-215 border-collapse text-left">
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
          {students.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-16 text-center">
                <p className="font-medium text-on-surface">Nenhum aluno encontrado</p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Ajuste os filtros para visualizar outros resultados.
                </p>
              </td>
            </tr>
          ) : (
            students.map((student) => {
              const status = statusPresentation[student.status]

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
                    {student.plan}
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
                    {student.lastCheckIn}
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
