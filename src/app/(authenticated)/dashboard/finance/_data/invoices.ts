export type InvoiceStatus = "open" | "partial" | "paid" | "overdue" | "canceled"

export interface Invoice {
  id: string
  studentName: string
  studentEmail: string
  enrollment: string
  planName: string
  competence: string
  dueDate: string
  dueLabel: string
  billedAmount: number
  paidAmount: number
  openAmount: number
  discountAmount?: number
  status: InvoiceStatus
}

export const invoices: Invoice[] = [
  {
    id: "invoice-001",
    studentName: "Matheus Silveira",
    studentEmail: "matheus.silveira@email.com",
    enrollment: "ATH-1092",
    planName: "Black Anual",
    competence: "11/2026",
    dueDate: "2026-11-03",
    dueLabel: "Vencida",
    billedAmount: 180,
    paidAmount: 0,
    openAmount: 180,
    status: "overdue",
  },
  {
    id: "invoice-002",
    studentName: "Beatriz Lima",
    studentEmail: "beatriz.lima@email.com",
    enrollment: "ATH-0941",
    planName: "Performance Semestral",
    competence: "11/2026",
    dueDate: "2026-11-25",
    dueLabel: "Em dia",
    billedAmount: 200,
    paidAmount: 100,
    openAmount: 100,
    status: "partial",
  },
  {
    id: "invoice-003",
    studentName: "Rodrigo Antunes",
    studentEmail: "rodrigo.antunes@empresa.com",
    enrollment: "ATH-0312",
    planName: "Personal VIP",
    competence: "11/2026",
    dueDate: "2026-11-15",
    dueLabel: "Liquidada",
    billedAmount: 400,
    paidAmount: 350,
    openAmount: 0,
    discountAmount: 50,
    status: "paid",
  },
  {
    id: "invoice-004",
    studentName: "Camila Lourenço",
    studentEmail: "camila.lourenco@gmail.com",
    enrollment: "ATH-1150",
    planName: "Start Mensal",
    competence: "11/2026",
    dueDate: "2026-11-30",
    dueLabel: "A vencer",
    billedAmount: 150,
    paidAmount: 0,
    openAmount: 150,
    status: "open",
  },
  {
    id: "invoice-005",
    studentName: "Felipe Andrade",
    studentEmail: "felipe.andrade@email.com",
    enrollment: "ATH-0789",
    planName: "Black Anual",
    competence: "11/2026",
    dueDate: "2026-11-10",
    dueLabel: "Cancelada",
    billedAmount: 180,
    paidAmount: 0,
    openAmount: 0,
    status: "canceled",
  },
  {
    id: "invoice-006",
    studentName: "Larissa Monteiro",
    studentEmail: "larissa.monteiro@email.com",
    enrollment: "ATH-1204",
    planName: "Performance Semestral",
    competence: "10/2026",
    dueDate: "2026-10-20",
    dueLabel: "Vencida",
    billedAmount: 200,
    paidAmount: 0,
    openAmount: 200,
    status: "overdue",
  },
  {
    id: "invoice-007",
    studentName: "Gustavo Freitas",
    studentEmail: "gustavo.freitas@email.com",
    enrollment: "ATH-0877",
    planName: "Start Mensal",
    competence: "10/2026",
    dueDate: "2026-10-10",
    dueLabel: "Liquidada",
    billedAmount: 150,
    paidAmount: 150,
    openAmount: 0,
    status: "paid",
  },
  {
    id: "invoice-008",
    studentName: "Ana Mendes",
    studentEmail: "ana.mendes@email.com",
    enrollment: "ATH-1035",
    planName: "Black Anual",
    competence: "09/2026",
    dueDate: "2026-09-25",
    dueLabel: "Liquidada",
    billedAmount: 180,
    paidAmount: 180,
    openAmount: 0,
    status: "paid",
  },
]

