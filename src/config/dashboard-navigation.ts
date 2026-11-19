import {
  Activity,
  Banknote,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardCheck,
  ClipboardList,
  Dumbbell,
  LayoutDashboard,
  LayoutGrid,
  Settings,
  ShieldCheck,
  UserRound,
  UserRoundCheck,
  Users,
  UsersRound,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import {
  isTenantRole,
  TenantRole,
  type TenantRole as TenantRoleValue,
} from "@/lib/tenant-role"

export interface DashboardMenuAction {
  name: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  hasSeparator?: boolean
}

export interface DashboardMenuItem {
  name: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  implemented?: boolean
  roles?: TenantRoleValue[]
  dropdownMenus?: DashboardMenuAction[]
}

export interface DashboardMenuGroup {
  title: string
  items: DashboardMenuItem[]
}

const staffRoles: TenantRoleValue[] = [
  TenantRole.Owner,
  TenantRole.Administrator,
  TenantRole.Manager,
  TenantRole.Instructor,
  TenantRole.Receptionist,
]

const managerRoles: TenantRoleValue[] = [
  TenantRole.Owner,
  TenantRole.Administrator,
  TenantRole.Manager,
]

const financeRoles: TenantRoleValue[] = [
  ...managerRoles,
  TenantRole.Receptionist,
]

const administratorRoles: TenantRoleValue[] = [
  TenantRole.Owner,
  TenantRole.Administrator,
]

export const dashboardNavigation: DashboardMenuGroup[] = [
  {
    title: "Principal",
    items: [
      {
        name: "Visão Geral",
        url: "/dashboard",
        icon: LayoutDashboard,
        implemented: true,
        roles: staffRoles,
      },
      {
        name: "Alunos",
        url: "/dashboard/students",
        icon: Users,
        implemented: true,
        roles: staffRoles,
      },
      {
        name: "Professores",
        url: "/dashboard/trainers",
        icon: UserRound,
        implemented: true,
        roles: staffRoles,
      },
      {
        name: "Treinos",
        url: "/dashboard/workouts",
        icon: Dumbbell,
        roles: [...managerRoles, TenantRole.Instructor],
      },
      {
        name: "Exercícios",
        url: "/dashboard/exercises",
        icon: Activity,
        implemented: true,
        roles: staffRoles,
      },
      {
        name: "Agenda",
        url: "/dashboard/calendar",
        icon: CalendarDays,
        roles: staffRoles,
      },
    ],
  },
  {
    title: "Gestão",
    items: [
      {
        name: "Avaliações",
        url: "/dashboard/assessments",
        icon: ClipboardList,
        roles: staffRoles,
      },
      {
        name: "Financeiro",
        url: "/dashboard/finance",
        icon: Banknote,
        implemented: true,
        roles: financeRoles,
      },
      {
        name: "Check-in",
        url: "/dashboard/check-ins",
        icon: UserRoundCheck,
        roles: staffRoles,
      },
      {
        name: "Relatórios",
        url: "/dashboard/reports",
        icon: ChartNoAxesCombined,
        roles: managerRoles,
      },
    ],
  },
  {
    title: "Administração",
    items: [
      {
        name: "Usuários",
        url: "/dashboard/users",
        icon: UsersRound,
        roles: administratorRoles,
      },
      {
        name: "Permissões",
        url: "/dashboard/permissions",
        icon: ShieldCheck,
        roles: administratorRoles,
      },
      {
        name: "Configurações",
        url: "/dashboard/settings",
        icon: Settings,
        roles: administratorRoles,
      },
    ],
  },
]

export const studentDashboardNavigation: DashboardMenuGroup[] = [
  {
    title: "Portal do Aluno",
    items: [
      {
        name: "Início",
        url: "/dashboard",
        icon: LayoutGrid,
        implemented: true,
        roles: [TenantRole.Student],
      },
      {
        name: "Aulas & Agenda",
        url: "/dashboard/calendar",
        icon: CalendarDays,
        roles: [TenantRole.Student],
      },
      {
        name: "Meus Treinos",
        url: "/dashboard/workouts",
        icon: Activity,
        roles: [TenantRole.Student],
      },
      {
        name: "Avaliações Físicas",
        url: "/dashboard/assessments",
        icon: ClipboardCheck,
        roles: [TenantRole.Student],
      },
      {
        name: "Meu Financeiro",
        url: "/dashboard/my-finance",
        icon: Wallet,
        implemented: true,
        roles: [TenantRole.Student],
      },
      {
        name: "Meu Perfil",
        url: "/dashboard/profile",
        icon: Settings,
        roles: [TenantRole.Student],
      },
    ],
  },
]

export function getDashboardNavigation(role?: string | null) {
  if (!role || !isTenantRole(role)) return []
  if (role === TenantRole.Student) return studentDashboardNavigation

  return dashboardNavigation
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.roles || item.roles.includes(role),
      ),
    }))
    .filter((group) => group.items.length > 0)
}

const dashboardChildRouteLabels: Readonly<Record<string, string>> = {
  "/dashboard/students/new": "Cadastrar Novo Aluno",
}

export const dashboardRouteLabels: Readonly<Record<string, string>> = {
  ...Object.fromEntries(
    [...dashboardNavigation, ...studentDashboardNavigation].flatMap((group) =>
      group.items.map((item) => [item.url, item.name]),
    ),
  ),
  ...dashboardChildRouteLabels,
}

export const implementedDashboardRoutes = new Set(
  [
    ...[...dashboardNavigation, ...studentDashboardNavigation].flatMap((group) =>
      group.items.filter((item) => item.implemented).map((item) => item.url),
    ),
    ...Object.keys(dashboardChildRouteLabels),
  ],
)
