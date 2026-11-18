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

import type { Invoice } from "../_data/invoices"

export type FinanceInvoiceAction = "payment" | "discount" | "reversal" | "cancel"
export type FinanceGlobalAction = "settings" | "generate"
export type FinanceAction = FinanceInvoiceAction | FinanceGlobalAction

export interface FinanceActionPayload {
  amount?: number
  competence?: string
  dueDate?: string
  graceDays?: number
  reason?: string
}

interface FinanceActionDialogProps {
  action: FinanceAction | null
  invoice: Invoice | null
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
    title: "Aplicar desconto na fatura",
    description: "O desconto ficará registrado no histórico financeiro.",
    submit: "Salvar desconto",
  },
  reversal: {
    title: "Reverter pagamento",
    description: "A reversão exige uma justificativa e será registrada na auditoria.",
    submit: "Confirmar reversão",
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
    description: "Crie em lote as cobranças dos alunos ativos elegíveis.",
    submit: "Processar faturas",
  },
}

export function FinanceActionDialog({
  action,
  invoice,
  onOpenChange,
  onSubmit,
}: FinanceActionDialogProps) {
  if (!action) return null

  const copy = dialogCopy[action]

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const rawAmount = toNumber(formData.get("amount"))
    const discountType = toStringValue(formData.get("discountType"))
    const amount =
      action === "discount" &&
      discountType === "percentage" &&
      invoice &&
      rawAmount !== undefined
        ? (invoice.openAmount * rawAmount) / 100
        : rawAmount

    onSubmit(action!, {
      amount,
      competence: toStringValue(formData.get("competence")),
      dueDate: toStringValue(formData.get("dueDate")),
      graceDays: toNumber(formData.get("graceDays")),
      reason: toStringValue(formData.get("reason")),
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
                  <p className="truncate text-sm font-medium text-on-surface">{invoice.studentName}</p>
                  <p className="text-xs text-on-surface-variant">#{invoice.enrollment}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-primary-container">
                    {currencyFormatter.format(invoice.openAmount)}
                  </p>
                  <p className="text-[10px] text-on-surface-variant uppercase">Saldo aberto</p>
                </div>
              </div>
            )}

            {action === "payment" && invoice && (
              <>
                <Field label="Valor recebido">
                  <Input name="amount" type="number" min="0.01" max={invoice.openAmount} step="0.01" defaultValue={invoice.openAmount} required />
                </Field>
                <p className="-mt-2 text-[11px] text-on-surface-variant">
                  O valor pode ser parcial, mas não pode ultrapassar o saldo aberto.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Data do recebimento">
                    <Input name="receivedAt" type="date" defaultValue="2026-11-17" required />
                  </Field>
                  <Field label="Forma de pagamento">
                    <select name="method" className={selectClassName} defaultValue="pix" required>
                      <option value="pix">PIX</option>
                      <option value="cash">Dinheiro</option>
                      <option value="debit">Cartão de débito</option>
                      <option value="credit">Cartão de crédito</option>
                      <option value="transfer">Transferência bancária</option>
                      <option value="other">Outro</option>
                    </select>
                  </Field>
                </div>
                <Field label="Código da transação (opcional)">
                  <Input name="transactionReference" placeholder="Ex.: PIX-E2E-9841029" />
                </Field>
                <Field label="Referência do comprovante (opcional)">
                  <Input name="receiptReference" placeholder="Ex.: Recibo #401 — recepção" />
                </Field>
                <div className="rounded-md border border-border bg-card p-2.5 text-[11px] leading-relaxed text-on-surface-variant">
                  Este é um registro administrativo manual e não movimenta valores em gateways online.
                </div>
              </>
            )}

            {action === "discount" && invoice && (
              <>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Tipo de desconto">
                    <select name="discountType" className={selectClassName} defaultValue="fixed">
                      <option value="fixed">Valor fixo (R$)</option>
                      <option value="percentage">Percentual (%)</option>
                    </select>
                  </Field>
                  <Field label="Recorrência">
                    <select name="recurrence" className={selectClassName} defaultValue="single">
                      <option value="single">Pontual</option>
                      <option value="recurring">Próximas competências</option>
                    </select>
                  </Field>
                </div>
                <Field label="Valor do desconto">
                  <Input name="amount" type="number" min="0.01" max={invoice.openAmount} step="0.01" required />
                </Field>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field label="Período de validade">
                    <Input value={`Competência ${invoice.competence}`} readOnly />
                  </Field>
                  <Field label="Prioridade">
                    <select name="priority" className={selectClassName} defaultValue="high">
                      <option value="high">Alta</option>
                      <option value="standard">Padrão</option>
                    </select>
                  </Field>
                </div>
                <Field label="Motivo do desconto">
                  <textarea name="reason" rows={3} className={textareaClassName} required placeholder="Descreva o motivo administrativo" />
                </Field>
              </>
            )}

            {action === "reversal" && invoice && (
              <>
                <div className="rounded-md border border-amber-800/40 bg-amber-950/20 p-2.5 text-[11px] leading-relaxed text-amber-300">
                  A reversão reabre o saldo da fatura e gera um evento de auditoria. Ela não estorna valores bancários automaticamente.
                </div>
                <Field label="Valor da reversão">
                  <Input name="amount" type="number" min="0.01" max={invoice.paidAmount} step="0.01" defaultValue={invoice.paidAmount} required />
                </Field>
                <Field label="Justificativa da reversão">
                  <textarea name="reason" rows={3} className={textareaClassName} required placeholder="Ex.: comprovante duplicado ou erro de digitação" />
                </Field>
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
                  <Input name="graceDays" type="number" min="0" max="30" defaultValue="5" required />
                </Field>
                <div className="rounded-lg border border-primary-container/20 bg-primary-container/5 p-3 text-sm">
                  <p className="font-medium text-on-surface">Política de acesso e check-in</p>
                  <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">
                    A inadimplência não bloqueia automaticamente o login, os treinos ou o check-in. A liberação continua sob controle da equipe.
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-card p-3 text-xs leading-relaxed text-on-surface-variant">
                  Gateways online serão configurados em uma etapa futura do módulo financeiro.
                </div>
              </>
            )}

            {action === "generate" && (
              <>
                <Field label="Competência">
                  <select name="competence" className={selectClassName} defaultValue="12/2026">
                    <option value="12/2026">Dezembro / 2026</option>
                    <option value="11/2026">Novembro / 2026</option>
                  </select>
                </Field>
                <Field label="Vencimento padrão">
                  <Input name="dueDate" type="date" defaultValue="2026-12-10" required />
                </Field>
                <div className="rounded-lg border border-border bg-card p-3 text-sm">
                  <div className="flex justify-between gap-4 text-on-surface-variant">
                    <span>Alunos ativos elegíveis</span>
                    <strong className="text-on-surface">409 alunos</strong>
                  </div>
                  <div className="mt-2 flex justify-between gap-4 text-on-surface-variant">
                    <span>Valor previsto</span>
                    <strong className="font-mono text-primary-container">R$ 61.350,00</strong>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="px-4 border-border bg-transparent"
                />
              }
            >
              Voltar
            </DialogClose>
            <Button
              type="submit"
              size="sm"
              variant={action === "cancel" ? "destructive" : "default"}
              className={
                action === "cancel"
                  ? "px-4"
                  : "px-4 bg-primary-container font-semibold text-black hover:bg-primary-container"
              }
            >
              {copy.submit}
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

const selectClassName =
  "h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-on-surface outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"

const textareaClassName =
  "w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary-container focus:ring-2 focus:ring-primary-container/20"

