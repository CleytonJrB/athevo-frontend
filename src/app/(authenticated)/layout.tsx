import type { ReactNode } from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth/config"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AuthenticatedHeader } from "@/components/layout/authenticated-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) redirect("/login")

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <AuthenticatedHeader />

        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
