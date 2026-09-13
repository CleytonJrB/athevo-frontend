import type { LucideIcon } from "lucide-react"

export type ExerciseDifficulty = "Iniciante" | "Intermediário" | "Avançado"

export interface Exercise {
  id: string
  name: string
  muscleGroup: string
  equipment: string
  difficulty: ExerciseDifficulty
  description: string
  icon: LucideIcon
}

export const exerciseCategories = [
  "Todos",
  "Peito",
  "Costas",
  "Pernas",
  "Ombros",
  "Braços",
  "Core",
] as const

export const exercises: Exercise[] = []
// [
//   {
//     id: "bench-press",
//     name: "Supino Reto",
//     muscleGroup: "Peito",
//     equipment: "Halteres",
//     difficulty: "Iniciante",
//     description:
//       "Exercício fundamental para o desenvolvimento da musculatura peitoral, deltoide anterior e tríceps.",
//     icon: Dumbbell,
//   },
//   {
//     id: "barbell-squat",
//     name: "Agachamento Livre",
//     muscleGroup: "Pernas",
//     equipment: "Barra Livre",
//     difficulty: "Intermediário",
//     description:
//       "Trabalha intensamente quadríceps, glúteos e isquiotibiais, além de exigir estabilização do core.",
//     icon: BicepsFlexed,
//   },
//   {
//     id: "seated-row",
//     name: "Remada Baixa",
//     muscleGroup: "Costas",
//     equipment: "Máquina",
//     difficulty: "Iniciante",
//     description:
//       "Excelente para o desenvolvimento da espessura das costas, focando no latíssimo do dorso e romboides.",
//     icon: Rows3,
//   },
// ]
