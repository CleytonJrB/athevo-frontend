import "server-only"

import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import {
  AthevoApiError,
  loginWithApi,
  logoutWithApi,
  registerWithApi,
  refreshWithApi,
  type BackendAuthResponse,
} from "@/lib/auth/athevo-api"
import { loginSchema, registerSchema } from "@/lib/validations/auth"

const refreshLocks = new Map<
  string,
  Promise<Awaited<ReturnType<typeof refreshWithApi>>>
>()

async function refreshAccessToken(refreshToken: string) {
  const pending = refreshLocks.get(refreshToken)
  if (pending) return pending

  const request = refreshWithApi(refreshToken).finally(() => {
    refreshLocks.delete(refreshToken)
  })
  refreshLocks.set(refreshToken, request)
  return request
}

function createSessionUser(result: BackendAuthResponse) {
  return {
    ...result.user,
    accessToken: result.accessToken,
    accessTokenExpiresAt: result.expiresAt,
    refreshToken: result.refreshToken,
    refreshTokenExpiresAt: result.refreshTokenExpiresAt,
  }
}

const developmentSecret = "athevo-local-development-secret"

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV === "development" ? developmentSecret : undefined),
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
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

          return createSessionUser(result)
        } catch {
          return null
        }
      },
    }),
    CredentialsProvider({
      id: "register",
      name: "Criar conta",
      credentials: {
        registration: { label: "Cadastro", type: "text" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.registration) return null

          const payload: unknown = JSON.parse(credentials.registration)
          const data = await registerSchema.validate(payload, {
            abortEarly: false,
            stripUnknown: true,
          })
          const result = await registerWithApi(data)

          return createSessionUser(result)
        } catch (error) {
          if (error instanceof AthevoApiError) {
            throw new Error(error.message)
          }

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
        token.refreshToken = user.refreshToken
        token.refreshTokenExpiresAt = user.refreshTokenExpiresAt
        token.error = undefined
      }

      const accessTokenExpiresAt = token.accessTokenExpiresAt
        ? Date.parse(token.accessTokenExpiresAt)
        : 0
      const shouldRefresh =
        Boolean(token.refreshToken) &&
        (!accessTokenExpiresAt || accessTokenExpiresAt <= Date.now() + 30_000)

      if (shouldRefresh && token.refreshToken) {
        try {
          const refreshed = await refreshAccessToken(token.refreshToken)
          token.accessToken = refreshed.accessToken
          token.accessTokenExpiresAt = refreshed.expiresAt
          token.refreshToken = refreshed.refreshToken
          token.refreshTokenExpiresAt = refreshed.refreshTokenExpiresAt
          token.error = undefined
        } catch {
          token.error = "RefreshAccessTokenError"
        }
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
      session.error = token.error
      return session
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.refreshToken) {
        await logoutWithApi(token.refreshToken).catch(() => undefined)
      }
    },
  },
}
