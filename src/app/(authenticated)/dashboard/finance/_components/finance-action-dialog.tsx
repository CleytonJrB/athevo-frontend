import type { FormEvent } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  StudentDiscountRecurrence,
  StudentDiscountType,
  StudentPaymentMethod,
  type StudentInvoice,
} from "@/types/student-finance"

export type FinanceInvoiceAction = "payment" | "discount" | "cancel"
export type FinanceGlobalAction = "settings" | "generate"
export type FinanceAction = FinanceInvoiceAction | FinanceGlobalAction

export interface FinanceActionPayload {
  amount?: number
  competence?: string
  discountRecurrence?: StudentDiscountRecurrence
  discountType?: StudentDiscountType
  graceDays?: number
  paidAt?: string
  paymentMethod?: StudentPaymentMethod
  priority?: number
  reason?: string
  receiptReference?: string
  reference?: string
}

interface FinanceActionDialogProps {
  action: FinanceAction | null
  invoice: StudentInvoice | null
  settingsGraceDays: number
  submitting: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (action: FinanceAction, payload: FinanceActionPayload) => void
}

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

const dialogCopy: Record<FinanceAction, { title: string; description: string; submit: string }> = {
  payment: {
    title: "Registrar pagamento manual",
    description: "Informe os dados recebidos para atualizar o saldo da fatura.",
    submit: "Confirmar pagamento",
  },
  discount: {
    title: "Programar desconto",
    description: "O desconto será considerado nas próximas competências elegíveis da matrícula.",
    submit: "Programar desconto",
  },
  cancel: {
    title: "Cancelar fatura",
    description: "A cobrança será encerrada e deixará de aceitar pagamentos.",
    submit: "Cancelar fatura",
  },
  settings: {
    title: "Configurações financeiras",
    description: "Defina os parâmetros usados na gestão de inadimplência da academia.",
    submit: "Salvar configurações",
  },
  generate: {
    title: "Gerar faturas da competência",
    description: "Crie as cobranças dos alunos ativos que possuem matrícula elegível.",
    submit: "Gerar faturas",
  },
}

export function FinanceActionDialog({
  action,
  invoice,
  settingsGraceDays,
  submitting,
  onOpenChange,
  onSubmit,
}: FinanceActionDialogProps) {
  if (!action) return null

  const copy = dialogCopy[action]

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    onSubmit(action!, {
      amount: toNumber(formData.get("amount")),
      competence: toStringValue(formData.get("competence")),
      discountRecurrence: toNumber(formData.get("recurrence")) as
        | StudentDiscountRecurrence
        | undefined,
      discountType: toNumber(formData.get("discountType")) as
        | StudentDiscountType
        | undefined,
      graceDays: toNumber(formData.get("graceDays")),
      paidAt: toStringValue(formData.get("paidAt")),
      paymentMethod: toNumber(formData.get("method")) as
        | StudentPaymentMethod
        | undefined,
      priority: toNumber(formData.get("priority")),
      reason: toStringValue(formData.get("reason")),
      receiptReference: toStringValue(formData.get("receiptReference")),
      reference: toStringValue(formData.get("reference")),
    })
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent key={`${action}-${invoice?.id ?? "global"}`}>
        <DialogHeader>
          <DialogTitle>{copy.title}</DialogTitle>
          <DialogDescription>{copy.description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 p-5">
            {invoice && (
              <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-on-surface">
                    {invoice.studentName}
                  </p>
                  <p className="text-xs text-on-surface-variant">{invoice.planName}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-primary-container">
                    {currencyFormatter.format(invoice.balance)}
                  </p>
                  <p className="text-xs text-on-surface-variant uppercase">Saldo aberto</p>
                </div>
              </div>
            )}

            {action === "payment" && invoice && (
              <>
                <Field label="Valor recebido">
                  <Input
                    name="amount"
                    type="number"
                    min="0.01"
                    max={invoice.balance}
                    step="0.01"
                    defaultValue={invoice.balance}
                    required
                  />
                </Field>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Data do recebimento">
                    <Input name="paidAt" type="date" defaultValue={today()} required />
                  </Field>
                  <Field label="Forma de pagamento">
                    <select name="method" className={selectClassName} defaultValue={StudentPaymentMethod.Pix} required>
                      <option value={StudentPaymentMethod.Pix}>PIX</option>
                      <option value={StudentPaymentMethod.Cash}>Dinheiro</option>
                      <option value={StudentPaymentMethod.DebitCard}>Cartão de débito</option>
                      <option value={StudentPaymentMethod.CreditCard}>Cartão de crédito</option>
                      <option value={StudentPaymentMethod.BankTransfer}>Transferência bancária</option>
                      <option value={StudentPaymentMethod.Other}>Outro</option>
                    </select>
                  </Field>
                </div>
                <Field label="Código da transação (opcional)">
                  <Input name="reference" placeholder="Ex.: PIX-E2E-9841029" />
                </Field>
                <Field label="Referência do comprovante (opcional)">
                  <Input name="receiptReference" placeholder="Ex.: Recibo #401" />
                </Field>
                <p className="rounded-md border border-border bg-card p-2.5 text-xs leading-relaxed text-on-surface-variant">
                  Este registro é administrativo e não movimenta valores em gateways online.
                </p>
              </>
            )}

            {action === "discount" && invoice && (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Tipo de desconto">
                    <select name="discountType" className={selectClassName} defaultValue={StudentDiscountType.FixedAmount}>
                      <option value={StudentDiscountType.FixedAmount}>Valor fixo (R$)</option>
                      <option value={StudentDiscountType.Percentage}>Percentual (%)</option>
                    </select>
                  </Field>
                  <Field label="Recorrência">
                    <select name="recurrence" className={selectClassName} defaultValue={StudentDiscountRecurrence.OneTime}>
                      <option value={StudentDiscountRecurrence.OneTime}>Uma competência</option>
                      <option value={StudentDiscountRecurrence.Recurring}>Recorrente</option>
                    </select>
                  </Field>
                </div>
                <Field label="Valor do desconto">
                  <Input name="amount" type="number" min="0.01" step="0.01" required />
                </Field>
                <Field label="Prioridade">
                  <Input name="priority" type="number" min="0" max="1000" defaultValue="100" required />
                </Field>
                <Field label="Nome ou motivo do desconto">
                  <textarea name="reason" rows={3} className={textareaClassName} required placeholder="Ex.: campanha de retenção" />
                </Field>
                <p className="rounded-md border border-primary-container/20 bg-primary-container/5 p-2.5 text-xs leading-relaxed text-on-surface-variant">
                  O desconto não altera esta fatura já emitida. Ele será aplicado a partir da próxima competência elegível.
                </p>
              </>
            )}

            {action === "cancel" && (
              <Field label="Motivo do cancelamento">
                <textarea name="reason" rows={4} className={textareaClassName} required placeholder="Informe uma justificativa para a auditoria" />
              </Field>
            )}

            {action === "settings" && (
              <>
                <Field label="Tolerância para inadimplência (dias)">
                  <Input name="graceDays" type="number" min="0" max="90" defaultValue={settingsGraceDays} required />
                </Field>
                <p className="rounded-lg border border-primary-container/20 bg-primary-container/5 p-3 text-xs leading-relaxed text-on-surface-variant">
                  A inadimplência não bloqueia automaticamente login, treinos ou check-in. A liberação continua sob controle da equipe.
                </p>
              </>
            )}

            {action === "generate" && (
              <>
                <Field label="Competência">
                  <Input name="competence" type="month" defaultValue={currentMonth()} required />
                </Field>
                <p className="rounded-lg border border-border bg-card p-3 text-xs leading-relaxed text-on-surface-variant">
                  Alunos sem matrícula ativa ou sem plano elegível serão ignorados. A operação é idempotente para a mesma competência.
                </p>
              </>
            )}
          </div>

          <DialogFooter>
            <DialogClose
              render={<Button type="button" variant="outline" size="sm" disabled={submitting} />}
            >
              Voltar
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              variant={action === "cancel" ? "destructive" : "default"}
              className={action === "cancel" ? "px-4" : "bg-primary-container px-4 font-semibold text-black hover:bg-primary-container"}
            >
              {submitting ? "Processando..." : copy.submit}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function Field({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <label className="block space-y-1.5 text-xs font-medium text-on-surface">
      <span>{label}</span>
      {children}
    </label>
  )
}

function toNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : undefined
}

function toStringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" && value ? value : undefined
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7)
}

const selectClassName =
  "h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-on-surface outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"

const textareaClassName =
  "w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"
