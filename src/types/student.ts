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
