import Image from "next/image"

import { cn } from "@/lib/utils"

interface LogoSimpleProps {
  alt?: string
  className?: string
  height?: number
  width?: number
}

export default function LogoSimple({
  alt = "",
  className,
  height = 24,
  width = 28,
}: LogoSimpleProps) {
  return (
    <Image
      src="/icons/logo-mark-neon.svg"
      alt={alt}
      width={width}
      height={height}
      className={cn("object-contain", className)}
    />
  )
}
