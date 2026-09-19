import type { MouseEvent } from "react"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

type PaginationEntry = number | "ellipsis-start" | "ellipsis-end"

export interface DataPaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  anchorId?: string
  className?: string
  emptyMessage?: string
  itemLabel?: string
}

function getVisiblePages(currentPage: number, pageCount: number): PaginationEntry[] {
  if (pageCount <= 5) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  if (currentPage <= 3) return [1, 2, 3, "ellipsis-end", pageCount]
  if (currentPage >= pageCount - 2) {
    return [1, "ellipsis-start", pageCount - 2, pageCount - 1, pageCount]
  }

  return [1, "ellipsis-start", currentPage, "ellipsis-end", pageCount]
}

export function DataPagination({
  page,
  pageSize,
  total,
  onPageChange,
  anchorId,
  className,
  emptyMessage = "Nenhum item encontrado",
  itemLabel = "itens",
}: DataPaginationProps) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(Math.max(page, 1), pageCount)
  const firstItem = total === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const lastItem = Math.min(currentPage * pageSize, total)
  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === pageCount
  const pageAnchor = anchorId ? `#${anchorId}` : "#"

  function handlePageChange(
    event: MouseEvent<HTMLAnchorElement>,
    nextPage: number,
  ) {
    event.preventDefault()

    if (
      nextPage < 1 ||
      nextPage > pageCount ||
      nextPage === currentPage
    ) {
      return
    }

    onPageChange(nextPage)
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-border bg-surface px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      <p className="text-xs font-medium text-on-surface-variant" aria-live="polite">
        {total === 0
          ? emptyMessage
          : `Mostrando ${firstItem} a ${lastItem} de ${total} ${itemLabel}`}
      </p>

      <Pagination className="mx-0 w-auto justify-start lg:justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={pageAnchor}
              aria-disabled={isFirstPage}
              tabIndex={isFirstPage ? -1 : undefined}
              onClick={(event) => handlePageChange(event, currentPage - 1)}
              className={cn(
                "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                isFirstPage && "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>

          {getVisiblePages(currentPage, pageCount).map((entry) =>
            typeof entry === "number" ? (
              <PaginationItem key={entry}>
                <PaginationLink
                  href={pageAnchor}
                  isActive={entry === currentPage}
                  aria-label={`Ir para a página ${entry}`}
                  onClick={(event) => handlePageChange(event, entry)}
                  className={cn(
                    "border-transparent text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                    entry === currentPage &&
                      "border-border bg-surface-container-high text-on-surface hover:bg-surface-container-high",
                  )}
                >
                  {entry}
                </PaginationLink>
              </PaginationItem>
            ) : (
              <PaginationItem key={entry}>
                <PaginationEllipsis className="text-on-surface-variant" />
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              href={pageAnchor}
              aria-disabled={isLastPage}
              tabIndex={isLastPage ? -1 : undefined}
              onClick={(event) => handlePageChange(event, currentPage + 1)}
              className={cn(
                "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                isLastPage && "pointer-events-none opacity-50",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
