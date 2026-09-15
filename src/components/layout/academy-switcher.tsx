"use client"

import * as React from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { createSessionAcademy } from "@/lib/academy"
import { appToast } from "@/lib/toast"
import { listAcademies } from "@/services/academies-service"
import type { AcademyListItem } from "@/types/academy"

import { AcademySwitcherMenu } from "./academy-switcher/academy-switcher-menu"
import { AcademySwitcherBackdrop } from "./academy-switcher/academy-switcher-backdrop"
import { AcademySwitcherSkeleton } from "./academy-switcher/academy-switcher-skeleton"
import { AcademySwitcherTrigger } from "./academy-switcher/academy-switcher-trigger"

const academiesQueryKey = ["academies"] as const

export function AcademySwitcher() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session, status, update } = useSession()
  const [open, setOpen] = React.useState(false)
  const [switchingId, setSwitchingId] = React.useState<string | null>(null)
  const { data: academies = [], isPending } = useQuery({
    queryKey: academiesQueryKey,
    queryFn: ({ signal }) => listAcademies(signal),
    enabled: status === "authenticated",
    staleTime: 60_000,
    meta: {
      errorTitle: "Não foi possível carregar as academias",
    },
  })

  const activeAcademy =
    academies.find((academy) => academy.id === session?.user.tenantId) ??
    academies.find((academy) => academy.isCurrent) ??
    createSessionAcademy(session?.user.tenantId, session?.user.tenantName)

  if ((isPending || status === "loading") && !activeAcademy) {
    return <AcademySwitcherSkeleton />
  }

  async function switchAcademy(academy: AcademyListItem) {
    if (academy.id === activeAcademy?.id || switchingId) return

    setSwitchingId(academy.id)

    try {
      const updatedSession = await update({ tenantId: academy.id })
      if (!updatedSession || updatedSession.error === "TenantSwitchError") {
        throw new Error("Não foi possível trocar de academia")
      }

      await queryClient.invalidateQueries({ queryKey: academiesQueryKey })
      setOpen(false)
      appToast.success(
        "Academia alterada",
        `${academy.name} agora é a academia ativa.`,
      )
      router.refresh()
    } catch (switchTenantError) {
      appToast.error(switchTenantError, {
        fallback: "Não foi possível trocar de academia.",
        title: "Falha ao alterar academia",
      })
    } finally {
      setSwitchingId(null)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {open && (
          <AcademySwitcherBackdrop onDismiss={() => setOpen(false)} />
        )}
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger
            className="cursor-pointer"
            disabled={!activeAcademy}
            render={
              <SidebarMenuButton
                size="lg"
                tooltip={activeAcademy?.name ?? "Workspace"}
                className="h-auto gap-3 rounded-lg border border-primary-container/30 bg-surface-container-high p-2 shadow-sm transition-[background-color,border-color,box-shadow,color] hover:border-primary-container/50 hover:bg-surface-container-high data-popup-open:border-primary-container/60 data-popup-open:bg-surface-container-high data-popup-open:shadow-md group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:hover:border-primary-container/40 group-data-[collapsible=icon]:hover:bg-primary-container/10 group-data-[collapsible=icon]:data-popup-open:border-primary-container/50 group-data-[collapsible=icon]:data-popup-open:bg-primary-container/10"
              />
            }
          >
            {activeAcademy && (
              <AcademySwitcherTrigger academy={activeAcademy} open={open} />
            )}
          </DropdownMenuTrigger>

          <AcademySwitcherMenu
            academies={academies}
            activeAcademyId={activeAcademy?.id}
            switchingId={switchingId}
            onClose={() => setOpen(false)}
            onSelect={switchAcademy}
          />
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
