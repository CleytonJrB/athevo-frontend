import "server-only"

import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { loginWithApi } from "@/lib/auth/athevo-api"
import { loginSchema } from "@/lib/validations/auth"

const developmentSecret = "athevo-local-development-secret"

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV === "development" ? developmentSecret : undefined),
  session: { strategy: "jwt", maxAge: 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "E-mail e senha",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        try {
          const data = await loginSchema.validate(credentials, {
            abortEarly: false,
            stripUnknown: true,
          })

          const result = await loginWithApi(data.email, data.password)

          return {
            ...result.user,
            accessToken: result.accessToken,
            accessTokenExpiresAt: result.expiresAt,
          }
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.tenantId = user.tenantId
        token.role = user.role
        token.accessToken = user.accessToken
        token.accessTokenExpiresAt = user.accessTokenExpiresAt
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id
        session.user.tenantId = token.tenantId
        session.user.role = token.role
      }
      session.accessToken = token.accessToken
      session.accessTokenExpiresAt = token.accessTokenExpiresAt
      return session
    },
  },
}
