import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export function AcademySwitcherSkeleton() {
  return (
    <SidebarMenu aria-label="Carregando workspace">
      <SidebarMenuItem>
        <div className="flex h-14 items-center gap-3 rounded-lg border border-outline-variant/40 bg-surface-container-high p-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:border-transparent group-data-[collapsible=icon]:bg-transparent">
          <Skeleton className="size-8 shrink-0 rounded-sm group-data-[collapsible=icon]:size-7 group-data-[collapsible=icon]:rounded-full" />
          <div className="grid min-w-0 flex-1 gap-1.5 group-data-[collapsible=icon]:hidden">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-3.5 w-32 max-w-full" />
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
