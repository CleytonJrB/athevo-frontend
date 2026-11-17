"use client"

import { useQuery } from "@tanstack/react-query"
import { useSession } from "next-auth/react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { getStudentPhoto } from "@/services/students-service"
import { cn } from "@/lib/utils"

interface StudentAvatarProps {
  className?: string
  hasPhoto: boolean
  name: string
  tenantUserId: string
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function StudentAvatar({
  className,
  hasPhoto,
  name,
  tenantUserId,
}: StudentAvatarProps) {
  const { data: session } = useSession()
  const photoQuery = useQuery({
    queryKey: ["students", session?.user.tenantId, tenantUserId, "photo"],
    queryFn: ({ signal }) => getStudentPhoto(tenantUserId, signal),
    enabled: hasPhoto && Boolean(session?.user.tenantId),
    retry: false,
    staleTime: 4 * 60 * 1000,
    meta: { skipGlobalErrorToast: true },
  })

  return (
    <Avatar size="lg" className={className}>
      {photoQuery.data?.url && (
        <AvatarImage src={photoQuery.data.url} alt={`Foto de ${name}`} />
      )}
      <AvatarFallback
        className={cn(
          "bg-surface-container text-sm font-semibold text-on-surface-variant",
          photoQuery.isFetching && "animate-pulse",
        )}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  )
}
