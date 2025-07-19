import type React from "react"
import DashboardLayout from "@/components/layout/dashboard"
import ToastContainer from "@/components/brand-toaster/toastContainer"


export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout>
       <ToastContainer position="top-right" />
      <main className="flex-1 overflow-auto">{children}</main>

    </DashboardLayout>
  )
}
