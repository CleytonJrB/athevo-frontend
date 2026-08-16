import Link from 'next/link';

import { Button } from "@/components/ui/button";
import Logo from '../icons/logo';

const defaultNavigationItems = [
  { label: "Início", href: "#top" },
  { label: "Recursos", href: "#resources" },
  { label: "Funcionalidades", href: "#features" },
  { label: "Planos", href: "#plans" },
  { label: "FAQ", href: "#faq" },
];

export interface NavigationItem {
  label: string;
  href: string;
}

export interface HeaderProps {
  onlyLogo?: boolean;
  hasName?: boolean;
  hasNavigations?: boolean;
  hasButtonsAuth?: boolean;
  navigationItems?: NavigationItem[];
}

export default function Header(props: HeaderProps) {
  const { onlyLogo = false, hasName = false, hasNavigations = false, hasButtonsAuth = true, navigationItems = defaultNavigationItems } = props;

  function renderNavigationItems(item: NavigationItem) {
    if (item.href.startsWith("#top")) {
      return (
        <a
          key={item.href}
          className="border-b-2 border-yellow-400 pb-1 text-sm font-semibold text-yellow-300"
          href={item.href}>
          {item.label}
        </a>
      )
    }
    return (
      <a
        key={item.href}
        className="rounded-md px-2 py-1 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
        href={item.href}
      >
        {item.label}
      </a>
    )
  }

  if (onlyLogo) {
    return (
      <header className="absolute top-0 z-50 h-18 bg-transparent">
        <div className="mx-auto flex h-full max-w-[98%] bg-transparent items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Logo hasName={hasName} />
          </Link>
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 h-18">
      <nav className="h-full border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-full max-w-[98%] items-center justify-between px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Logo hasName={hasName} />
          </Link>

          {hasNavigations && (
            <div className="hidden items-center gap-8 md:flex">
              {navigationItems.map(renderNavigationItems)}
            </div>
          )}

          {hasButtonsAuth &&
            <div className="flex items-center gap-3">
              <Button
                href="/login"
                variant="ghost"
                className="hidden text-sm text-zinc-400 transition hover:text-white sm:flex"
              >
                  Entrar
              </Button>

              <Button
                href="/register"
                className="h-10 rounded-md bg-linear-to-b from-yellow-300 to-yellow-500 px-4 font-semibold text-black hover:from-yellow-200 hover:to-yellow-400"
              >
                  Começar grátis
              </Button>
            </div>
          }
        </div>
      </nav>
    </header>
  );
}
