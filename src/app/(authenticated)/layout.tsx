import type { Metadata } from "next"
import type { ReactNode } from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

import { authOptions } from "@/lib/auth/config"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AuthenticatedFooter } from "@/components/layout/authenticated-footer"
import { AuthenticatedHeader } from "@/components/layout/authenticated-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

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

        <AuthenticatedFooter />
      </SidebarInset>
    </SidebarProvider>
  )
}
