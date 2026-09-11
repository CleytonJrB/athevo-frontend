"use client"

import { useState } from "react"

import { useAuth } from "@/hooks/use-auth"

import {
  BadgeCheck,
  Bell,
  MoreVertical,
  CreditCard,
  LoaderCircle,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, initials, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const name = user?.name ?? "Usuario"
  const email = user?.email ?? ""
  const avatar = user?.image ?? ""

  async function handleLogout() {
    if (isLoggingOut) return

    setIsLoggingOut(true)

    try {
      await logout()
    } catch {
      setIsLoggingOut(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-busy={isLoggingOut}
            disabled={isLoggingOut}
            className="cursor-pointer disabled:cursor-wait"
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={isLoggingOut ? "Saindo..." : name}
                className="h-auto gap-3 rounded-lg p-2 transition-[background-color,box-shadow,color] hover:bg-surface-container-high data-popup-open:bg-surface-container-high group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:hover:bg-primary-container/10 group-data-[collapsible=icon]:hover:ring-1 group-data-[collapsible=icon]:hover:ring-primary-container/40 group-data-[collapsible=icon]:data-popup-open:bg-primary-container/10 group-data-[collapsible=icon]:data-popup-open:ring-1 group-data-[collapsible=icon]:data-popup-open:ring-primary-container/50"
              />
            }
          >
            <Avatar className="h-8 w-8 shrink-0 rounded-full border border-outline-variant transition-[width,height,border-color] group-hover/menu-button:border-primary-container/60 group-data-[collapsible=icon]:size-7">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="rounded-full bg-surface-container-highest">{initials}</AvatarFallback>
              {isLoggingOut && (
                <span className="absolute inset-0 flex items-center justify-center rounded-full bg-surface/80 text-primary-container">
                  <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                </span>
              )}
            </Avatar>

            <div className="grid min-w-0 flex-1 text-left text-sm leading-normal group-data-[collapsible=icon]:hidden">
              <span className="truncate font-medium text-on-surface transition-colors group-hover/menu-button:text-primary-container">{name}</span>
              <span className="truncate text-xs leading-[1.4] tracking-[0.02em] text-on-surface-variant">
                {isLoggingOut ? "Encerrando sessão..." : email}
              </span>
            </div>

            <MoreVertical className="ml-auto size-4 text-on-surface-variant group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56 rounded-lg p-2"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8 shrink-0 rounded-full border border-outline-variant">
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback className="rounded-full bg-surface-container-highest">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium text-on-surface transition-colors group-hover/menu-button:text-primary-container">{name}</span>
                    <span className="truncate text-xs leading-[1.4] tracking-[0.02em] text-on-surface-variant">{email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              disabled={isLoggingOut}
              onClick={() => void handleLogout()}
            >
              {isLoggingOut ? (
                <LoaderCircle aria-hidden="true" className="animate-spin" />
              ) : (
                <LogOut />
              )}
              {isLoggingOut ? "Saindo..." : "Sair"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
