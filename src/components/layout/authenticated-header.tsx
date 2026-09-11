"use client"

import { Fragment, type ComponentProps } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Search } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export type AuthBreadcrumbItem = {
  label: string
  href?: string
}

// Register page labels here as authenticated routes are added.
const routeLabels: Record<string, string> = {
  "/dashboard": "Visão Geral",
}

function getRouteBreadcrumbs(pathname: string): AuthBreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean)

  return [
    { label: "Athevo", href: "/dashboard" },
    ...segments.map((segment, index) => {
      const href = `/${segments.slice(0, index + 1).join("/")}`
      const label = routeLabels[href]

      return {
        label: label ?? segment.replace(/-/g, " "),
        // Only registered pages are links; a URL segment may just be a folder.
        href: label ? href : undefined,
      }
    }),
  ]
}

export interface AuthenticatedHeaderProps {
  /** Ancestors may have links; the final item always represents the current page. */
  breadcrumbs?: [AuthBreadcrumbItem, ...AuthBreadcrumbItem[]]
  searchProps?: Omit<ComponentProps<"input">, "type" | "className">
  onNotificationsClick?: () => void
  hasUnreadNotifications?: boolean
  className?: string
}

export function AuthenticatedHeader({
  breadcrumbs,
  searchProps,
  onNotificationsClick,
  hasUnreadNotifications = false,
  className,
}: AuthenticatedHeaderProps = {}) {
  const pathname = usePathname()
  const items = breadcrumbs ?? getRouteBreadcrumbs(pathname)

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-outline-variant bg-surface-glass px-4 backdrop-blur-md md:px-6",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger
          aria-label="Alternar menu lateral"
          className="-ml-2 shrink-0 text-on-surface-variant hover:bg-surface-container-high hover:text-primary-container"
        />
        <Breadcrumb aria-label="Caminho de navegação" className="min-w-0">
          <BreadcrumbList className="flex-nowrap gap-2 text-xs font-medium tracking-[0.02em] text-on-surface-variant">
            {items.map((item, index) => {
              const isCurrentPage = index === items.length - 1

              return (
                <Fragment key={`${item.href ?? item.label}-${index}`}>
                  {index > 0 && (
                    <BreadcrumbSeparator className="hidden shrink-0 sm:block" />
                  )}
                  <BreadcrumbItem
                    className={cn(
                      "min-w-0",
                      !isCurrentPage && "hidden sm:inline-flex",
                    )}
                  >
                    {isCurrentPage ? (
                      <BreadcrumbPage className="truncate font-medium text-on-surface" title={item.label}>
                        {item.label}
                      </BreadcrumbPage>
                    ) : item.href ? (
                      <BreadcrumbLink
                        render={<Link href={item.href} />}
                        className="truncate hover:text-primary-container"
                        title={item.label}
                      >
                        {item.label}
                      </BreadcrumbLink>
                    ) : (
                      <span className="truncate" title={item.label}>{item.label}</span>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <div className="relative hidden md:block">
          <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="search"
            aria-label="Buscar no sistema"
            placeholder="Buscar..."
            disabled={!searchProps}
            {...searchProps}
            className="h-9 w-48 rounded-[6px] border border-outline-variant bg-surface-container py-1.5 pr-4 pl-10 text-sm text-on-surface outline-none transition-[border-color,box-shadow] placeholder:text-on-surface-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 disabled:cursor-not-allowed lg:w-64"
          />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={hasUnreadNotifications ? "Notificações não lidas" : "Notificações"}
          disabled={!onNotificationsClick}
          onClick={onNotificationsClick}
          className="relative rounded-full text-on-surface-variant hover:bg-surface-container-high hover:text-primary-container"
        >
          <Bell aria-hidden="true" className="size-5" />
          {hasUnreadNotifications && (
            <span className="absolute top-1 right-1 size-2 rounded-full border border-surface bg-primary-container" />
          )}
        </Button>
      </div>
    </header>
  )
}
