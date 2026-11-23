"use client"

import { useQuery } from "@tanstack/react-query"
import { isAxiosError } from "axios"
import { AlertCircle, Clock3, Info } from "lucide-react"
import { useSession } from "next-auth/react"

import { TenantRole } from "@/lib/tenant-role"
import { cn } from "@/lib/utils"
import { getCurrentSubscription } from "@/services/subscription-service"
import type { CurrentSubscription } from "@/types/subscription"

const DAY_IN_MS = 86_400_000
const EXPIRATION_WARNING_DAYS = 7

type BannerTone = "critical" | "info" | "warning"

interface BannerContent {
  description: string
  title: string
  tone: BannerTone
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  timeZone: "UTC",
  year: "numeric",
})

function getUtcDay(value: Date) {
  return Date.UTC(
    value.getUTCFullYear(),
    value.getUTCMonth(),
    value.getUTCDate(),
  )
}

function getRemainingUtcDays(value: string, now = new Date()) {
  const end = new Date(value)

  if (Number.isNaN(end.getTime())) return null

  return Math.round((getUtcDay(end) - getUtcDay(now)) / DAY_IN_MS)
}

function getBannerContent(subscription: CurrentSubscription): BannerContent | null {
  const isTrial = subscription.status === "Trialing"
  const endAt = isTrial
    ? subscription.trialEndsAt
    : (subscription.currentPeriodEndsAt ?? subscription.accessEndsAt)

  if (!endAt) {
    return subscription.hasAccess
      ? null
      : {
          title: "Plano da academia indisponível",
          description:
            "Não conseguimos confirmar um plano ativo. Entre em contato com o suporte para continuar usando a Athevo.",
          tone: "critical",
        }
  }

  const remainingDays = getRemainingUtcDays(endAt)
  if (remainingDays === null) return null

  const formattedEndDate = dateFormatter.format(new Date(endAt))

  if (!subscription.hasAccess || remainingDays < 0) {
    return {
      title: isTrial ? "Período gratuito encerrado" : "Plano vencido",
      description: `O acesso terminou em ${formattedEndDate}. Entre em contato com o suporte para renovar o plano da academia.`,
      tone: "critical",
    }
  }

  if (remainingDays === 0) {
    return {
      title: isTrial
        ? "O período gratuito termina hoje"
        : "O plano da academia vence hoje",
      description: `O acesso termina hoje, ${formattedEndDate}. Renove o plano para continuar usando todos os recursos da Athevo.`,
      tone: "warning",
    }
  }

  if (remainingDays <= EXPIRATION_WARNING_DAYS) {
    return {
      title: isTrial
        ? "O período gratuito está terminando"
        : "O plano da academia vence em breve",
      description: `Restam ${remainingDays} ${remainingDays === 1 ? "dia" : "dias"} de acesso, até ${formattedEndDate}.`,
      tone: "warning",
    }
  }

  if (isTrial) {
    return {
      title: "Período gratuito ativo",
      description: `A academia está em período de avaliação até ${formattedEndDate}.`,
      tone: "info",
    }
  }

  return null
}

const toneClasses: Record<BannerTone, string> = {
  critical: "border-red-900/70 bg-red-950/70 text-red-100",
  info: "border-sky-900/70 bg-sky-950/70 text-sky-100",
  warning: "border-amber-800/70 bg-amber-950/70 text-amber-100",
}

const toneIconClasses: Record<BannerTone, string> = {
  critical: "text-red-400",
  info: "text-sky-400",
  warning: "text-amber-400",
}

export function SubscriptionAccessBanner() {
  const { data: session, status: sessionStatus } = useSession()
  const isOwner = session?.user.role === TenantRole.Owner
  const subscriptionQuery = useQuery({
    queryKey: ["subscription", session?.user.tenantId, "current"],
    queryFn: ({ signal }) => getCurrentSubscription(signal),
    enabled:
      sessionStatus === "authenticated" &&
      isOwner &&
      Boolean(session?.user.tenantId),
    meta: { skipGlobalErrorToast: true },
    staleTime: 60_000,
  })

  if (!isOwner) return null

  if (subscriptionQuery.isError) {
    const subscriptionNotFound =
      isAxiosError(subscriptionQuery.error) &&
      subscriptionQuery.error.response?.status === 404

    return (
      <aside
        role="alert"
        className={cn(
          "flex min-h-11 shrink-0 items-start gap-3 border-b px-4 py-2.5 md:px-6",
          toneClasses.critical,
        )}
      >
        <AlertCircle
          aria-hidden="true"
          className={cn("mt-0.5 size-4 shrink-0", toneIconClasses.critical)}
        />
        <p className="text-xs leading-5 sm:text-sm">
          <strong className="font-semibold">
            {subscriptionNotFound
              ? "Não encontramos o plano da sua academia."
              : "Não foi possível consultar o plano da academia."}
          </strong>{" "}
          <span className="text-current/80">
            {subscriptionNotFound
              ? "Para continuar usando todos os recursos da Athevo, entre em contato com o suporte."
              : "Atualize a página. Se o aviso continuar, entre em contato com o suporte."}
          </span>
        </p>
      </aside>
    )
  }

  if (!subscriptionQuery.data) return null

  const content = getBannerContent(subscriptionQuery.data)
  if (!content) return null

  const Icon =
    content.tone === "critical"
      ? AlertCircle
      : content.tone === "warning"
        ? Clock3
        : Info

  return (
    <aside
      role={content.tone === "critical" ? "alert" : "status"}
      aria-live="polite"
      className={cn(
        "flex min-h-11 shrink-0 items-start gap-3 border-b px-4 py-2.5 md:px-6",
        toneClasses[content.tone],
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn("mt-0.5 size-4 shrink-0", toneIconClasses[content.tone])}
      />
      <p className="text-xs leading-5 sm:text-sm">
        <strong className="font-semibold">{content.title}.</strong>{" "}
        <span className="text-current/80">{content.description}</span>
      </p>
    </aside>
  )
}
