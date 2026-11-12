import type { Metadata } from "next"

import { AcceptStudentInvitationForm } from "./_components/accept-student-invitation-form"

export const metadata: Metadata = {
  title: "Aceitar convite",
  description: "Ative seu acesso a uma academia na Athevo.",
  referrer: "no-referrer",
  robots: { index: false, follow: false },
}

export default function AcceptInvitationPage() {
  return <AcceptStudentInvitationForm />
}
