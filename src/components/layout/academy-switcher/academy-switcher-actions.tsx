import { CirclePlus, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"

interface AcademySwitcherActionsProps {
  onAction: () => void
}

export function AcademySwitcherActions({
  onAction,
}: AcademySwitcherActionsProps) {
  return (
    <div className="flex flex-col gap-0.5 border-t border-outline-variant/40 bg-surface-container-lowest/60 p-1.5">
      <Button
        href="/dashboard/workspaces/new"
        variant="ghost"
        className="h-8 justify-start gap-2 px-2.5 text-xs text-on-surface-variant hover:bg-surface-container-high hover:text-primary-container"
        onClick={onAction}
      >
        <CirclePlus className="size-4 text-primary-container transition-transform group-hover/button:scale-110" />
        Criar nova unidade / workspace
      </Button>
      <Button
        href="/dashboard/permissions"
        variant="ghost"
        className="h-8 justify-start gap-2 px-2.5 text-xs text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
        onClick={onAction}
      >
        <Settings className="size-4 transition-transform group-hover/button:rotate-45 group-hover/button:text-primary-container" />
        Gerenciar unidades e permissões
      </Button>
    </div>
  )
}
