"use client"

import { useAuth } from '@/hooks/use-auth';

import Link from 'next/link';
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import Logo from '../icons/logo';

const defaultNavigationItems = [
  { label: "Início", href: "/#top" },
  { label: "Recursos", href: "/#resources" },
  { label: "Funcionalidades", href: "/#features" },
  { label: "Planos", href: "/#plans" },
  { label: "FAQ", href: "/#faq" },
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
  const pathname = usePathname();

  const { isAuthenticated } = useAuth();

  const isLoginRoute = pathname === "/login" || pathname.startsWith("/login/");
  const isRegisterRoute = pathname === "/register" || pathname.startsWith("/register/");

  function renderNavigationItems(item: NavigationItem) {
    if (item.href.startsWith("#top")) {
      return (
        <Button
          key={item.href}
          className="text-sm font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-white hover:"
          variant="ghost"
          size="xs"
          href={item.href}
        >
          {item.label}
        </Button>
      )
    }

    return (
      <Button
        key={item.href}
        className="text-sm font-semibold text-zinc-400 transition hover:bg-white/5 hover:text-white"
        variant="ghost"
        size="xs"
        href={item.href}
      >
        {item.label}
      </Button>
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

          {hasButtonsAuth && !isAuthenticated &&
            <div className="flex items-center gap-3">
              {!isLoginRoute ? (
                <Button
                  href="/login"
                  variant="outline"
                  size="sm"
                  className="border-[#ffecb93a] text-sm from-yellow-200 transition hover:text-white sm:flex"
                >
                  Entrar
                </Button>
              ) : null}

              {!isRegisterRoute ? (
                <Button
                  href="/register"
                  variant="default"
                  size="sm"
                  className="rounded-md bg-linear-to-b from-yellow-300 to-yellow-500 px-4 font-semibold text-black hover:from-yellow-200 hover:to-yellow-400"
                >
                  Começar grátis
                </Button>
              ) : null}
            </div>
          }

          {isAuthenticated &&
            <div className="flex items-center gap-3">
              <Button
                href="/dashboard"
                variant="default"
                size="sm"
                className="rounded-md bg-linear-to-b from-yellow-300 to-yellow-500 px-4 font-semibold text-black hover:from-yellow-200 hover:to-yellow-400"
              >
                Dashboard
              </Button>
            </div>
          }
        </div>
      </nav>
    </header>
  );
}
