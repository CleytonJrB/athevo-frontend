"use client"

import { createPortal } from "react-dom"

interface AcademySwitcherBackdropProps {
  onDismiss: () => void
}

export function AcademySwitcherBackdrop({
  onDismiss,
}: AcademySwitcherBackdropProps) {
  return createPortal(
    <button
      type="button"
      aria-label="Fechar seletor de workspace"
      className="fixed inset-0 z-40 cursor-default bg-background/50 backdrop-blur-[2px] animate-in fade-in-0 duration-150"
      onClick={onDismiss}
    />,
    document.body
  )
}
