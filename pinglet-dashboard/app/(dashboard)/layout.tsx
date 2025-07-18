import type React from "react"
import DashboardLayout from "@/components/layout/dashboard"


export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout>
      <main className="flex-1 overflow-auto">{children}</main>

    </DashboardLayout>
  )
}
