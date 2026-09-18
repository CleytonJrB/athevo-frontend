import type { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "O endereço acessado não existe ou foi movido.",
}

export default function MissingDashboardRoute() {
  notFound()
}
