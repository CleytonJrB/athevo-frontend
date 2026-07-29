import React from 'react';
import { Button } from "@/components/ui/button";

import {
  Dumbbell
} from "lucide-react";

const navigationItems = [
  { label: "Recursos", href: "#resources" },
  { label: "Funcionalidades", href: "#features" },
  { label: "Planos", href: "#plans" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  return (
    <header>
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[98%] items-center justify-between px-6 py-4 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-300 shadow-[0_0_24px_rgba(250,204,21,0.18)]">
              <Dumbbell className="size-5" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white">Athevo</span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a className="border-b-2 border-yellow-400 pb-1 text-sm font-semibold text-yellow-300" href="#top">
              Início
            </a>
            {navigationItems.map((item) => (
              <a
                key={item.href}
                className="rounded-md px-2 py-1 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a className="hidden text-sm text-zinc-400 transition hover:text-white sm:block" href="#">
              Entrar
            </a>
            <Button className="h-10 rounded-md bg-linear-to-b from-yellow-300 to-yellow-500 px-4 font-semibold text-black hover:from-yellow-200 hover:to-yellow-400">
              Começar grátis
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}