import type { Metadata } from "next"

import { AuthenticatedCommonBody } from "@/components/layout/authenticated-common-body"

import { FinanceDashboard } from "./_components/finance-dashboard"

export const metadata: Metadata = {
  title: "Financeiro dos Alunos",
  description: "Gerencie cobranças, recebíveis e faturas dos alunos.",
}

export default function FinancePage() {
  return (
    <AuthenticatedCommonBody>
      <FinanceDashboard />
    </AuthenticatedCommonBody>
  )
}

