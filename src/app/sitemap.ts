import type { MetadataRoute } from "next"

import { siteUrl } from "@/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: new URL("/fontes-e-licencas", siteUrl).toString(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ]
}
