export type StudentStatus = "active" | "inactive"

export interface Student {
  active: boolean
  createdAt: string
  email: string
  id: string
  lastCheckInAt: string | null
  name: string
  planName: string | null
}

export interface StudentPage {
  items: Student[]
  page: number
  pageSize: number
  totalCount: number
}

export interface StudentListParams {
  active?: boolean
  page: number
  pageSize: number
  search?: string
}

export interface CreateStudentInvitationInput {
  birthDate: string
  city: string
  complement?: string
  district: string
  document: string
  email: string
  firstName: string
  lastName: string
  number: string
  phone: string
  state: string
  street: string
  zipCode: string
}

export interface StudentInvitationRequestResult {
  message: string
}

export interface StudentInvitationLookupResult {
  academyName: string
  expiresAt: string
  requiresAccountSetup: boolean
}

export interface AcceptStudentInvitationInput {
  acceptedTerms: boolean
  password?: string
  passwordConfirmation?: string
  token: string
}
