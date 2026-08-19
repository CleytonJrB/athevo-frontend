import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    accessTokenExpiresAt?: string
    user: {
      id: string
      tenantId?: string
      role?: string
    } & DefaultSession["user"]
  }

  interface User {
    tenantId?: string
    role?: string
    accessToken?: string
    accessTokenExpiresAt?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    tenantId?: string
    role?: string
    accessToken?: string
    accessTokenExpiresAt?: string
  }
}
