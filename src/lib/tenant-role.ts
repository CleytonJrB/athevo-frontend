export const TenantRole = {
  Administrator: "Administrator",
  Instructor: "Instructor",
  Manager: "Manager",
  Owner: "Owner",
  Receptionist: "Receptionist",
  Student: "Student",
} as const

export type TenantRole = (typeof TenantRole)[keyof typeof TenantRole]

const tenantRoleLabels: Record<TenantRole, string> = {
  [TenantRole.Owner]: "Proprietário",
  [TenantRole.Administrator]: "Administrador",
  [TenantRole.Manager]: "Gerente",
  [TenantRole.Instructor]: "Professor",
  [TenantRole.Receptionist]: "Recepção",
  [TenantRole.Student]: "Aluno",
}

const studentTrainerManagerRoles = new Set<TenantRole>([
  TenantRole.Owner,
  TenantRole.Administrator,
  TenantRole.Manager,
])

const studentDeletionRoles = new Set<TenantRole>([
  TenantRole.Owner,
  TenantRole.Administrator,
])

export function isTenantRole(role: string): role is TenantRole {
  return Object.values(TenantRole).some((candidate) => candidate === role)
}

export function canManageStudentTrainers(role?: string | null) {
  return Boolean(role && isTenantRole(role) && studentTrainerManagerRoles.has(role))
}

export function canDeleteStudents(role?: string | null) {
  return Boolean(role && isTenantRole(role) && studentDeletionRoles.has(role))
}

export function getTenantRoleLabel(role: string) {
  return isTenantRole(role) ? tenantRoleLabels[role] : role
}
