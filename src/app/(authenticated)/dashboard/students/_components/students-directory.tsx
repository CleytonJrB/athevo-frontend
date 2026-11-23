"use client"

import { useEffect, useRef, useState } from "react"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Search } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { DataPagination } from "@/components/ui/data-pagination"
import { Input } from "@/components/ui/input"
import { canDeleteStudents } from "@/lib/tenant-role"
import { appToast } from "@/lib/toast"
import {
  deleteStudent,
  listStudents,
  resendStudentInvitation,
  uploadStudentPhoto,
} from "@/services/students-service"
import type { Student } from "@/types/student"

import {
  StudentsPageHeader,
  type StudentStatusFilter,
} from "./students-page-header"
import { DeleteStudentDialog } from "./delete-student-dialog"
import { StudentDetailsSheet } from "./student-details-sheet"
import { StudentsEmptyState } from "./students-empty-state"
import { StudentsTable } from "./students-table"

const pageSize = 10

export function StudentsDirectory() {
  const { data: session, status: sessionStatus } = useSession()
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<StudentStatusFilter>("all")
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null)
  const [studentPendingDeletion, setStudentPendingDeletion] = useState<Student | null>(null)
  const photoInputRef = useRef<HTMLInputElement>(null)
  const photoStudentRef = useRef<Student | null>(null)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim())
      setPage(1)
    }, 300)

    return () => window.clearTimeout(timeout)
  }, [search])

  const active = status === "all" ? undefined : status === "active"
  const studentsQuery = useQuery({
    queryKey: [
      "students",
      session?.user.tenantId,
      { active, page, pageSize, search: debouncedSearch },
    ],
    queryFn: ({ signal }) =>
      listStudents(
        {
          active,
          page,
          pageSize,
          search: debouncedSearch || undefined,
        },
        signal,
      ),
    enabled: sessionStatus === "authenticated" && Boolean(session?.user.tenantId),
    placeholderData: keepPreviousData,
    meta: {
      errorTitle: "Não foi possível carregar os alunos",
    },
  })

  const resendInvitationMutation = useMutation({
    mutationFn: (student: Student) => resendStudentInvitation(student.tenantUserId),
    meta: {
      errorFallback: "Não foi possível solicitar o reenvio. Tente novamente.",
      errorTitle: "Erro ao reenviar convite",
    },
    onSuccess: async (_result, student) => {
      appToast.success(
        "Reenvio solicitado",
        `Um novo convite foi agendado para ${student.name}.`,
      )
      await queryClient.invalidateQueries({
        queryKey: ["students", session?.user.tenantId],
      })
    },
  })

  const deleteStudentMutation = useMutation({
    mutationFn: (student: Student) => deleteStudent(student.tenantUserId),
    meta: {
      errorFallback: "Não foi possível excluir o aluno. Tente novamente.",
      errorTitle: "Erro ao excluir aluno",
    },
    onSuccess: async (_result, student) => {
      setStudentPendingDeletion(null)
      if (selectedStudentId === student.tenantUserId) setSelectedStudentId(null)
      if (students.length === 1 && page > 1) setPage((current) => current - 1)
      appToast.success(
        "Aluno excluído",
        `${student.name} foi removido da academia e poderá ser cadastrado novamente.`,
      )
      await queryClient.invalidateQueries({
        queryKey: ["students", session?.user.tenantId],
      })
    },
  })

  const photoUploadMutation = useMutation({
    mutationFn: ({ file, student }: { file: File; student: Student }) =>
      uploadStudentPhoto(student.tenantUserId, file),
    meta: {
      errorFallback: "Não foi possível enviar a foto. Tente novamente.",
      errorTitle: "Erro ao enviar foto",
    },
    onSuccess: async (_result, { student }) => {
      appToast.success(
        student.hasPhoto ? "Foto atualizada" : "Foto adicionada",
        `A foto de ${student.name} já está disponível no cadastro.`,
      )
      await queryClient.invalidateQueries({
        queryKey: ["students", session?.user.tenantId],
      })
    },
    onSettled: () => {
      photoStudentRef.current = null
      if (photoInputRef.current) photoInputRef.current.value = ""
    },
  })

  function handleStatusChange(nextStatus: StudentStatusFilter) {
    setStatus(nextStatus)
    setPage(1)
  }

  function showPendingAction(action: string, student: Student) {
    appToast.info(`${action} de ${student.name} estará disponível em breve.`)
  }

  function viewStudent(student: Student) {
    setSelectedStudentId(student.tenantUserId)
  }

  function chooseStudentPhoto(student: Student) {
    if (photoUploadMutation.isPending) return
    photoStudentRef.current = student
    if (photoInputRef.current) {
      photoInputRef.current.value = ""
      photoInputRef.current.click()
    }
  }

  function handleStudentPhotoChange(file?: File) {
    const student = photoStudentRef.current
    if (!file || !student) return

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      appToast.warning(
        "Formato não suportado",
        "Selecione uma imagem JPG, PNG ou WebP.",
      )
      photoStudentRef.current = null
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      appToast.warning(
        "Imagem muito grande",
        "A foto deve ter no máximo 5 MB.",
      )
      photoStudentRef.current = null
      return
    }

    photoUploadMutation.mutate({ file, student })
  }

  function clearFilters() {
    setSearch("")
    setDebouncedSearch("")
    setStatus("all")
    setPage(1)
  }

  const students = studentsQuery.data?.items ?? []
  const total = studentsQuery.data?.totalCount ?? 0
  const isPending = sessionStatus === "loading" || studentsQuery.isPending
  const hasActiveFilters = status !== "all" || debouncedSearch.length > 0

  return (
    <div className="flex flex-col gap-6">
      <input
        ref={photoInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        aria-label="Selecionar foto do aluno"
        onChange={(event) => handleStudentPhotoChange(event.target.files?.[0])}
      />

      <StudentsPageHeader
        filtersVisible={filtersVisible}
        status={status}
        onFiltersToggle={() => setFiltersVisible((current) => !current)}
        onStatusChange={handleStatusChange}
      />

      {filtersVisible && (
        <div
          id="student-filters"
          className="rounded-lg border border-border bg-surface-glass p-4 backdrop-blur-xl"
        >
          <label className="relative block max-w-md">
            <span className="sr-only">Buscar aluno por nome ou e-mail</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-on-surface-variant"
            />
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar aluno por nome ou e-mail..."
              autoFocus
              className="h-10 border-border bg-card pr-4 pl-10 text-sm text-on-surface shadow-none placeholder:text-on-surface-variant focus-visible:border-primary-container focus-visible:ring-primary-container/20"
            />
          </label>
        </div>
      )}

      <section
        aria-label="Lista de alunos"
        aria-busy={studentsQuery.isFetching}
        className="overflow-hidden rounded-xl border border-border bg-surface-glass shadow-2xl shadow-black/50 backdrop-blur-xl"
      >
        {studentsQuery.isError ? (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
            <p className="font-medium text-on-surface">
              Não foi possível carregar os alunos
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">
              Não foi possível carregar a lista agora. Tente novamente em alguns instantes.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4 px-1 border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-high"
              onClick={() => studentsQuery.refetch()}
            >
              Tentar novamente
            </Button>
          </div>
        ) : !isPending && total === 0 ? (
          <StudentsEmptyState
            filtered={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        ) : (
          <>
            <StudentsTable
              students={students}
              loading={isPending}
              onDelete={
                canDeleteStudents(session?.user.role)
                  ? setStudentPendingDeletion
                  : undefined
              }
              onEdit={(student) => showPendingAction("A edição", student)}
              onUploadPhoto={chooseStudentPhoto}
              onResendInvitation={(student) => resendInvitationMutation.mutate(student)}
              onView={viewStudent}
              resendingStudentId={
                resendInvitationMutation.isPending
                  ? resendInvitationMutation.variables?.tenantUserId
                  : null
              }
              uploadingPhotoStudentId={
                photoUploadMutation.isPending
                  ? photoUploadMutation.variables?.student.tenantUserId
                  : null
              }
            />
            <DataPagination
              page={page}
              pageSize={pageSize}
              total={total}
              anchorId="students-table"
              itemLabel="alunos"
              onPageChange={setPage}
            />
          </>
        )}
      </section>

      <StudentDetailsSheet
        open={selectedStudentId !== null}
        tenantUserId={selectedStudentId}
        onOpenChange={(open) => {
          if (!open) setSelectedStudentId(null)
        }}
      />

      <DeleteStudentDialog
        deleting={deleteStudentMutation.isPending}
        student={studentPendingDeletion}
        onConfirm={() => {
          if (studentPendingDeletion) {
            deleteStudentMutation.mutate(studentPendingDeletion)
          }
        }}
        onOpenChange={(open) => {
          if (!open) setStudentPendingDeletion(null)
        }}
      />
    </div>
  )
}
