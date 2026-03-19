"use client"

import Link from "next/link"
import { ArrowRight, Bell, CheckCircle2, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeIn } from "./shared/fade-in"

const metrics = [
  { value: "10K+", label: "Active developers" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "<40ms", label: "Avg. latency" },
  { value: "2B+", label: "Notifications sent" },
]

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Dot grid background */}
      <div className="dot-grid pointer-events-none absolute inset-0 -z-10" />
      {/* Radial fade over grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background))_70%)]" />

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-24 md:pb-24 md:pt-36">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
          {/* Left: Text content */}
          <FadeIn className="max-w-xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Zap className="size-3" />
              Now in Public Beta
            </span>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              Notifications
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                your users actually see
              </span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              The developer-first push notification platform. Send targeted,
              real-time messages across web and mobile — with analytics that
              matter.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth/login">
                <Button size="lg" className="h-11 rounded-full px-6 text-sm font-medium shadow-lg shadow-primary/20">
                  Start building free
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="h-11 rounded-full px-6 text-sm font-medium">
                  View live demo
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required &middot; Free forever plan &middot; 5 min setup
            </p>
          </FadeIn>

          {/* Right: Floating notification cards */}
          <FadeIn delay={0.15} className="relative hidden lg:block">
            <div className="relative mx-auto aspect-square max-w-md">
              {/* Glow */}
              <div className="glow-primary absolute inset-8 -z-10 rounded-full" />

              {/* Card 1 - top right */}
              <div className="absolute right-0 top-8 w-72 rounded-xl border border-border/60 bg-card p-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Campaign delivered</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      24,891 users reached — 89.2% open rate
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 - center left */}
              <div className="absolute left-0 top-1/3 w-64 rounded-xl border border-border/60 bg-card p-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bell className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New notification</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Your order #4829 has shipped!
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 - bottom right */}
              <div className="absolute bottom-12 right-4 w-60 rounded-xl border border-border/60 bg-card p-4 shadow-xl">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                    <Zap className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Smart targeting</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      AI optimized delivery time
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Metrics bar */}
        <FadeIn delay={0.25} className="mt-20 border-t border-border/50 pt-10">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="text-center">
                <p className="text-2xl font-bold tracking-tight sm:text-3xl">{m.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
