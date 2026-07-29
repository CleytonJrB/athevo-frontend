import {
  ArrowRight,
  BarChart3,
  Bell,
  Bolt,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  CreditCard,
  Dumbbell,
  Globe,
  HeartPulse,
  LayoutDashboard,
  ListChecks,
  Rocket,
  Settings,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  UserSquare2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const navigationItems = [
  { label: "Recursos", href: "#resources" },
  { label: "Funcionalidades", href: "#features" },
  { label: "Planos", href: "#plans" },
  { label: "FAQ", href: "#faq" },
];

const benefitCards = [
  {
    title: "Gerenciar alunos",
    description:
      "CRM completo para sua academia. Acompanhe frequência, assinaturas e histórico de comunicação sem esforço.",
    icon: Users,
  },
  {
    title: "Construtor de treinos",
    description:
      "Crie e atribua programas personalizados com uma biblioteca de exercícios pronta para escalar sua operação.",
    icon: Dumbbell,
  },
  {
    title: "Controle financeiro",
    description:
      "Automatize cobranças, gerencie faturas e aceite múltiplos métodos de pagamento com segurança.",
    icon: CreditCard,
  },
  {
    title: "Relatórios",
    description:
      "Gere insights sobre receita, retenção e uso das instalações com um clique.",
    icon: BarChart3,
  },
  {
    title: "Avaliações físicas",
    description:
      "Registre avaliações, acompanhe o progresso visualmente e compartilhe resultados com os clientes.",
    icon: HeartPulse,
  },
  {
    title: "Dashboard em tempo real",
    description:
      "Tenha uma visão geral da saúde do seu negócio assim que fizer login, com atualização contínua.",
    icon: LayoutDashboard,
  },
];

const modules = [
  { label: "Alunos", icon: Users },
  { label: "Treinadores", icon: UserSquare2 },
  { label: "Exercícios", icon: Dumbbell },
  { label: "Treinos", icon: ListChecks },
  { label: "Financeiro", icon: CreditCard },
  { label: "Relatórios", icon: BarChart3 },
  { label: "Check-in", icon: Check },
  { label: "Notificações", icon: Bell },
  { label: "Avaliações físicas", icon: HeartPulse },
  { label: "Calendário", icon: CalendarDays },
  { label: "Permissões", icon: ShieldCheck },
  { label: "Configurações", icon: Settings },
];

const stats = [
  { value: "+12.000", label: "Alunos gerenciados" },
  { value: "98%", label: "Satisfação dos clientes" },
  { value: "1M+", label: "Treinos criados" },
  { value: "99.9%", label: "Uptime" },
];

const plans = [
  {
    name: "Starter",
    price: "$49",
    description: "Para estúdios de fitness novos ou pequenos.",
    features: ["Até 100 alunos", "Relatórios básicos", "2 contas de treinador"],
    cta: "Começar",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$99",
    description: "Para academias em crescimento que precisam de controle total.",
    features: [
      "Até 500 alunos",
      "Ferramentas financeiras avançadas",
      "Contas de treinador ilimitadas",
      "Acesso ao aplicativo white-label",
    ],
    cta: "Começar teste gratuito",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$249",
    description: "Para operações de franquia com várias localizações.",
    features: [
      "Alunos ilimitados",
      "Integrações personalizadas",
      "Gerente de conta dedicado",
    ],
    cta: "Contatar vendas",
    highlighted: false,
  },
];

const faqs = [
  {
    question: "Como funciona a migração de alunos?",
    answer:
      "Nossa equipe ajuda a importar com segurança os dados existentes via CSV ou exportação direta do sistema anterior, sem interromper a operação da academia.",
  },
  {
    question: "Existe um aplicativo móvel para treinadores?",
    answer:
      "Sim. Os treinadores acessam um aplicativo web progressivo otimizado para celular, com agenda, avaliações e criação de treinos direto da área de musculação.",
  },
  {
    question: "Posso integrar com meu gateway de pagamento?",
    answer:
      "Sim. Athevo pode integrar com Stripe, PayPal e processadores locais para automatizar cobranças recorrentes.",
  },
  {
    question: "Vocês oferecem suporte durante a configuração?",
    answer:
      "Sim. Clientes Pro e Enterprise recebem acompanhamento dedicado para configuração, treinamento e carga inicial de dados.",
  },
  {
    question: "Quão seguros estão os dados dos meus alunos?",
    answer:
      "Usamos criptografia forte em trânsito e repouso, com processos compatíveis com LGPD para proteger informações sensíveis.",
  },
];

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

const partnerNames = [
  { label: "Power Gym", icon: Dumbbell },
  { label: "Iron House", icon: Store },
  { label: "Athletic Club", icon: Sparkles },
  { label: "Next Fitness", icon: Bolt },
  { label: "Strong Lab", icon: TrendingUp },
];

function SectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
      <p className="mt-4 text-base leading-7 text-zinc-400 md:text-lg">{description}</p>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#09090b] text-zinc-50">
      <div className="absolute inset-x-0 top-0 z-0 h-224 bg-[radial-gradient(circle_at_top,rgba(250,204,21,0.16),transparent_55%)]" />

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

      <section id="top" className="relative mx-auto grid max-w-[98%] gap-16 px-6 pb-24 pt-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:px-8 lg:pb-32 lg:pt-28">
        <div className="relative z-10 flex flex-col items-center text-center lg:items-start lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-4 py-1 text-sm text-yellow-200">
            <Sparkles className="size-4" /> Plataforma para gestão fitness
          </span>

          <h1 className="mt-8 max-w-3xl text-5xl font-semibold tracking-[-0.06em] text-white md:text-6xl lg:text-7xl">
            Manage Your Gym.
            <span className="mt-2 block text-yellow-300">Potencialize cada atleta.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
            Uma plataforma completa para gerenciar alunos, treinadores, treinos, pagamentos e o crescimento do seu negócio a partir de uma interface incrivelmente precisa.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button className="h-12 rounded-md bg-linear-to-b from-yellow-300 to-yellow-500 px-6 text-sm font-semibold text-black shadow-[0_12px_30px_rgba(250,204,21,0.18)] hover:from-yellow-200 hover:to-yellow-400">
              Começar teste gratuito
              <ArrowRight className="size-4" />
            </Button>

            <Button
              variant="outline"
              className="h-12 rounded-md border-zinc-800 bg-transparent px-6 text-sm font-semibold text-zinc-100 hover:bg-zinc-900 hover:text-white"
            >
              Ver demonstração
            </Button>
          </div>

          <div className="mt-6 flex flex-col items-center gap-3 text-sm text-zinc-500 sm:flex-row">
            <span className="flex items-center gap-2 text-yellow-300">
              <Check className="size-4" /> Sem cartão de crédito necessário
            </span>
            <span className="hidden h-1 w-1 rounded-full bg-zinc-700 sm:block" />
            <span className="flex items-center gap-2">
              <Check className="size-4" /> 14 dias de teste grátis
            </span>
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle,rgba(250,204,21,0.18),transparent_60%)] blur-3xl" />
          <div className="relative w-full max-w-3xl rounded-[28px] border border-white/8 bg-white/5 p-2 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur">
            <div className="overflow-hidden rounded-[22px] border border-white/6 bg-zinc-950">
              <div className="border-b border-white/6 bg-zinc-900/80 px-5 py-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-300">Painel executivo</p>
                    <p className="mt-1 text-2xl font-semibold tracking-tight text-white">Performance da academia</p>
                  </div>
                  <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                    Receita +18,2%
                  </div>
                </div>
              </div>

              <div className="grid gap-4 p-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { label: "Alunos ativos", value: "2.184" },
                      { label: "Check-ins hoje", value: "412" },
                      { label: "Receita do mês", value: "R$ 82k" },
                    ].map((item) => (
                      <div key={item.label} className="rounded-2xl border border-white/6 bg-zinc-900 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">{item.label}</p>
                        <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/6 bg-zinc-900 p-5">
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-zinc-300">Retenção semanal</p>
                        <p className="mt-1 text-xs text-zinc-500">Últimos 7 dias</p>
                      </div>
                      <p className="text-sm font-semibold text-yellow-300">94%</p>
                    </div>
                    <div className="mt-6 flex gap-3">
                      {[42, 56, 50, 68, 72, 64, 88].map((height, index) => (
                        <div key={index} className="flex flex-1 flex-col items-center gap-2">
                          <div className="flex h-44 w-full flex-col justify-end">
                            <div
                              className="w-[70%] rounded-t-md bg-linear-to-t from-yellow-500 via-yellow-300 to-yellow-100"
                              style={{ height: `${height}%` }}
                            />
                          </div>
                          
                          <span className="text-[11px] uppercase tracking-[0.16em] text-zinc-600">
                            {`D${index + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/6 bg-zinc-900 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-400">
                        <TrendingUp className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Receita</p>
                        <p className="text-lg font-semibold text-white">+R$ 12.450</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/6 bg-zinc-900 p-5">
                    <p className="text-sm font-medium text-zinc-300">Alertas operacionais</p>
                    <div className="mt-4 space-y-3">
                      {[
                        "21 mensalidades vencem nas próximas 24h",
                        "5 avaliações físicas pendentes",
                        "2 treinadores com agenda lotada",
                      ].map((alert) => (
                        <div key={alert} className="rounded-xl border border-white/6 bg-zinc-950/80 px-4 py-3 text-sm text-zinc-400">
                          {alert}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-yellow-400/15 bg-linear-to-br from-yellow-400/10 to-transparent p-5">
                    <p className="text-sm font-medium text-white">Automação inteligente</p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Configure sequências para cobrança, retenção e reengajamento sem sair do painel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#09090b] py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-[0.32em] text-zinc-500">
            Confiado por líderes da indústria
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-zinc-400 md:gap-14">
            {partnerNames.map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 text-lg font-semibold opacity-70 transition hover:opacity-100">
                <Icon className="size-6 text-zinc-500" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[98%] px-6 py-24 lg:px-8">
        <SectionHeading
          title="Integração simplificada"
          description="Coloque sua academia para funcionar em minutos, não em dias."
        />
        <div className="relative mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <div className="pointer-events-none absolute left-0 top-8 hidden h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent md:block" />
          {[
            {
              title: "1. Crie sua academia",
              description:
                "Configure sua marca, localização e preferências básicas em um fluxo de onboarding objetivo.",
              icon: Store,
              active: false,
            },
            {
              title: "2. Cadastre alunos",
              description:
                "Importe listas existentes ou registre novos alunos com planos e recorrência já conectados.",
              icon: Users,
              active: false,
            },
            {
              title: "3. Comece a gerenciar",
              description:
                "Assuma o controle de operações, desempenho e expansão do negócio instantaneamente.",
              icon: Rocket,
              active: true,
            },
          ].map(({ title, description, icon: Icon, active }) => (
            <div
              key={title}
              className={`relative rounded-[24px] border p-8 text-center transition duration-300 hover:-translate-y-2 ${
                active
                  ? "border-yellow-400/40 bg-zinc-900 shadow-[0_0_30px_rgba(250,204,21,0.12)]"
                  : "border-white/8 bg-zinc-900/80"
              }`}
            >
              <div
                className={`mx-auto mb-5 flex size-16 items-center justify-center rounded-full border ${
                  active
                    ? "border-yellow-400 bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.25)]"
                    : "border-white/10 bg-zinc-950 text-yellow-300"
                }`}
              >
                <Icon className="size-7" />
              </div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto max-w-[98%] px-6 py-24 lg:px-8">
        <SectionHeading
          title="Tudo o que você precisa. Nada do que você não precisa."
          description="Um conjunto de ferramentas criado especificamente para negócios modernos de fitness."
        />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {benefitCards.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="group rounded-[24px] border border-white/8 bg-zinc-900/80 p-7 transition duration-300 hover:border-yellow-400/40 hover:bg-zinc-900"
            >
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-300 transition group-hover:bg-yellow-400/10 group-hover:text-yellow-300">
                <Icon className="size-5" />
              </div>
              <h3 className="text-xl font-semibold text-white">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="resources" className="mx-auto max-w-[98%] px-6 py-24 lg:px-8">
        <SectionHeading
          title="Módulos abrangentes"
          description="Tudo integrado em um ecossistema único, sem trocar de ferramenta no meio da operação."
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {modules.map(({ label, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/5 px-4 py-4 backdrop-blur transition hover:scale-[1.02] hover:bg-white/8"
            >
              <Icon className="size-5 text-zinc-400" />
              <span className="text-sm font-medium text-white">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/8 bg-zinc-950/80 py-20">
        <div className="mx-auto grid max-w-[98%] grid-cols-2 gap-10 px-6 text-center md:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-semibold tracking-tight text-yellow-300 md:text-5xl">{stat.value}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.22em] text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="plans" className="mx-auto max-w-[98%] px-6 py-24 lg:px-8">
        <SectionHeading
          title="Preços simples e transparentes"
          description="Escolha o plano que acompanha a fase de crescimento da sua academia."
        />
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3 lg:items-center">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border p-8 transition duration-300 hover:-translate-y-2 ${
                plan.highlighted
                  ? "border-yellow-400/45 bg-[#141416] shadow-[0_0_40px_rgba(250,204,21,0.14)] lg:scale-105"
                  : "border-white/8 bg-zinc-900/80"
              }`}
            >
              {plan.highlighted ? (
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-black">
                  Mais popular
                </div>
              ) : null}
              <h3 className="text-2xl font-semibold text-white">{plan.name}</h3>
              <p className="mt-2 text-sm leading-7 text-zinc-400">{plan.description}</p>
              <div className="mt-7 flex items-end gap-2">
                <span className={`font-semibold tracking-tight ${plan.highlighted ? "text-5xl" : "text-4xl"}`}>
                  {plan.price}
                </span>
                <span className="pb-1 text-zinc-500">/mês</span>
              </div>
              <ul className="mt-8 space-y-3 text-sm text-zinc-300">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-4 text-yellow-300" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.highlighted ? "default" : "outline"}
                className={`mt-8 h-12 w-full rounded-md px-4 text-sm font-semibold ${
                  plan.highlighted
                    ? "bg-linear-to-b from-yellow-300 to-yellow-500 text-black hover:from-yellow-200 hover:to-yellow-400"
                    : "border-zinc-800 bg-transparent text-zinc-100 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-[98%] px-6 py-24 lg:px-8">
        <SectionHeading
          title="Perguntas frequentes"
          description="Tem dúvidas? Aqui estão as respostas mais comuns antes de sua equipe entrar em produção."
        />
        <div className="mx-auto max-w-6xl space-y-3">
          {faqs.map((faq) => (
            <details key={faq.question} className="group rounded-md border border-white/8 bg-zinc-900/80">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-base font-medium text-white marker:content-none">
                <span>{faq.question}</span>
                <ChevronDown className="size-5 shrink-0 text-zinc-500 transition group-open:rotate-180" />
              </summary>
              <div className="border-t border-white/6 px-5 py-4 text-sm leading-7 text-zinc-400">{faq.answer}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[98%] px-6 pb-24 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-white/8 bg-linear-to-br from-zinc-900 to-[#09090b] px-6 py-16 text-center shadow-[0_0_50px_rgba(250,204,21,0.05)] md:px-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(250,204,21,0.12),transparent_58%)]" />
          <div className="relative mx-auto max-w-3xl">
            <h2 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Pronto para transformar sua academia?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
              Junte-se a gestores que já escalam operação, retenção e receita com um stack desenhado para fitness.
            </p>
            <Button className="mt-8 h-12 rounded-md bg-linear-to-b from-yellow-300 to-yellow-500 px-6 text-sm font-semibold text-black hover:from-yellow-200 hover:to-yellow-400">
              Começar teste gratuito
            </Button>
            <p className="mt-4 text-sm text-zinc-500">14 dias de teste grátis. Sem cartão de crédito necessário.</p>
          </div>
        </div>
      </section>

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

          {footerGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-white">{group.title}</h3>
              <div className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <a key={link.label} href={link.href} className="block text-sm text-zinc-500 transition hover:text-yellow-300">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </footer>
    </main>
  );
}
