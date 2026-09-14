import type { AcademyListItem } from "@/types/academy"

const studentRangeLabels: Record<string, string> = {
  UpTo50: "até 50 alunos",
  From51To100: "51 a 100 alunos",
  From101To300: "101 a 300 alunos",
  From301To700: "301 a 700 alunos",
  MoreThan700: "mais de 700 alunos",
}

const academyRoleLabels: Record<string, string> = {
  Owner: "Proprietário",
  Administrator: "Administrador",
  Manager: "Gerente",
  Instructor: "Professor",
  Receptionist: "Recepção",
  Student: "Aluno",
}

export function formatAcademySummary(academy: AcademyListItem) {
  const plan = academy.planName ? `Plano ${academy.planName}` : null
  const students = formatAcademyStudents(
    academy.activeStudentCount,
    academy.studentRange
  )
  const details = [plan, students].filter(Boolean)

  return details.length > 0 ? details.join(" • ") : formatAcademyRole(academy.role)
}

export function formatAcademyStudents(
  count: number | null,
  range: string | null
) {
  if (count !== null) {
    return `${count} ${count === 1 ? "aluno" : "alunos"}`
  }

  return range ? (studentRangeLabels[range] ?? null) : null
}

export function formatAcademyCount(count: number) {
  return `${count} ${count === 1 ? "unidade" : "unidades"}`
}

export function getAcademyInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function formatAcademyRole(role: string) {
  return academyRoleLabels[role] ?? role
}

export function createSessionAcademy(
  tenantId?: string,
  tenantName?: string
): AcademyListItem | undefined {
  if (!tenantId) return undefined

  return {
    id: tenantId,
    name: tenantName ?? "Academia",
    slug: "",
    role: "",
    isCurrent: true,
    planName: null,
    activeStudentCount: null,
    studentRange: null,
  }
}
