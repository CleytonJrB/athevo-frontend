import React from "react";

import LogoSimple from "@/components/icons/logo-simple";

export default function Logo({ hasName = false }) {
  return (
    <React.Fragment>
      <div className="flex size-10 items-center justify-center rounded-2xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-300 shadow-[0_0_24px_rgba(250,204,21,0.18)]">
        <LogoSimple className="h-5.5 w-6" />
      </div>

      {hasName && <span className="text-xl font-semibold text-white">Athevo</span>}
    </React.Fragment>
  );
}
