export interface AcademyListItem {
  id: string
  name: string
  slug: string
  role: string
  isCurrent: boolean
  planName: string | null
  activeStudentCount: number | null
  studentRange: string | null
}
