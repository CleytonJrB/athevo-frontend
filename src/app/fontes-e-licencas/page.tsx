import type { Metadata } from "next"
import { ExternalLink, Scale, ShieldCheck } from "lucide-react"

import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"

export const metadata: Metadata = {
  title: "Fontes e licenças",
  description: "Origem, atribuição e licenças do catálogo de exercícios da Athevo.",
}

const acceptedLicenses = ["CC0", "CC-BY 4", "CC-BY-SA 3", "CC-BY-SA 4"]

export default function SourcesAndLicensesPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <Header hasName onlyLogo />

      <main className="mx-auto w-full max-w-4xl px-6 pt-28 pb-20 lg:px-8">
        <header className="border-b border-white/10 pb-8">
          <div className="flex items-center gap-3 text-yellow-300">
            <Scale aria-hidden="true" className="size-5" />
            <span className="text-sm font-semibold">Transparência do catálogo</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Fontes e licenças
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-zinc-400">
            Esta página descreve como a Athevo identifica a origem e preserva os
            créditos do conteúdo externo usado na biblioteca de exercícios.
          </p>
        </header>

        <div className="space-y-10 pt-10 leading-7 text-zinc-300">
          <section>
            <h2 className="text-xl font-semibold text-white">Fonte externa</h2>
            <p className="mt-3">
              Parte do catálogo pode ser derivada da base pública do{" "}
              <a
                href="https://wger.de/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-yellow-300 hover:underline"
              >
                wger Workout Manager
                <ExternalLink aria-hidden="true" className="size-4" />
              </a>
              . Cada exercício, tradução e mídia mantém sua própria atribuição;
              a licença não é presumida apenas pela fonte.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Licenças aceitas</h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {acceptedLicenses.map((license) => (
                <li
                  key={license}
                  className="flex items-center gap-2 border-l-2 border-yellow-300/50 pl-3"
                >
                  <ShieldCheck aria-hidden="true" className="size-4 text-yellow-300" />
                  {license}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-zinc-400">
              Licenças desconhecidas ou fora dessa lista não são publicadas sem
              avaliação específica.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Créditos individuais</h2>
            <p className="mt-3">
              Os detalhes do exercício apresentam título, autor informado pela fonte,
              origem, licença, link da licença e aviso de alteração. Mídias só são
              exibidas quando possuem licença individual permitida; a licença do
              exercício pai não substitui a licença da imagem ou do vídeo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Alterações</h2>
            <p className="mt-3">
              Textos externos podem ter marcação insegura removida e formatação
              normalizada. Quando isso ocorre, o item é identificado como modificado.
              Conteúdo sob licença ShareAlike continua identificado com a licença
              correspondente e não é apresentado como conteúdo exclusivamente
              proprietário da Athevo.
            </p>
          </section>

          <section className="border-t border-white/10 pt-8 text-sm text-zinc-500">
            <p>
              A publicação do catálogo externo em produção permanece condicionada à
              revisão jurídica de propriedade intelectual e à habilitação operacional
              explícita. Esta página não substitui os créditos individuais exibidos em
              cada item.
            </p>
          </section>
        </div>
      </main>

      <Footer simple />
    </div>
  )
}
