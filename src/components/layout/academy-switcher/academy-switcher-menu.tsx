"use client"

import * as React from "react"
import { Search } from "lucide-react"

import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { formatAcademyCount } from "@/lib/academy"
import { normalizeText } from "@/lib/formats"
import { cn } from "@/lib/utils"
import type { AcademyListItem } from "@/types/academy"

import { AcademySwitcherActions } from "./academy-switcher-actions"
import { AcademySwitcherItem } from "./academy-switcher-item"

interface AcademySwitcherMenuProps {
  academies: AcademyListItem[]
  activeAcademyId?: string
  switchingId: string | null
  onClose: () => void
  onSelect: (academy: AcademyListItem) => void
}

export function AcademySwitcherMenu({
  academies,
  activeAcademyId,
  switchingId,
  onClose,
  onSelect,
}: AcademySwitcherMenuProps) {
  const [search, setSearch] = React.useState("")
  const deferredSearch = React.useDeferredValue(search)
  const normalizedSearch = normalizeText(deferredSearch.trim())
  const filteredAcademies = normalizedSearch
    ? academies.filter((academy) =>
        normalizeText(`${academy.name} ${academy.slug}`).includes(normalizedSearch)
      )
    : academies

  return (
    <DropdownMenuContent
      className="z-60 w-[min(20rem,calc(100vw-2rem))] min-w-0 overflow-hidden rounded-lg border border-outline-variant/50 bg-surface-container-low p-0 shadow-2xl backdrop-blur-xl"
      align="start"
      side="bottom"
      sideOffset={6}
    >
      <div className="border-b border-outline-variant/40 p-2">
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-2.5 size-3.5 text-on-surface-variant" />
          <Input
            autoFocus
            aria-label="Buscar workspace ou academia"
            className="h-9 border-outline-variant/40 bg-surface-container-lowest/70 pr-12 pl-8 text-xs text-on-surface shadow-none placeholder:text-on-surface-variant focus-visible:border-primary-container focus-visible:ring-2 focus-visible:ring-primary-container/20"
            placeholder="Buscar academia ou workspace..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Escape") event.stopPropagation()
            }}
          />
          <kbd className="pointer-events-none absolute right-2 rounded border border-outline-variant/40 bg-surface-container-high px-1.5 py-0.5 font-mono text-[9px] text-on-surface-variant">
            ESC
          </kbd>
        </div>
      </div>

      <DropdownMenuGroup
        className={cn(
          "flex max-h-72 flex-col gap-1 overflow-y-auto p-2",
          switchingId && "cursor-progress"
        )}
      >
        <DropdownMenuLabel className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-on-surface-variant uppercase">
          <span>Workspaces e unidades</span>
          <span className="font-mono text-[10px] font-normal text-on-surface-variant/60 normal-case">
            {formatAcademyCount(filteredAcademies.length)}
          </span>
        </DropdownMenuLabel>

        {filteredAcademies.map((academy) => (
          <AcademySwitcherItem
            key={academy.id}
            academy={academy}
            active={academy.id === activeAcademyId}
            disabled={Boolean(switchingId)}
            switching={academy.id === switchingId}
            onSelect={onSelect}
          />
        ))}

        {filteredAcademies.length === 0 && (
          <p className="px-2 py-6 text-center text-xs text-on-surface-variant">
            Nenhuma academia encontrada.
          </p>
        )}
      </DropdownMenuGroup>

      <AcademySwitcherActions onAction={onClose} />
    </DropdownMenuContent>
  )
}
