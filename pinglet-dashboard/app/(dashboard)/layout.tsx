import type React from "react"
import DashboardLayout from "@/components/layout/dashboard"
import ToastContainer from "@/components/brand-toaster/toastContainer"
import PingletWidget from "@/components/pinglet"


export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout>
      <PingletWidget />
      <ToastContainer position="top-right" />
      <main className="flex-1 overflow-auto">{children}</main>
    </DashboardLayout>
  )
}
