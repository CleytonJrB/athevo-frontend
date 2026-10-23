export interface Trainer {
  active: boolean
  activity: string | null
  createdAt: string
  email: string
  id: string
  linkedStudentsCount: number | null
  name: string
  registrationNumber: string | null
  shift: string | null
  specialty: string | null
  weeklyHours: number | null
}

export interface TrainerSummary {
  active: number
  inactive: number
  total: number
}

export interface TrainerPage {
  items: Trainer[]
  page: number
  pageSize: number
  summary: TrainerSummary
  totalCount: number
}

export interface TrainerListParams {
  active?: boolean
  page: number
  pageSize: number
  search?: string
}
