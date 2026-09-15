"use client"

import * as React from "react"
import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import {
  Check,
  FileText,
  Info,
  Loader2,
  MessageCircleMore,
  OctagonX,
  Trash2,
  TriangleAlert,
  UserPlus,
  X,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type AthevoToastType =
  | "action"
  | "check-in"
  | "default"
  | "error"
  | "info"
  | "loading"
  | "multiline"
  | "success"
  | "undo"
  | "warning"

export interface AthevoToastData {
  checkIn?: {
    initials: string
    location: string
    memberName: string
    plan?: string
    time?: string
  }
  lines?: string[]
}

const toast = ToastPrimitive.createToastManager<AthevoToastData>()

const toastTypeStyles: Partial<Record<AthevoToastType, string>> = {
  action:
    "border-primary-container/30 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(250,204,21,0.15)]",
  "check-in":
    "border-primary-container/30 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(250,204,21,0.15)] hover:border-primary-container/50",
  error:
    "border-red-500/40 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(239,68,68,0.15)]",
  info: "border-sky-500/40 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(14,165,233,0.15)]",
  loading:
    "border-primary-container/30 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(250,204,21,0.15)]",
  success:
    "border-primary-container/40 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(250,204,21,0.2)]",
  warning:
    "border-amber-500/40 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(245,158,11,0.15)]",
}

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-4 z-[100] mx-auto w-auto max-w-sm outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full",
        className,
      )}
      {...props}
    />
  )
}

function Toast({ className, toast: toastItem, ...props }: ToastPrimitive.Root.Props) {
  const type = toastItem.type as AthevoToastType | undefined

  return (
    <ToastPrimitive.Root
      data-slot="toast"
      toast={toastItem}
      className={cn(
        "group/toast pointer-events-auto absolute right-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom overflow-hidden rounded-xl border border-outline-variant bg-surface text-on-surface shadow-2xl will-change-transform outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
        "h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
        "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-limited:opacity-0 data-starting-style:[transform:translateY(150%)]",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
        "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        type && toastTypeStyles[type],
        className,
      )}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex h-full items-start gap-3.5 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
        className,
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm font-semibold text-on-surface", className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("mt-0.5 text-xs text-on-surface-variant", className)}
      {...props}
    />
  )
}

function ToastAction({
  className,
  render = <Button size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn("mt-0.5 shrink-0 text-xs font-semibold", className)}
      {...props}
    />
  )
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Fechar notificação"
      render={render}
      className={cn(
        "relative -mt-1 -mr-1 shrink-0 text-on-surface-variant after:absolute after:-inset-2 after:content-[''] hover:text-on-surface",
        className,
      )}
      {...props}
    >
      {children ?? <X aria-hidden="true" />}
    </ToastPrimitive.Close>
  )
}

const toastIcons: Partial<Record<AthevoToastType, LucideIcon>> = {
  action: UserPlus,
  default: MessageCircleMore,
  error: OctagonX,
  info: Info,
  loading: Loader2,
  multiline: FileText,
  success: Check,
  undo: Trash2,
  warning: TriangleAlert,
}

const toastIconStyles: Partial<Record<AthevoToastType, string>> = {
  action:
    "border-primary-container/30 bg-primary-container/15 text-primary-container",
  error: "border-red-500/30 bg-red-500/15 text-red-400",
  info: "border-sky-500/30 bg-sky-500/15 text-sky-400",
  loading:
    "border-primary-container/30 bg-primary-container/15 text-primary-container",
  multiline:
    "border-primary-container/20 bg-primary-container/10 text-primary-container",
  success:
    "border-primary-container/30 bg-primary-container/15 text-primary-container",
  warning: "border-amber-500/30 bg-amber-500/15 text-amber-400",
}

function ToastIcon({ type }: { type: AthevoToastType | undefined }) {
  const Icon = type ? toastIcons[type] : undefined
  if (!Icon) return null

  return (
    <span
      data-slot="toast-icon"
      className={cn(
        "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-outline-variant bg-surface-container-high text-on-surface-variant [&_svg]:size-4",
        type && toastIconStyles[type],
      )}
    >
      <Icon
        aria-hidden="true"
        className={cn(type === "loading" && "animate-spin")}
      />
    </span>
  )
}

function CheckInToast({ data }: { data: NonNullable<AthevoToastData["checkIn"]> }) {
  return (
    <>
      <div className="relative shrink-0">
        <div className="flex size-10 items-center justify-center rounded-full border border-outline-variant bg-surface-container-high text-xs font-bold text-on-surface">
          {data.initials}
        </div>
        <span className="absolute -right-0.5 -bottom-0.5 flex size-3.5 items-center justify-center rounded-full border-2 border-surface bg-emerald-500">
          <Check aria-hidden="true" className="size-2 text-black" />
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <ToastTitle className="truncate">{data.memberName}</ToastTitle>
          {data.plan && (
            <span className="rounded border border-primary-container/20 bg-primary-container/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-primary-container uppercase">
              {data.plan}
            </span>
          )}
        </div>
        <ToastDescription className="flex items-center gap-1.5">
          <span className="font-medium text-emerald-400">{data.location}</span>
          <span aria-hidden="true">•</span>
          <span className="font-mono text-on-surface-variant/70">
            {data.time ?? "Agora"}
          </span>
        </ToastDescription>
      </div>
    </>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager<AthevoToastData>()

  return toasts.map((toastItem) => {
    const type = toastItem.type as AthevoToastType | undefined
    const checkIn = type === "check-in" ? toastItem.data?.checkIn : undefined
    const showClose =
      type !== "action" && type !== "loading" && type !== "undo"

    return (
      <Toast key={toastItem.id} toast={toastItem}>
        <ToastContent>
          {checkIn ? (
            <CheckInToast data={checkIn} />
          ) : (
            <>
              <ToastIcon type={type} />
              <div className="min-w-0 flex-1">
                <ToastTitle />
                {type === "multiline" && toastItem.data?.lines ? (
                  <ToastDescription className="space-y-1">
                    {toastItem.data.lines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </ToastDescription>
                ) : (
                  <ToastDescription />
                )}
              </div>
              <ToastAction
                render={
                  <Button
                    variant={type === "undo" ? "outline" : "default"}
                    size="sm"
                    className={cn(
                      type === "undo" &&
                        "border-outline-variant bg-surface-container-high text-on-surface hover:border-primary-container/40 hover:bg-surface-container-highest",
                    )}
                  />
                }
              />
            </>
          )}
          {showClose && <ToastClose />}
        </ToastContent>
      </Toast>
    )
  })
}

function Toaster({
  children,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

export {
  Toaster,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  createToastManager,
  toast,
  useToastManager,
}
