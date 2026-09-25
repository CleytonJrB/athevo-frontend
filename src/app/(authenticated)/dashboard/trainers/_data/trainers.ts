export type TrainerCategory =
  | "strength"
  | "group-classes"
  | "functional"
  | "personal"

export type TrainerActivity = "on-duty" | "in-class" | "available" | "in-service"

export interface Trainer {
  id: string
  name: string
  specialty: string
  category: TrainerCategory
  cref: string
  shift: string
  primaryMetricLabel: string
  primaryMetricValue: number
  weeklyHours: number
  activity: TrainerActivity
  activityLabel: string
}

export const trainers: Trainer[] = [
  {
    id: "trainer-001",
    name: "Carlos Silva",
    specialty: "Musculação",
    category: "strength",
    cref: "042819-G/SP",
    shift: "Manhã (06h - 14h)",
    primaryMetricLabel: "Alunos vinculados",
    primaryMetricValue: 142,
    weeklyHours: 36,
    activity: "on-duty",
    activityLabel: "Em plantão",
  },
  {
    id: "trainer-002",
    name: "Ana Mendes",
    specialty: "Pilates / Coletivas",
    category: "group-classes",
    cref: "031104-G/SP",
    shift: "Noite (16h - 22h)",
    primaryMetricLabel: "Alunos vinculados",
    primaryMetricValue: 85,
    weeklyHours: 24,
    activity: "in-class",
    activityLabel: "Em aula (Pilates)",
  },
  {
    id: "trainer-003",
    name: "Roberto Alves",
    specialty: "Coord. Técnico",
    category: "strength",
    cref: "018240-G/SP",
    shift: "Integral (08h - 18h)",
    primaryMetricLabel: "Instrutores em equipe",
    primaryMetricValue: 16,
    weeklyHours: 40,
    activity: "on-duty",
    activityLabel: "Em plantão",
  },
  {
    id: "trainer-004",
    name: "Thiago Castro",
    specialty: "Crossfit / Funcional",
    category: "functional",
    cref: "055812-G/SP",
    shift: "Manhã (07h - 13h)",
    primaryMetricLabel: "Alunos vinculados",
    primaryMetricValue: 98,
    weeklyHours: 30,
    activity: "available",
    activityLabel: "Disponível",
  },
  {
    id: "trainer-005",
    name: "Juliana Rocha",
    specialty: "Personal Trainer",
    category: "personal",
    cref: "062941-G/SP",
    shift: "Horários flexíveis",
    primaryMetricLabel: "Alunos VIP",
    primaryMetricValue: 18,
    weeklyHours: 25,
    activity: "in-service",
    activityLabel: "Em atendimento",
  },
  {
    id: "trainer-006",
    name: "Felipe Lima",
    specialty: "Musculação / Spinning",
    category: "strength",
    cref: "039478-G/SP",
    shift: "Noite (15h - 23h)",
    primaryMetricLabel: "Alunos vinculados",
    primaryMetricValue: 116,
    weeklyHours: 32,
    activity: "on-duty",
    activityLabel: "Em plantão",
  },
  {
    id: "trainer-007",
    name: "Renata Oliveira",
    specialty: "Dança / Coletivas",
    category: "group-classes",
    cref: "074315-G/SP",
    shift: "Tarde (12h - 20h)",
    primaryMetricLabel: "Alunos vinculados",
    primaryMetricValue: 74,
    weeklyHours: 28,
    activity: "in-class",
    activityLabel: "Em aula (Dança)",
  },
  {
    id: "trainer-008",
    name: "Marcelo Nunes",
    specialty: "Crossfit / Funcional",
    category: "functional",
    cref: "048221-G/SP",
    shift: "Manhã (06h - 12h)",
    primaryMetricLabel: "Alunos vinculados",
    primaryMetricValue: 91,
    weeklyHours: 30,
    activity: "on-duty",
    activityLabel: "Em plantão",
  },
  {
    id: "trainer-009",
    name: "Beatriz Martins",
    specialty: "Personal Trainer",
    category: "personal",
    cref: "067530-G/SP",
    shift: "Horários flexíveis",
    primaryMetricLabel: "Alunos VIP",
    primaryMetricValue: 21,
    weeklyHours: 26,
    activity: "in-service",
    activityLabel: "Em atendimento",
  },
  {
    id: "trainer-010",
    name: "Gustavo Freitas",
    specialty: "Musculação",
    category: "strength",
    cref: "052708-G/SP",
    shift: "Noite (17h - 23h)",
    primaryMetricLabel: "Alunos vinculados",
    primaryMetricValue: 108,
    weeklyHours: 34,
    activity: "available",
    activityLabel: "Disponível",
  },
  {
    id: "trainer-011",
    name: "Larissa Monteiro",
    specialty: "Yoga / Coletivas",
    category: "group-classes",
    cref: "071992-G/SP",
    shift: "Manhã (07h - 13h)",
    primaryMetricLabel: "Alunos vinculados",
    primaryMetricValue: 63,
    weeklyHours: 22,
    activity: "in-class",
    activityLabel: "Em aula (Yoga)",
  },
  {
    id: "trainer-012",
    name: "André Ribeiro",
    specialty: "Musculação / Funcional",
    category: "strength",
    cref: "044630-G/SP",
    shift: "Tarde (11h - 19h)",
    primaryMetricLabel: "Alunos vinculados",
    primaryMetricValue: 97,
    weeklyHours: 32,
    activity: "on-duty",
    activityLabel: "Em plantão",
  },
]
