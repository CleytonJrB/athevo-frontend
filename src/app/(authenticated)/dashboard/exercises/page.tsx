import type { Metadata } from "next"

import { AuthenticatedCommonBody } from "@/components/layout/authenticated-common-body"

import { ExercisesLibrary } from "./_components/exercises-library"

export const metadata: Metadata = {
  title: "Exercícios",
  description: "Gerencie a biblioteca de exercícios da academia.",
}

export default function ExercisesPage() {
  return (
    <AuthenticatedCommonBody>
      <ExercisesLibrary />
    </AuthenticatedCommonBody>
  )
}
