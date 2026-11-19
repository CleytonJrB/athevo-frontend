export const StudentInvoiceStatus = {
  Open: 1,
  PartiallyPaid: 2,
  Paid: 3,
  Cancelled: 4,
} as const

export type StudentInvoiceStatus =
  (typeof StudentInvoiceStatus)[keyof typeof StudentInvoiceStatus]

export const StudentPaymentMethod = {
  Pix: 1,
  Cash: 2,
  DebitCard: 3,
  CreditCard: 4,
  BankTransfer: 5,
  Other: 6,
} as const

export type StudentPaymentMethod =
  (typeof StudentPaymentMethod)[keyof typeof StudentPaymentMethod]

export const StudentDiscountType = {
  Percentage: 1,
  FixedAmount: 2,
} as const

export type StudentDiscountType =
  (typeof StudentDiscountType)[keyof typeof StudentDiscountType]

export const StudentDiscountRecurrence = {
  OneTime: 1,
  Recurring: 2,
} as const

export type StudentDiscountRecurrence =
  (typeof StudentDiscountRecurrence)[keyof typeof StudentDiscountRecurrence]

export interface StudentInvoice {
  id: string
  enrollmentId: string
  studentTenantUserId: string
  studentName: string
  competence: string
  dueDate: string
  planName: string
  grossAmount: number
  discountAmount: number
  netAmount: number
  paidAmount: number
  balance: number
  currency: string
  status: StudentInvoiceStatus
  overdue: boolean
}

export interface StudentInvoicePage {
  hasNextPage: boolean
  items: StudentInvoice[]
  page: number
  pageSize: number
}

export interface StudentFinanceSettings {
  gracePeriodDays: number
}

export interface GenerateStudentInvoicesResult {
  competence: string
  created: number
  skipped: number
}

export interface StudentFinanceOperationResult {
  id: string
}

export interface StudentDiscount {
  id: string
  enrollmentId: string
  studentTenantUserId: string
  name: string
  type: StudentDiscountType
  recurrence: StudentDiscountRecurrence
  value: number
  currency?: string
  priority: number
  validFrom: string
  validUntil?: string
  usedAt?: string
  active: boolean
}

export interface ListStudentInvoicesParams {
  page: number
  pageSize: number
  status?: StudentInvoiceStatus
}

export interface RegisterStudentPaymentInput {
  amount: number
  paidAt: string
  method: StudentPaymentMethod
  reference?: string
  receiptReference?: string
}

export interface CreateStudentDiscountInput {
  enrollmentId: string
  name: string
  type: StudentDiscountType
  recurrence: StudentDiscountRecurrence
  value: number
  currency?: string
  priority: number
  validFrom: string
  validUntil?: string
}
