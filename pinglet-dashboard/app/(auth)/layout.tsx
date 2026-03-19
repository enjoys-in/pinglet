import type React from "react"
import Link from "next/link"
import { Bell } from "lucide-react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      {/* Dot grid background */}
      <div className="dot-grid pointer-events-none absolute inset-0 -z-10" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background))_70%)]" />
      {/* Primary glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />

      {/* Logo */}
      <Link href="/" className="mb-8 flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Bell className="size-4" />
        </div>
        <span className="text-lg font-semibold tracking-tight">Pinglet</span>
      </Link>

      {/* Auth card */}
      <div className="w-full max-w-md">{children}</div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Pinglet &mdash; Powered by ENJOYS
      </p>
    </div>
  )
}
