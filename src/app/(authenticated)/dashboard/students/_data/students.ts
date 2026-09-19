export type StudentStatus = "active" | "pending" | "delinquent"

export interface Student {
  id: string
  name: string
  email: string
  plan: string
  status: StudentStatus
  lastCheckIn: string
}

export const students: Student[] = [
  {
    id: "student-001",
    name: "Carlos Silva",
    email: "carlos.silva@example.com",
    plan: "Anual Premium",
    status: "active",
    lastCheckIn: "Hoje, 08:30",
  },
  {
    id: "student-002",
    name: "Mariana Costa",
    email: "mari.costa@example.com",
    plan: "Mensal Básico",
    status: "pending",
    lastCheckIn: "Ontem, 18:45",
  },
  {
    id: "student-003",
    name: "Roberto Lima",
    email: "roberto.l@example.com",
    plan: "Semestral",
    status: "delinquent",
    lastCheckIn: "12 Set 2026",
  },
  {
    id: "student-004",
    name: "Ana Beatriz",
    email: "ana.beatriz@example.com",
    plan: "Trimestral Plus",
    status: "active",
    lastCheckIn: "Hoje, 06:12",
  },
  {
    id: "student-005",
    name: "João Pedro",
    email: "joao.pedro@example.com",
    plan: "Anual Premium",
    status: "active",
    lastCheckIn: "Ontem, 20:10",
  },
  {
    id: "student-006",
    name: "Fernanda Alves",
    email: "fernanda.alves@example.com",
    plan: "Mensal Básico",
    status: "pending",
    lastCheckIn: "16 Set 2026",
  },
  {
    id: "student-007",
    name: "Lucas Martins",
    email: "lucas.martins@example.com",
    plan: "Semestral",
    status: "active",
    lastCheckIn: "Hoje, 12:05",
  },
  {
    id: "student-008",
    name: "Camila Rocha",
    email: "camila.rocha@example.com",
    plan: "Anual Premium",
    status: "active",
    lastCheckIn: "18 Set 2026",
  },
  {
    id: "student-009",
    name: "Rafael Souza",
    email: "rafael.souza@example.com",
    plan: "Mensal Básico",
    status: "delinquent",
    lastCheckIn: "02 Set 2026",
  },
  {
    id: "student-010",
    name: "Juliana Mendes",
    email: "juliana.mendes@example.com",
    plan: "Trimestral Plus",
    status: "active",
    lastCheckIn: "Ontem, 17:20",
  },
  {
    id: "student-011",
    name: "Diego Nascimento",
    email: "diego.nascimento@example.com",
    plan: "Semestral",
    status: "pending",
    lastCheckIn: "15 Set 2026",
  },
  {
    id: "student-012",
    name: "Patrícia Gomes",
    email: "patricia.gomes@example.com",
    plan: "Anual Premium",
    status: "active",
    lastCheckIn: "Hoje, 09:42",
  },
  {
    id: "student-013",
    name: "Eduardo Moreira",
    email: "eduardo.moreira@example.com",
    plan: "Mensal Básico",
    status: "delinquent",
    lastCheckIn: "28 Ago 2026",
  },
]
