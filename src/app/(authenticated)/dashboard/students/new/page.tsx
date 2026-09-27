import type { Metadata } from "next"

import { AuthenticatedCommonBody } from "@/components/layout/authenticated-common-body"

import { StudentCreateForm } from "./_components/student-create-form"

export const metadata: Metadata = {
  title: "Cadastrar novo aluno",
  description: "Cadastre os dados pessoais, endereço e matrícula de um aluno.",
}

export default function NewStudentPage() {
  return (
    <AuthenticatedCommonBody>
      <StudentCreateForm />
    </AuthenticatedCommonBody>
  )
}
