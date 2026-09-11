"use client"

import * as React from "react"
import {
  AudioWaveform,
  Command,
  LayoutDashboard,
  Users,
  UserRound,
  Dumbbell,
  Activity,
  CalendarDays,
  ClipboardList,
  Banknote,
  UserRoundCheck,
  ChartNoAxesCombined,
  UsersRound,
  ShieldCheck,
  Settings,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"

import { TeamSwitcher } from "./team-switcher"
import { NavMenu } from "./nav-menu"
import { NavUser } from "./nav-user"

const data = {
  teams: [
    {
      name: "Athevo Fitness Center",
      logo: Dumbbell,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Principal",
      isActive: true,
      items: [
        {
          name: "Visão Geral",
          url: "#",
          icon: LayoutDashboard,
          isActive: true,
        },
        {
          name: "Alunos",
          url: "#",
          icon: Users,
        },
        {
          name: "Professores",
          url: "#",
          icon: UserRound,
        },
        {
          name: "Treinos",
          url: "#",
          icon: Dumbbell,
        },
        {
          name: "Exercícios",
          url: "#",
          icon: Activity,
        },
        {
          name: "Agenda",
          url: "#",
          icon: CalendarDays,
        },
      ],
    },
    {
      title: "Gestão",
      isActive: true,
      items: [
        {
          name: "Avaliações",
          url: "#",
          icon: ClipboardList,
        },
        {
          name: "Financeiro",
          url: "#",
          icon: Banknote,
        },
        {
          name: "Check-in",
          url: "#",
          icon: UserRoundCheck,
        },
        {
          name: "Relatórios",
          url: "#",
          icon: ChartNoAxesCombined,
        },
      ],
    },
    {
      title: "Administração",
      isActive: true,
      items: [
        {
          name: "Usuários",
          url: "#",
          icon: UsersRound,
        },
        {
          name: "Permissões",
          url: "#",
          icon: ShieldCheck,
        },
        {
          name: "Configurações",
          url: "#",
          icon: Settings,
        },
      ],
    },
  ],
}

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className={cn("border-outline-variant", className)} {...props}>
      <SidebarHeader className="mb-8 px-4 pt-6 pb-0 group-data-[collapsible=icon]:px-2">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent className="gap-6 px-4 pb-4 group-data-[collapsible=icon]:px-2">
        {data.navMain.map((group) => <NavMenu key={group.title} {...group} />)}
      </SidebarContent>

      <SidebarFooter className="border-t border-outline-variant px-4 pt-3 pb-3 group-data-[collapsible=icon]:px-2">
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
