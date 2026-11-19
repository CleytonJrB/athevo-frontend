import axios from "axios"

import type {
  CreateStudentDiscountInput,
  GenerateStudentInvoicesResult,
  ListStudentInvoicesParams,
  RegisterStudentPaymentInput,
  StudentFinanceOperationResult,
  StudentFinanceSettings,
  StudentInvoice,
  StudentInvoicePage,
} from "@/types/student-finance"

export async function listStudentInvoices(
  params: ListStudentInvoicesParams,
  signal?: AbortSignal,
) {
  const response = await axios.get<StudentInvoice[]>(
    "/api/student-finance/invoices",
    {
      params,
      signal,
    },
  )

  const nextPage =
    response.data.length === params.pageSize
      ? await axios.get<StudentInvoice[]>("/api/student-finance/invoices", {
          params: { ...params, page: params.page + 1 },
          signal,
        })
      : null

  return {
    hasNextPage: (nextPage?.data.length ?? 0) > 0,
    items: response.data,
    page: params.page,
    pageSize: params.pageSize,
  } satisfies StudentInvoicePage
}

export async function getStudentFinanceSettings(signal?: AbortSignal) {
  const response = await axios.get<StudentFinanceSettings>(
    "/api/student-finance/settings",
    { signal },
  )
  return response.data
}

export async function updateStudentFinanceSettings(gracePeriodDays: number) {
  const response = await axios.put<StudentFinanceSettings>(
    "/api/student-finance/settings",
    { gracePeriodDays },
  )
  return response.data
}

export async function generateStudentInvoices(competence: string) {
  const response = await axios.post<GenerateStudentInvoicesResult>(
    "/api/student-finance/invoices/generate",
    { competence },
  )
  return response.data
}

export async function registerStudentPayment(
  invoiceId: string,
  input: RegisterStudentPaymentInput,
) {
  const response = await axios.post<StudentFinanceOperationResult>(
    `/api/student-finance/invoices/${invoiceId}/payments`,
    input,
    { headers: { "Idempotency-Key": crypto.randomUUID() } },
  )
  return response.data
}

export async function createStudentDiscount(input: CreateStudentDiscountInput) {
  const response = await axios.post<StudentFinanceOperationResult>(
    "/api/student-finance/discounts",
    input,
  )
  return response.data
}

export async function cancelStudentInvoice(invoiceId: string, reason: string) {
  await axios.post(`/api/student-finance/invoices/${invoiceId}/cancel`, {
    reason,
  })
}
