import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu";

import { SidebarMenuAction } from "../ui/sidebar";

import { MoreHorizontal } from "lucide-react"

import type { DashboardMenuAction } from "@/config/dashboard-navigation"

interface INavMenuDropDown {
  isMobile: boolean
  items?: DashboardMenuAction[]
}

export function NavMenuDropDown({ isMobile, items = [] }: INavMenuDropDown) {
  function renderMenuItem({ item, index }: { item: DashboardMenuAction, index: number }) {
    return (
      <React.Fragment key={index}>
        <DropdownMenuItem>
          {/* <Folder className="text-muted-foreground" /> */}
          <item.icon />

          <span>{item.name || ""}</span>
        </DropdownMenuItem>

        {!!item.hasSeparator && <DropdownMenuSeparator />}
      </React.Fragment>
    )
  }

  if (items.length <= 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<SidebarMenuAction showOnHover />}>
        <MoreHorizontal />
        <span className="sr-only">More</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-48 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align={isMobile ? "end" : "start"}
      >
        {items.map((item, index) => renderMenuItem({ item, index }))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
