"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { DataPagination } from "@/components/ui/data-pagination"
import { Input } from "@/components/ui/input"
import { appToast } from "@/lib/toast"
import { normalizeText } from "@/lib/formats"

import { students, type Student } from "../_data/students"
import {
  StudentsPageHeader,
  type StudentStatusFilter,
} from "./students-page-header"
import { StudentsTable } from "./students-table"

const pageSize = 10

export function StudentsDirectory() {
  const [status, setStatus] = useState<StudentStatusFilter>("all")
  const [search, setSearch] = useState("")
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [page, setPage] = useState(1)

  const filteredStudents = useMemo(() => {
    const normalizedSearch = normalizeText(search.trim())

    return students.filter((student) => {
      const matchesStatus = status === "all" || student.status === status
      const matchesSearch =
        !normalizedSearch ||
        normalizeText(`${student.name} ${student.email} ${student.plan}`).includes(
          normalizedSearch,
        )

      return matchesStatus && matchesSearch
    })
  }, [search, status])

  const visibleStudents = filteredStudents.slice(
    (page - 1) * pageSize,
    page * pageSize,
  )

  function handleStatusChange(nextStatus: StudentStatusFilter) {
    setStatus(nextStatus)
    setPage(1)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function showPendingAction(action: string, student?: Student) {
    appToast.info(
      student
        ? `${action} de ${student.name} estará disponível em breve.`
        : `${action} estará disponível em breve.`,
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <StudentsPageHeader
        filtersVisible={filtersVisible}
        status={status}
        onFiltersToggle={() => setFiltersVisible((current) => !current)}
        onNewStudent={() => showPendingAction("O cadastro de alunos")}
        onStatusChange={handleStatusChange}
      />

      {filtersVisible && (
        <div
          id="student-filters"
          className="rounded-lg border border-border bg-surface-glass p-4 backdrop-blur-xl"
        >
          <label className="relative block max-w-md">
            <span className="sr-only">Buscar aluno por nome, e-mail ou plano</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-on-surface-variant"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              placeholder="Buscar aluno por nome, e-mail ou plano..."
              autoFocus
              className="h-10 border-border bg-card pr-4 pl-10 text-sm text-on-surface shadow-none placeholder:text-on-surface-variant focus-visible:border-primary-container focus-visible:ring-primary-container/20"
            />
          </label>
        </div>
      )}

      <section
        aria-label="Lista de alunos"
        className="overflow-hidden rounded-xl border border-border bg-surface-glass shadow-2xl shadow-black/50 backdrop-blur-xl"
      >
        <StudentsTable
          students={visibleStudents}
          onEdit={(student) => showPendingAction("A edição", student)}
          onView={(student) => showPendingAction("O perfil", student)}
        />
        <DataPagination
          page={page}
          pageSize={pageSize}
          total={filteredStudents.length}
          anchorId="students-table"
          emptyMessage="Nenhum aluno encontrado"
          itemLabel="alunos"
          onPageChange={setPage}
        />
      </section>
    </div>
  )
}
