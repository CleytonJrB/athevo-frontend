"use client"

import { useState } from "react"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight, ReceiptText } from "lucide-react"
import { useSession } from "next-auth/react"

import { Button } from "@/components/ui/button"
import {
  canManageStudentFinance,
  canManageStudentFinanceSettings,
} from "@/lib/tenant-role"
import { appToast } from "@/lib/toast"
import {
  cancelStudentInvoice,
  createStudentDiscount,
  generateStudentInvoices,
  getStudentFinanceSettings,
  listStudentInvoices,
  registerStudentPayment,
  updateStudentFinanceSettings,
} from "@/services/student-finance-service"
import {
  StudentDiscountRecurrence,
  StudentDiscountType,
  type StudentInvoice,
  type StudentInvoiceStatus,
} from "@/types/student-finance"

import {
  FinanceActionDialog,
  type FinanceAction,
  type FinanceActionPayload,
  type FinanceInvoiceAction,
} from "./finance-action-dialog"
import { FinanceFilters, type InvoiceStatusFilter } from "./finance-filters"
import { FinancePageHeader } from "./finance-page-header"
import { FinanceSummary } from "./finance-summary"
import { InvoiceDetailsSheet } from "./invoice-details-sheet"
import { InvoicesTable } from "./invoices-table"

const pageSize = 10

export function FinanceDashboard() {
  const { data: session, status: sessionStatus } = useSession()
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<InvoiceStatusFilter>("all")
  const [page, setPage] = useState(1)
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  const [action, setAction] = useState<FinanceAction | null>(null)
  const [actionInvoiceId, setActionInvoiceId] = useState<string | null>(null)

  const canManage = canManageStudentFinance(session?.user.role)
  const canManageSettings = canManageStudentFinanceSettings(session?.user.role)
  const queryEnabled =
    sessionStatus === "authenticated" && Boolean(session?.user.tenantId)

  const invoicesQuery = useQuery({
    queryKey: [
      "student-finance",
      session?.user.tenantId,
      "invoices",
      { page, pageSize, status },
    ],
    queryFn: ({ signal }) =>
      listStudentInvoices(
        {
          page,
          pageSize,
          status: status === "all" ? undefined : status,
        },
        signal,
      ),
    enabled: queryEnabled,
    placeholderData: keepPreviousData,
    meta: { errorTitle: "Não foi possível carregar as faturas" },
  })

  const settingsQuery = useQuery({
    queryKey: ["student-finance", session?.user.tenantId, "settings"],
    queryFn: ({ signal }) => getStudentFinanceSettings(signal),
    enabled: queryEnabled,
    meta: { errorTitle: "Não foi possível carregar as configurações" },
  })

  const financeMutation = useMutation({
    mutationFn: async ({
      action: nextAction,
      invoice,
      payload,
    }: {
      action: FinanceAction
      invoice: StudentInvoice | null
      payload: FinanceActionPayload
    }) => {
      if (nextAction === "settings") {
        return updateStudentFinanceSettings(payload.graceDays ?? 0)
      }

      if (nextAction === "generate") {
        return generateStudentInvoices(`${payload.competence}-01`)
      }

      if (!invoice) throw new Error("Selecione uma fatura para continuar.")

      if (nextAction === "payment") {
        return registerStudentPayment(invoice.id, {
          amount: payload.amount ?? 0,
          paidAt: new Date(`${payload.paidAt}T12:00:00.000Z`).toISOString(),
          method: payload.paymentMethod!,
          reference: payload.reference,
          receiptReference: payload.receiptReference,
        })
      }

      if (nextAction === "discount") {
        const validFrom = getNextCompetence(invoice.competence)

        return createStudentDiscount({
          enrollmentId: invoice.enrollmentId,
          name: payload.reason ?? "Desconto administrativo",
          type: payload.discountType ?? StudentDiscountType.FixedAmount,
          recurrence:
            payload.discountRecurrence ?? StudentDiscountRecurrence.OneTime,
          value: payload.amount ?? 0,
          currency:
            payload.discountType === StudentDiscountType.Percentage
              ? undefined
              : invoice.currency,
          priority: payload.priority ?? 100,
          validFrom,
          validUntil:
            payload.discountRecurrence === StudentDiscountRecurrence.OneTime
              ? validFrom
              : undefined,
        })
      }

      return cancelStudentInvoice(invoice.id, payload.reason ?? "")
    },
    meta: {
      errorFallback: "Não foi possível concluir a operação. Tente novamente.",
      errorTitle: "Erro na operação financeira",
    },
    onSuccess: async (result, variables) => {
      closeActionDialog()
      await queryClient.invalidateQueries({
        queryKey: ["student-finance"],
      })

      if (variables.action === "generate" && result && "created" in result) {
        appToast.success(
          "Faturas processadas",
          `${result.created} criada(s) e ${result.skipped} ignorada(s).`,
        )
        return
      }

      const messages: Record<Exclude<FinanceAction, "generate">, string> = {
        settings: "Configurações salvas",
        payment: "Pagamento registrado",
        discount: "Desconto cadastrado",
        cancel: "Fatura cancelada",
      }
      appToast.success(
        messages[variables.action as Exclude<FinanceAction, "generate">],
        variables.action === "discount"
          ? "O desconto será aplicado na próxima fatura elegível; faturas já emitidas não são alteradas."
          : undefined,
      )
    },
  })

  const invoices = invoicesQuery.data?.items ?? []
  const selectedInvoice =
    invoices.find((invoice) => invoice.id === selectedInvoiceId) ?? null
  const actionInvoice =
    invoices.find((invoice) => invoice.id === actionInvoiceId) ?? null

  function openInvoiceAction(
    nextAction: FinanceInvoiceAction,
    invoice: StudentInvoice,
  ) {
    setActionInvoiceId(invoice.id)
    setAction(nextAction)
  }

  function openGlobalAction(nextAction: Extract<FinanceAction, "settings" | "generate">) {
    setActionInvoiceId(null)
    setAction(nextAction)
  }

  function closeActionDialog() {
    setAction(null)
    setActionInvoiceId(null)
  }

  function handleStatusChange(nextStatus: StudentInvoiceStatus | "all") {
    setStatus(nextStatus)
    setPage(1)
  }

  return (
    <div className="flex flex-col gap-6">
      <FinancePageHeader
        canGenerate={canManage}
        canOpenSettings={canManageSettings}
        onGenerateInvoices={() => openGlobalAction("generate")}
        onOpenSettings={() => openGlobalAction("settings")}
      />

      <FinanceSummary invoices={invoices} />

      <FinanceFilters status={status} onStatusChange={handleStatusChange} />

      <section
        aria-label="Faturas dos alunos"
        aria-busy={invoicesQuery.isFetching}
        className="overflow-hidden rounded-xl border border-border bg-surface shadow-2xl shadow-black/30"
      >
        {invoicesQuery.isError ? (
          <FinanceMessage
            title="Não foi possível carregar as faturas"
            description="Verifique sua conexão e tente novamente."
            actionLabel="Tentar novamente"
            onAction={() => invoicesQuery.refetch()}
          />
        ) : invoicesQuery.isPending ? (
          <FinanceMessage
            title="Carregando faturas"
            description="Consultando os dados financeiros da academia."
          />
        ) : invoices.length === 0 ? (
          <FinanceMessage
            title="Nenhuma fatura encontrada"
            description={
              status === "all"
                ? "As faturas geradas aparecerão nesta listagem."
                : "Não há faturas com o status selecionado."
            }
          />
        ) : (
          <>
            <InvoicesTable
              canManage={canManage}
              invoices={invoices}
              onView={(invoice) => setSelectedInvoiceId(invoice.id)}
              onAction={openInvoiceAction}
            />
            <FinancePagination
              hasNextPage={invoicesQuery.data?.hasNextPage ?? false}
              page={page}
              itemCount={invoices.length}
              onPageChange={setPage}
            />
          </>
        )}
      </section>

      <InvoiceDetailsSheet
        canManage={canManage}
        invoice={selectedInvoice}
        open={selectedInvoice !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedInvoiceId(null)
        }}
        onAction={openInvoiceAction}
      />

      <FinanceActionDialog
        action={action}
        invoice={actionInvoice}
        settingsGraceDays={settingsQuery.data?.gracePeriodDays ?? 5}
        submitting={financeMutation.isPending}
        onOpenChange={(open) => {
          if (!open && !financeMutation.isPending) closeActionDialog()
        }}
        onSubmit={(nextAction, payload) =>
          financeMutation.mutate({
            action: nextAction,
            invoice: actionInvoice,
            payload,
          })
        }
      />
    </div>
  )
}

function getNextCompetence(competence: string) {
  const [year, month] = competence.split("-").map(Number)
  return new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10)
}

function FinanceMessage({
  actionLabel,
  description,
  onAction,
  title,
}: {
  actionLabel?: string
  description: string
  onAction?: () => void
  title: string
}) {
  return (
    <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
      <span className="mb-5 flex size-14 items-center justify-center rounded-full border border-primary-container/20 bg-primary-container/10 text-primary-container">
        <ReceiptText aria-hidden="true" className="size-7" />
      </span>
      <p className="font-medium text-on-surface">{title}</p>
      <p className="mt-1 max-w-md text-sm text-on-surface-variant">{description}</p>
      {actionLabel && onAction && (
        <Button type="button" variant="outline" onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

function FinancePagination({
  hasNextPage,
  itemCount,
  onPageChange,
  page,
}: {
  hasNextPage: boolean
  itemCount: number
  onPageChange: (page: number) => void
  page: number
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-4 sm:px-6">
      <p className="text-xs font-medium text-on-surface-variant">
        Página {page} · {itemCount} fatura(s)
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden="true" />
          Anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
