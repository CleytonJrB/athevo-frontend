import {
  StudentInvoiceStatus,
  type StudentInvoice,
} from "@/types/student-finance"

export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
})

export const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "UTC",
})

export const competenceFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
})

export type InvoiceTone = "cancelled" | "open" | "overdue" | "paid" | "partial"

export function getInvoiceTone(invoice: StudentInvoice): InvoiceTone {
  if (invoice.status === StudentInvoiceStatus.Cancelled) return "cancelled"
  if (invoice.status === StudentInvoiceStatus.Paid) return "paid"
  if (invoice.status === StudentInvoiceStatus.PartiallyPaid) return "partial"
  return invoice.overdue ? "overdue" : "open"
}

export function getInvoiceStatusLabel(invoice: StudentInvoice) {
  const labels: Record<InvoiceTone, string> = {
    cancelled: "Cancelada",
    open: "Em aberto",
    overdue: "Vencida",
    paid: "Paga",
    partial: "Pagamento parcial",
  }

  return labels[getInvoiceTone(invoice)]
}

export function formatCompetence(value: string) {
  const normalized = value.length === 7 ? `${value}-01` : value
  const label = competenceFormatter.format(new Date(`${normalized}T00:00:00Z`))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function formatDate(value: string) {
  return dateFormatter.format(new Date(`${value}T00:00:00Z`))
}
