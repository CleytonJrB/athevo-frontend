import {
  BriefcaseBusiness,
  Dumbbell,
  Globe,
  Sparkles
} from "lucide-react";

interface FooterProps {
  simple?: boolean;
}

const footerGroups = [
  {
    title: "Produto",
    links: [
      { label: "Funcionalidades", href: "#features" },
      { label: "Planos", href: "#plans" },
      { label: "Módulos", href: "#resources" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Sobre nós", href: "#" },
      { label: "Carreiras", href: "#" },
      { label: "Blog", href: "#" },
    ],
  },
  {
    title: "Suporte",
    links: [
      { label: "Central de ajuda", href: "#" },
      { label: "Fale conosco", href: "#" },
      { label: "Status", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Política de privacidade", href: "#" },
      { label: "Termos de serviço", href: "#" },
    ],
  },
];

export default function Footer(props: FooterProps) {

  const { simple = false } = props;

  function renderFooterGroup(group: typeof footerGroups[number]) {
    return (
      <div key={group.title}>
        <h3 className="text-sm font-semibold text-white">{group.title}</h3>
        <div className="mt-4 space-y-3">
          {group.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block text-sm text-zinc-500 transition hover:text-yellow-300">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    );
  }

  if (simple) {
    return (
      <footer className="border-t border-white/10 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[98%] px-6 py-4 lg:px-8">
          <p className="text-center text-sm text-zinc-400">
            &copy; {new Date().getFullYear()} Athevo. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-white/8 bg-zinc-950/90">
      <div className="mx-auto grid max-w-[98%] gap-10 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl border border-yellow-400/30 bg-yellow-400/10 text-yellow-300">
              <Dumbbell className="size-5" />
            </div>
            <span className="text-xl font-semibold text-white">Athevo</span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-500">
            © 2024 Athevo. Gestão precisa de fitness para academias que precisam de visibilidade operacional real.
          </p>
          <div className="mt-5 flex gap-4 text-zinc-500">
            <a href="#" aria-label="Website" className="transition hover:text-yellow-300">
              <Globe className="size-5" />
            </a>
            <a href="#" aria-label="Empresa" className="transition hover:text-yellow-300">
              <BriefcaseBusiness className="size-5" />
            </a>
            <a href="#" aria-label="Recursos" className="transition hover:text-yellow-300">
              <Sparkles className="size-5" />
            </a>
          </div>
        </div>

        {footerGroups.map((group) => renderFooterGroup(group))}

      </div>
    </footer>
  )
}