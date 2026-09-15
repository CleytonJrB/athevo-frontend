import type { ComponentPropsWithoutRef } from "react"

import { toast, type AthevoToastData, type AthevoToastType } from "@/components/ui/toast"

export interface AppToastMessage {
  description?: string
  title: string
}

interface AppToastOptions extends AppToastMessage {
  actionProps?: ComponentPropsWithoutRef<"button">
  data?: AthevoToastData
  id?: string
  timeout?: number
}

export interface AppErrorToastOptions {
  fallback?: string
  id?: string
  title?: string
}

export interface AppActionToastOptions {
  description?: string
  label: string
  onAction: () => void
}

export interface AppMultilineToastOptions {
  lines: string[]
  title: string
}

export interface AppCheckInToastOptions {
  initials?: string
  location: string
  memberName: string
  plan?: string
  time?: string
}

export interface AppPromiseToastOptions<Value> {
  error?: AppToastMessage | ((error: unknown) => AppToastMessage)
  loading: AppToastMessage
  success: AppToastMessage | ((value: Value) => AppToastMessage)
}

const defaultErrorMessage =
  "Não foi possível concluir a operação. Tente novamente."

export function getErrorMessage(
  error: unknown,
  fallback = defaultErrorMessage,
) {
  if (!(error instanceof Error) || !error.message.trim()) return fallback

  if (
    error.message === "Network Error" ||
    error.message === "Failed to fetch"
  ) {
    return "Não foi possível conectar ao servidor. Verifique sua conexão."
  }

  return error.message
}

function showToast(
  type: AthevoToastType,
  {
    actionProps,
    data,
    description,
    id,
    timeout,
    title,
  }: AppToastOptions,
) {
  return toast.add({
    actionProps,
    data,
    description,
    id,
    priority: type === "error" ? "high" : "low",
    timeout,
    title,
    type,
  })
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

function resolveMessage<Value>(
  message: AppToastMessage | ((value: Value) => AppToastMessage),
  value: Value,
) {
  return typeof message === "function" ? message(value) : message
}

export const appToast = {
  action(title: string, options: AppActionToastOptions) {
    let toastId = ""
    toastId = showToast("action", {
      actionProps: {
        children: options.label,
        onClick: () => {
          options.onAction()
          toast.close(toastId)
        },
      },
      description: options.description,
      title,
    })
    return toastId
  },
  checkIn(options: AppCheckInToastOptions) {
    return showToast("check-in", {
      data: {
        checkIn: {
          initials: options.initials ?? getInitials(options.memberName),
          location: options.location,
          memberName: options.memberName,
          plan: options.plan,
          time: options.time,
        },
      },
      title: options.memberName,
    })
  },
  default(title: string, description?: string) {
    return showToast("default", { description, title })
  },
  dismiss(id?: string) {
    toast.close(id)
  },
  error(error: unknown, options: AppErrorToastOptions = {}) {
    return showToast("error", {
      description: getErrorMessage(error, options.fallback),
      id: options.id,
      title: options.title ?? "Ocorreu um erro",
    })
  },
  info(title: string, description?: string) {
    return showToast("info", { description, title })
  },
  loading(title: string, description?: string) {
    return showToast("loading", { description, timeout: 0, title })
  },
  multiline({ lines, title }: AppMultilineToastOptions) {
    return showToast("multiline", {
      data: { lines },
      title,
    })
  },
  promise<Value>(
    promise: Promise<Value>,
    options: AppPromiseToastOptions<Value>,
  ) {
    return toast.promise(promise, {
      loading: {
        description: options.loading.description,
        title: options.loading.title,
        type: "loading",
      },
      success: (value) => {
        const message = resolveMessage(options.success, value)
        return { ...message, type: "success" }
      },
      error: (error) => {
        if (options.error) {
          const message = resolveMessage(options.error, error)
          return { ...message, priority: "high", type: "error" }
        }

        return {
          description: getErrorMessage(error),
          priority: "high",
          title: "Ocorreu um erro",
          type: "error",
        }
      },
    })
  },
  success(title: string, description?: string) {
    return showToast("success", { description, title })
  },
  undo(title: string, options: AppActionToastOptions) {
    let toastId = ""
    toastId = showToast("undo", {
      actionProps: {
        children: options.label,
        onClick: () => {
          options.onAction()
          toast.close(toastId)
        },
      },
      description: options.description,
      timeout: 10_000,
      title,
    })
    return toastId
  },
  warning(title: string, description?: string) {
    return showToast("warning", { description, title })
  },
}
