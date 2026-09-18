import type { Metadata } from "next";

import { AuthenticatedCommonBody } from "@/components/layout/authenticated-common-body";
import Overview from "./_components/overview";

export const metadata: Metadata = {
  title: "Visão geral",
  description: "Acompanhe os principais indicadores e atividades da sua academia.",
};

export default function Page() {
  return (
    <AuthenticatedCommonBody>
      <Overview />
    </AuthenticatedCommonBody>
  )
}
