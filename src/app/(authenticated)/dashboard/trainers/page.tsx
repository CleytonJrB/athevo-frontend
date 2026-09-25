import type { Metadata } from "next"

import { AuthenticatedCommonBody } from "@/components/layout/authenticated-common-body"

import { TrainersDirectory } from "./_components/trainers-directory"

export const metadata: Metadata = {
  title: "Professores",
  description: "Gerencie professores, especialidades e plantões da academia.",
}

export default function TrainersPage() {
  return (
    <AuthenticatedCommonBody>
      <TrainersDirectory />
    </AuthenticatedCommonBody>
  )
}
