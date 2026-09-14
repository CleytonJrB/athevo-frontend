"use client"

import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { cn } from "@/lib/utils"
import { dashboardNavigation } from "@/config/dashboard-navigation"

import { AcademySwitcher } from "./academy-switcher"
import { NavMenu } from "./nav-menu"
import { NavUser } from "./nav-user"

export function AppSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" className={cn("border-outline-variant", className)} {...props}>
      <SidebarHeader className="mb-8 px-4 pt-6 pb-0 group-data-[collapsible=icon]:px-2">
        <AcademySwitcher />
      </SidebarHeader>

      <SidebarContent className="gap-6 px-4 pb-4 group-data-[collapsible=icon]:px-2">
        {dashboardNavigation.map((group) => (
          <NavMenu key={group.title} {...group} />
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-outline-variant px-4 pt-3 pb-3 group-data-[collapsible=icon]:px-2">
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
