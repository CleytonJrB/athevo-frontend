import Link from "next/link";

import { LoginForm } from "./_components/login-form";

import CommonBody from "@/components/layout/common-body";
import Logo from "@/components/icons/logo";
import ExempAthevo from "@/components/layout/exemp-athevo";

export default function LoginPage() {
  return (
    <CommonBody showHeader={false}>
      <div className="flex flex-row items-center justify-between h-screen p-4 gap-8">
        <div className="flex flex-1 flex-col">
          <div className="w-auto p-8">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full px-8">
              <LoginForm />
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-2 items-center justify-center">
          <ExempAthevo />
        </div>
      </div>
    </CommonBody>
  );
}
