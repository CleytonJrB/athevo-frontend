import "server-only"

import { createHash } from "node:crypto"
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
import { sessionPolicy } from "@/lib/auth/session-policy"
import { loginSchema, registerSchema } from "@/lib/validations/auth"

interface RefreshRequest {
  promise: Promise<Awaited<ReturnType<typeof refreshWithApi>>>
  retainedUntil?: number
}

const refreshRequests = new Map<string, RefreshRequest>()
const refreshResultRetentionMs = 60_000

function getRefreshRequestKey(refreshToken: string) {
  return createHash("sha256").update(refreshToken).digest("base64url")
}

async function refreshAccessToken(refreshToken: string) {
  const requestKey = getRefreshRequestKey(refreshToken)
  const pending = refreshRequests.get(requestKey)
  if (
    pending &&
    (!pending.retainedUntil || pending.retainedUntil > Date.now())
  ) {
    return pending.promise
  }

  refreshRequests.delete(requestKey)

  const entry: RefreshRequest = {
    promise: refreshWithApi(refreshToken),
  }
  refreshRequests.set(requestKey, entry)

  void entry.promise.then(
    () => {
      entry.retainedUntil = Date.now() + refreshResultRetentionMs
      setTimeout(() => {
        if (refreshRequests.get(requestKey) === entry) {
          refreshRequests.delete(requestKey)
        }
      }, refreshResultRetentionMs)
    },
    () => {
      refreshRequests.delete(requestKey)
    }
  )

  return entry.promise
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
  session: { strategy: "jwt", maxAge: sessionPolicy.maxAgeSeconds },
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
      const refreshTokenExpiresAt = token.refreshTokenExpiresAt
        ? Date.parse(token.refreshTokenExpiresAt)
        : 0

      if (
        token.refreshToken &&
        (!refreshTokenExpiresAt || refreshTokenExpiresAt <= Date.now())
      ) {
        token.error = "RefreshAccessTokenError"
        return token
      }

      const shouldRefresh =
        Boolean(token.refreshToken) &&
        (!accessTokenExpiresAt ||
          accessTokenExpiresAt <=
            Date.now() + sessionPolicy.refreshBeforeExpirationMs)

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
