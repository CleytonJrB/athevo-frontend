import "server-only"

import { randomUUID } from "node:crypto"

import type { RegisterFormData } from "@/lib/validations/auth"
import { hashPassword, verifyPassword } from "@/lib/auth/password"

interface StoredUser {
  id: string
  name: string
  email: string
  passwordHash: string
  registration: Omit<
    RegisterFormData,
    "password" | "passwordConfirmation" | "acceptedTerms"
  >
}

export interface AuthUser {
  id: string
  name: string
  email: string
}

export class UserAlreadyExistsError extends Error {}

const globalAuthStore = globalThis as typeof globalThis & {
  __athevoAuthUsers?: Map<string, StoredUser>
}

const users = globalAuthStore.__athevoAuthUsers ?? new Map<string, StoredUser>()
globalAuthStore.__athevoAuthUsers = users

function normalizeEmail(email: string) {
  return email.trim().toLocaleLowerCase("pt-BR")
}

function toAuthUser(user: StoredUser): AuthUser {
  return { id: user.id, name: user.name, email: user.email }
}

export async function createUser(data: RegisterFormData): Promise<AuthUser> {
  const email = normalizeEmail(data.email)

  if (users.has(email)) {
    throw new UserAlreadyExistsError("Já existe uma conta com este e-mail")
  }

  const {
    password,
    passwordConfirmation: _passwordConfirmation,
    acceptedTerms: _acceptedTerms,
    ...registration
  } = data
  void _passwordConfirmation
  void _acceptedTerms

  const user: StoredUser = {
    id: randomUUID(),
    name: `${data.firstName} ${data.lastName}`.trim(),
    email,
    passwordHash: await hashPassword(password),
    registration: { ...registration, email },
  }

  if (users.has(email)) {
    throw new UserAlreadyExistsError("Já existe uma conta com este e-mail")
  }

  users.set(email, user)
  return toAuthUser(user)
}

export async function verifyUserCredentials(email: string, password: string) {
  const user = users.get(normalizeEmail(email))

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return null
  }

  return toAuthUser(user)
}
