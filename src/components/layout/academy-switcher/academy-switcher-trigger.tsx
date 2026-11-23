import { ChevronDown, Dumbbell } from "lucide-react"

import type { AcademyListItem } from "@/types/academy"
import { TenantRole } from "@/lib/tenant-role"

interface AcademySwitcherTriggerProps {
  academy: AcademyListItem
  open: boolean
}

export function AcademySwitcherTrigger({
  academy,
  open,
}: AcademySwitcherTriggerProps) {
  const isStudent = academy.role === TenantRole.Student

  return (
    <>
      <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-sm border border-primary-container/40 bg-primary-container/20 text-primary-container group-data-[collapsible=icon]:size-7 group-data-[collapsible=icon]:rounded-full">
        <Dumbbell className="size-4" />
      </div>
      <div className="grid min-w-0 flex-1 text-left leading-normal group-data-[collapsible=icon]:hidden">
        <span className="mb-0.5 truncate text-xs font-medium leading-none text-primary-container">
          {isStudent ? "Portal do Aluno" : "Workspace ativo"}
        </span>
        <span className="truncate text-sm font-medium text-on-surface">
          {academy.name}
        </span>
      </div>
      <ChevronDown
        className={`ml-auto size-4 text-primary-container transition-transform group-data-[collapsible=icon]:hidden ${
          open ? "rotate-180" : ""
        }`}
      />
    </>
  )
}
