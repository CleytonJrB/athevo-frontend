import { AuthenticatedCommonBody } from "@/components/layout/authenticated-common-body";
import Overview from "./_components/overview";

export default function Page() {
  return (
    <AuthenticatedCommonBody>
      <Overview />
    </AuthenticatedCommonBody>
  )
}
