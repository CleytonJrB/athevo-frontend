const fallbackSiteUrl = "http://localhost:3000"

export const siteConfig = {
  name: "Athevo",
  title: "Athevo | Gestão precisa para academias",
  description:
    "Plataforma completa para gestão de academias, alunos, treinos e finanças.",
  url: process.env.ATHEVO_SITE_URL ?? fallbackSiteUrl,
  locale: "pt_BR",
  themeColor: "#09090b",
} as const

export const siteUrl = new URL(siteConfig.url)
