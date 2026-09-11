import { AuthenticatedCommonTitle } from "@/components/layout/authenticated-common-title";
import React from "react";

export default function Overview() {
  return (
    <React.Fragment>
      <AuthenticatedCommonTitle
        title="Visão Geral"
        subTitle="Acompanhe os principais indicadores da sua academia."
      />
    </React.Fragment>
  )
}