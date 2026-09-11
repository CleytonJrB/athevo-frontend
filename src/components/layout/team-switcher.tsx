"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string
    logo: React.ElementType
    plan: string
  }[]
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="cursor-pointer"
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={activeTeam.name}
                className="h-auto gap-3 rounded-lg border border-transparent p-2 transition-[background-color,border-color,box-shadow,color] hover:border-outline-variant hover:bg-surface-container-high data-popup-open:border-outline-variant data-popup-open:bg-surface-container-high group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:hover:border-primary-container/40 group-data-[collapsible=icon]:hover:bg-primary-container/10 group-data-[collapsible=icon]:hover:ring-1 group-data-[collapsible=icon]:hover:ring-primary-container/40 group-data-[collapsible=icon]:data-popup-open:border-primary-container/50 group-data-[collapsible=icon]:data-popup-open:bg-primary-container/10 group-data-[collapsible=icon]:data-popup-open:ring-1 group-data-[collapsible=icon]:data-popup-open:ring-primary-container/50"
              />
            }
          >
            <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-sm border border-primary-container/30 bg-primary-container/20 text-primary-container transition-[width,height,background-color,border-color] group-hover/menu-button:border-primary-container/60 group-hover/menu-button:bg-primary-container/25 group-data-[collapsible=icon]:size-7 group-data-[collapsible=icon]:rounded-full">
              <activeTeam.logo className="size-4" />
            </div>
            
            <div className="grid min-w-0 flex-1 text-left text-sm leading-normal group-data-[collapsible=icon]:hidden">
              <span className="truncate text-xs leading-[1.4] tracking-[0.02em] text-on-surface-variant group-hover/menu-button:text-on-surface">Workspace</span>
              <span className="truncate font-medium text-on-surface">{activeTeam.name}</span>
            </div>
            <ChevronsUpDown className="ml-auto text-on-surface-variant group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>
          
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Teams
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => setActiveTeam(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <team.logo className="size-3.5 shrink-0" />
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
