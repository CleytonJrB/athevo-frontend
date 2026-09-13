"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import type { DashboardMenuGroup } from "@/config/dashboard-navigation"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavMenuDropDown } from "./nav-menu-dropdown"

export function NavMenu({
  title,
  items,
}: DashboardMenuGroup) {
  const { isMobile } = useSidebar()
  const pathname = usePathname()

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupLabel
        className="mb-2 h-4 rounded-none px-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant group-data-[collapsible=icon]:hidden">
        {title}
      </SidebarGroupLabel>

      <SidebarMenu className="gap-1">
        {items.map((item) => {
          const isCurrentRoute =
            item.url === pathname ||
            (item.url !== "/dashboard" && pathname.startsWith(`${item.url}/`))
          const isActive = item.isActive ?? isCurrentRoute

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                render={
                  <Link
                    href={item.url}
                    aria-current={isActive ? "page" : undefined}
                  />
                }
                isActive={isActive}
                tooltip={item.name}
                className="h-10 gap-3 rounded-[6px] px-3 py-2 font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface data-active:border-l-2 data-active:border-primary-container data-active:bg-primary-container/10 data-active:font-bold data-active:text-primary-container [&_svg]:size-6 group-data-[collapsible=icon]:[&_svg]:size-4"
              >
                <item.icon />

                <span>{item.name}</span>
              </SidebarMenuButton>

              <NavMenuDropDown
                isMobile={isMobile}
                items={item.dropdownMenus}
              />
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
