import { AuthenticatedCommonBody } from "@/components/layout/authenticated-common-body"

import { ExercisesLibrary } from "./_components/exercises-library"

export default function ExercisesPage() {
  return (
    <AuthenticatedCommonBody>
      <ExercisesLibrary />
    </AuthenticatedCommonBody>
  )
}
