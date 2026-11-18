import type { Metadata } from "next"

import { AuthenticatedCommonBody } from "@/components/layout/authenticated-common-body"

import { FinanceDashboard } from "./_components/finance-dashboard"

export const metadata: Metadata = {
  title: "Financeiro dos Alunos",
  description: "Gerencie cobranças, recebíveis e faturas dos alunos.",
}

export default function FinancePage() {
  return (
    <AuthenticatedCommonBody className="gap-6 px-4 py-6 sm:px-6 lg:px-8 xl:px-12">
      <FinanceDashboard />
    </AuthenticatedCommonBody>
  )
}

