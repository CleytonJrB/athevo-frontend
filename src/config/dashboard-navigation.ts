import {
  Activity,
  BadgeCheck,
  Banknote,
  Bell,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardList,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
  UserRoundCheck,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react"

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
  dropdownMenus?: DashboardMenuAction[]
}

export interface DashboardMenuGroup {
  title: string
  items: DashboardMenuItem[]
}

export const dashboardNavigation: DashboardMenuGroup[] = [
  {
    title: "Principal",
    items: [
      {
        name: "Visão Geral",
        url: "/dashboard",
        icon: LayoutDashboard,
        implemented: true,
      },
      {
        name: "Alunos",
        url: "/dashboard/students",
        icon: Users,
        implemented: true,
      },
      { name: "Professores", url: "/dashboard/trainers", icon: UserRound },
      { name: "Treinos", url: "/dashboard/workouts", icon: Dumbbell },
      {
        name: "Exercícios",
        url: "/dashboard/exercises",
        icon: Activity,
        implemented: true,
      },
      { name: "Agenda", url: "/dashboard/calendar", icon: CalendarDays },
    ],
  },
  {
    title: "Gestão",
    items: [
      {
        name: "Avaliações",
        url: "/dashboard/assessments",
        icon: ClipboardList,
      },
      { name: "Financeiro", url: "/dashboard/finance", icon: Banknote },
      { name: "Check-in", url: "/dashboard/check-ins", icon: UserRoundCheck },
      { name: "Relatórios", url: "/dashboard/reports", icon: ChartNoAxesCombined },
    ],
  },
  {
    title: "Administração",
    items: [
      { name: "Usuários", url: "/dashboard/users", icon: UsersRound },
      { name: "Permissões", url: "/dashboard/permissions", icon: ShieldCheck },
      { name: "Configurações", url: "/dashboard/settings", icon: Settings },
    ],
  },
]

export const dashboardRouteLabels: Readonly<Record<string, string>> =
  Object.fromEntries(
    dashboardNavigation.flatMap((group) =>
      group.items.map((item) => [item.url, item.name]),
    ),
  )

export const implementedDashboardRoutes = new Set(
  dashboardNavigation.flatMap((group) =>
    group.items.filter((item) => item.implemented).map((item) => item.url),
  ),
)

export const userMenu: DashboardMenuAction[] = [
  {
    name: "Upgrade to Pro",
    url: "#",
    icon: Sparkles,
    hasSeparator: true,
    isActive: false,
  },
  {
    name: "Account",
    url: "#",
    icon: BadgeCheck,
    isActive: false,
  },
  {
    name: "Billing",
    url: "#",
    icon: CreditCard,
    isActive: false,
  },
  {
    name: "Notifications",
    url: "#",
    icon: Bell,
    isActive: false,
  },
]
