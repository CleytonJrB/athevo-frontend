import "server-only"

import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

import { verifyUserCredentials } from "@/lib/auth/user-store"
import { loginSchema } from "@/lib/validations/auth"

const developmentSecret = "athevo-local-development-secret"

export const authOptions: NextAuthOptions = {
  secret:
    process.env.NEXTAUTH_SECRET ??
    (process.env.NODE_ENV === "development" ? developmentSecret : undefined),
  session: { strategy: "jwt" },
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

          return await verifyUserCredentials(data.email, data.password)
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id
      return session
    },
  },
}
