import type { Metadata } from "next"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { AuthenticatedCommonBody } from "@/components/layout/authenticated-common-body"
import { authOptions } from "@/lib/auth/config"
import { TenantRole } from "@/lib/tenant-role"

import { MyFinanceDashboard } from "./_components/my-finance-dashboard"

export const metadata: Metadata = {
  title: "Meu Financeiro",
  description: "Consulte suas mensalidades e o histórico de pagamentos.",
}

export default async function MyFinancePage() {
  const session = await getServerSession(authOptions)

  if (session?.user.role !== TenantRole.Student) redirect("/dashboard")

  return (
    <AuthenticatedCommonBody className="max-w-7xl gap-6 px-4 py-6 sm:px-6 md:px-8 md:py-8">
      <MyFinanceDashboard />
    </AuthenticatedCommonBody>
  )
}
