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
  switchTenantWithApi,
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

function readTenantIdFromSessionUpdate(session: unknown) {
  if (!session || typeof session !== "object" || !("tenantId" in session)) {
    return null
  }

  const tenantId = session.tenantId
  return typeof tenantId === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      tenantId
    )
    ? tenantId
    : null
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.tenantId = user.tenantId
        token.tenantName = user.tenantName
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

      if (trigger === "update") {
        const tenantId = readTenantIdFromSessionUpdate(session)

        if (!tenantId || !token.accessToken) {
          token.error = "TenantSwitchError"
          return token
        }

        if (tenantId !== token.tenantId) {
          try {
            const previousRefreshToken = token.refreshToken
            const switched = await switchTenantWithApi(token.accessToken, tenantId)

            if (previousRefreshToken) {
              await logoutWithApi(previousRefreshToken).catch(() => undefined)
            }

            token.tenantId = switched.tenantId
            token.tenantName = switched.tenantName
            token.role = switched.role
            token.accessToken = switched.accessToken
            token.accessTokenExpiresAt = switched.expiresAt
            token.refreshToken = switched.refreshToken
            token.refreshTokenExpiresAt = switched.refreshTokenExpiresAt
            token.error = undefined
          } catch {
            token.error = "TenantSwitchError"
          }
        } else {
          token.error = undefined
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id
        session.user.tenantId = token.tenantId
        session.user.tenantName = token.tenantName
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
