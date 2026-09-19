import type { Metadata } from "next"

import { AuthenticatedCommonBody } from "@/components/layout/authenticated-common-body"

import { StudentsDirectory } from "./_components/students-directory"

export const metadata: Metadata = {
  title: "Alunos",
  description: "Gerencie alunos, planos e frequências da academia.",
}

export default function StudentsPage() {
  return (
    <AuthenticatedCommonBody>
      <StudentsDirectory />
    </AuthenticatedCommonBody>
  )
}
