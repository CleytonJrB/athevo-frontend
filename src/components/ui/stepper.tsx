"use client"

import { Steps } from "@ark-ui/react/steps"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Stepper({ className, ...props }: Steps.RootProps) {
  return (
    <Steps.Root
      data-slot="stepper"
      className={cn("w-full", className)}
      {...props}
    />
  )
}

function StepperList({ className, ...props }: Steps.ListProps) {
  return (
    <Steps.List
      data-slot="stepper-list"
      className={cn(
        "flex w-full items-start data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function StepperItem({ className, ...props }: Steps.ItemProps) {
  return (
    <Steps.Item
      data-slot="stepper-item"
      className={cn(
        "group/step flex min-w-0 flex-1 items-start last:flex-none data-[orientation=vertical]:w-full data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function StepperTrigger({ className, ...props }: Steps.TriggerProps) {
  return (
    <Steps.Trigger
      data-slot="stepper-trigger"
      className={cn(
        "group/step-trigger flex shrink-0 cursor-pointer flex-col items-center gap-2 rounded-md text-center outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 data-[orientation=vertical]:grid data-[orientation=vertical]:grid-cols-[2rem_minmax(0,1fr)] data-[orientation=vertical]:text-left",
        className
      )}
      {...props}
    />
  )
}

function StepperIndicator({ className, ...props }: Steps.IndicatorProps) {
  return (
    <Steps.Indicator
      data-slot="stepper-indicator"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-muted-foreground transition-colors data-complete:text-primary-foreground data-current:border-primary data-current:bg-primary data-current:text-primary-foreground data-current:shadow-[0_0_18px_rgba(250,204,21,0.28)]",
        className
      )}
      {...props}
    />
  )
}

function StepperLabel({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="stepper-label"
      className={cn(
        "flex min-w-0 flex-col gap-0.5 group-data-[state=open]/step-trigger:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function StepperTitle({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="stepper-title"
      className={cn("text-xs font-medium text-foreground", className)}
      {...props}
    />
  )
}

function StepperDescription({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="stepper-description"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

function StepperSeparator({ className, ...props }: Steps.SeparatorProps) {
  return (
    <Steps.Separator
      data-slot="stepper-separator"
      className={cn(
        "mx-3 mt-4 h-px min-w-4 flex-1 bg-border transition-colors data-complete:bg-primary data-[orientation=vertical]:my-2 data-[orientation=vertical]:ml-[calc(1rem-0.5px)] data-[orientation=vertical]:h-8 data-[orientation=vertical]:w-px data-[orientation=vertical]:flex-none",
        className
      )}
      {...props}
    />
  )
}

function StepperContent({ className, ...props }: Steps.ContentProps) {
  return (
    <Steps.Content
      data-slot="stepper-content"
      className={cn("mt-8 outline-none", className)}
      {...props}
    />
  )
}

function StepperCompletedContent({ className, ...props }: Steps.CompletedContentProps) {
  return (
    <Steps.CompletedContent
      data-slot="stepper-completed-content"
      className={cn("mt-8 outline-none", className)}
      {...props}
    />
  )
}

function StepperProgress({ className, ...props }: Steps.ProgressProps) {
  return (
    <Steps.Progress
      data-slot="stepper-progress"
      className={cn("sr-only", className)}
      {...props}
    />
  )
}

function StepperPreviousTrigger({ className, ...props }: Steps.PrevTriggerProps) {
  return (
    <Steps.PrevTrigger
      data-slot="stepper-previous-trigger"
      className={cn(buttonVariants({ variant: "outline", size: "lg" }), className)}
      {...props}
    />
  )
}

function StepperNextTrigger({ className, ...props }: Steps.NextTriggerProps) {
  return (
    <Steps.NextTrigger
      data-slot="stepper-next-trigger"
      className={cn(buttonVariants({ size: "lg" }), className)}
      {...props}
    />
  )
}

interface StepperActionsProps extends React.ComponentProps<"div"> {
  previousLabel?: React.ReactNode
  nextLabel?: React.ReactNode
  completeLabel?: React.ReactNode
}

function StepperActions({
  className,
  previousLabel = "Voltar",
  nextLabel = "Continuar",
  completeLabel = "Finalizar",
  ...props
}: StepperActionsProps) {
  return (
    <Steps.Context>
      {({ count, hasNextStep, hasPrevStep, isCompleted, value }) =>
        isCompleted ? null : (
          <div
            data-slot="stepper-actions"
            className={cn("mt-8 flex items-center justify-between gap-3", className)}
            {...props}
          >
            <StepperPreviousTrigger disabled={!hasPrevStep}>
              {previousLabel}
            </StepperPreviousTrigger>
            <StepperNextTrigger disabled={!hasNextStep}>
              {value === count - 1 ? completeLabel : nextLabel}
            </StepperNextTrigger>
          </div>
        )
      }
    </Steps.Context>
  )
}

const StepperContext = Steps.Context

export {
  Stepper,
  StepperActions,
  StepperCompletedContent,
  StepperContent,
  StepperContext,
  StepperDescription,
  StepperIndicator,
  StepperItem,
  StepperLabel,
  StepperList,
  StepperNextTrigger,
  StepperPreviousTrigger,
  StepperProgress,
  StepperSeparator,
  StepperTitle,
  StepperTrigger,
}
