export interface ExerciseReference {
  id: string
  name: string
}

export interface ExerciseListItem {
  category: ExerciseReference | null
  equipment: ExerciseReference[]
  id: string
  isCustom: boolean
  mediaUrl: string | null
  name: string
  primaryMuscles: ExerciseReference[]
}

export interface ExercisePage {
  items: ExerciseListItem[]
  page: number
  pageSize: number
  totalCount: number
}

export type ExerciseScope = "all" | "catalog" | "custom"

export interface ExerciseListParams {
  categoryId?: string
  equipmentId?: string
  isCustom?: boolean
  languageCode?: "en" | "pt-BR"
  muscleId?: string
  page: number
  pageSize: number
  search?: string
  source?: string
}

export interface ExerciseAttribution {
  attribution: string | null
  author: string | null
  authorUrl: string | null
  derivativeSourceUrl: string | null
  license: string
  licenseUrl: string | null
  objectUrl: string | null
  title: string | null
}

export interface ExerciseTranslation {
  attribution: ExerciseAttribution | null
  description: string
  languageCode: string
  name: string
}

export interface ExerciseMuscle extends ExerciseReference {
  role: number
}

export interface ExerciseMedia {
  attribution: ExerciseAttribution | null
  id: string
  isPrimary: boolean
  thumbnailUrl: string | null
  type: number
  url: string
}

export interface ExerciseDetails {
  attribution: ExerciseAttribution | null
  category: ExerciseReference | null
  description: string
  equipment: ExerciseReference[]
  id: string
  isCustom: boolean
  isGlobal: boolean
  media: ExerciseMedia[]
  muscles: ExerciseMuscle[]
  name: string
  source: string | null
  sourceAttribution: string | null
  translations: ExerciseTranslation[]
}
