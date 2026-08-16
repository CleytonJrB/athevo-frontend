import { Dumbbell, Rocket, Upload } from "lucide-react"

export const gymTypeOptions = [
  { value: "gym", label: "Academia tradicional" },
  { value: "crossfit", label: "CrossFit / Funcional" },
  { value: "studio", label: "Estúdio" },
  { value: "martial-arts", label: "Artes marciais" },
  { value: "other", label: "Outro" },
]

export const studentRangeOptions = [
  { value: "up-to-100", label: "Até 100 alunos" },
  { value: "101-300", label: "101 a 300 alunos" },
  { value: "301-700", label: "301 a 700 alunos" },
  { value: "701-1500", label: "701 a 1.500 alunos" },
  { value: "more-than-1500", label: "Mais de 1.500 alunos" },
]

export const areaCodeOptions = [
  11, 12, 13, 14, 15, 16, 17, 18, 19,
  21, 22, 24, 27, 28,
  31, 32, 33, 34, 35, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48, 49,
  51, 53, 54, 55,
  61, 62, 63, 64, 65, 66, 67, 68, 69,
  71, 73, 74, 75, 77, 79,
  81, 82, 83, 84, 85, 86, 87, 88, 89,
  91, 92, 93, 94, 95, 96, 97, 98, 99,
].map((areaCode) => ({ value: String(areaCode), label: String(areaCode) }))

export const stateOptions = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT",
  "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO",
  "RR", "SC", "SP", "SE", "TO",
].map((state) => ({ value: state, label: state }))

export const completionCards = [
  {
    icon: Rocket,
    value: "start-from-scratch",
    title: "Começar do zero",
    description: "Configure sua operação e cadastre sua equipe no seu ritmo.",
  },
  {
    icon: Upload,
    value: "import-students",
    title: "Importar alunos",
    description: "Leve sua base de alunos para a Athevo de forma simples.",
    disabled: true,
  },
  {
    icon: Dumbbell,
    value: "explore-demo",
    title: "Explorar demonstração",
    description: "Conheça os recursos usando um ambiente já preenchido.",
  },
]
