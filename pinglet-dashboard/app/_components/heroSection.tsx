"use client"

import Link from "next/link"
import { ArrowRight, Bell, CheckCircle2, Zap, Globe, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeIn } from "./shared/fade-in"

const metrics = [
  { value: "500+", label: "Early adopters", color: "text-purple-500" },
  { value: "99.9%", label: "Uptime SLA", color: "text-emerald-500" },
  { value: "<40ms", label: "Avg. latency", color: "text-blue-500" },
  { value: "1M+", label: "Notifications sent", color: "text-pink-500" },
]

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="orb orb-purple -z-10 left-[10%] top-[15%] h-[500px] w-[500px]" />
      <div className="orb orb-blue -z-10 right-[5%] top-[10%] h-[400px] w-[400px]" />
      <div className="orb orb-pink -z-10 left-[40%] bottom-[10%] h-[350px] w-[350px]" />

      {/* Dot grid background */}
      <div className="dot-grid pointer-events-none absolute inset-0 -z-10" />
      {/* Radial fade over grid */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_20%,hsl(var(--background))_70%)]" />

      <div className="mx-auto max-w-6xl px-6 pb-16 pt-24 md:pb-24 md:pt-36">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-12">
          {/* Left: Text content */}
          <FadeIn className="max-w-xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary shadow-sm shadow-primary/5">
              <Sparkles className="size-3" />
              Now in Public Beta
              <span className="ml-1 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </span>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Notifications
              <br />
              <span className="gradient-text-animated">
                your users actually see
              </span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
              The simple push notification platform for startups. Send targeted,
              real-time web notifications — with analytics built in.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth/login">
                <Button size="lg" className="h-12 rounded-full px-7 text-sm font-medium shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-purple-500 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                  Start building free
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="h-12 rounded-full px-7 text-sm font-medium border-border/60 hover:bg-muted/60 transition-all duration-300">
                  View live demo
                </Button>
              </Link>
            </div>

            <p className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><CheckCircle2 className="size-3 text-emerald-500" /> No credit card</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="size-3 text-emerald-500" /> Free forever plan</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="size-3 text-emerald-500" /> 5 min setup</span>
            </p>
          </FadeIn>

          {/* Right: Floating notification cards */}
          <FadeIn delay={0.15} className="relative hidden lg:block">
            <div className="relative mx-auto aspect-square max-w-md">
              {/* Multi-color glow */}
              <div className="absolute inset-12 -z-10 rounded-full bg-gradient-to-br from-primary/15 via-blue-500/10 to-pink-500/10 blur-3xl" />

              {/* Card 1 - top right */}
              <div className="float-card-1 absolute right-0 top-8 w-72 rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm p-4 shadow-xl glow-card">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl icon-emerald">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Campaign delivered</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      1,247 users reached — <span className="text-emerald-500 font-medium">72.4% open rate</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2 - center left */}
              <div className="float-card-2 absolute left-0 top-1/3 w-64 rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm p-4 shadow-xl glow-card">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl icon-purple">
                    <Bell className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">New notification</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Your order #4829 has shipped!
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 3 - bottom right */}
              <div className="float-card-3 absolute bottom-16 right-4 w-64 rounded-2xl border border-border/40 bg-card/80 backdrop-blur-sm p-4 shadow-xl glow-card">
                <div className="flex items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl icon-blue">
                    <Globe className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Fast delivery</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      <span className="text-blue-500 font-medium">~38ms</span> avg. response time
                    </p>
                  </div>
                </div>
              </div>

              {/* Mini code snippet - bottom left */}
              <div className="float-card-2 absolute bottom-4 left-2 w-56 rounded-xl border border-border/40 bg-card/90 backdrop-blur-sm p-3 shadow-lg">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="h-2 w-2 rounded-full bg-red-400" />
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="ml-auto text-[9px] text-muted-foreground font-mono">api.ts</span>
                </div>
                <pre className="text-[10px] leading-relaxed font-mono">
                  <span className="text-pink-500">await</span>{" "}
                  <span className="text-blue-500">pinglet</span>
                  <span className="text-muted-foreground">.send({"{"}</span>{"\n"}
                  {"  "}<span className="text-emerald-500">title</span>
                  <span className="text-muted-foreground">:</span>{" "}
                  <span className="text-amber-500">&quot;Hello!&quot;</span>{"\n"}
                  <span className="text-muted-foreground">{"}"})</span>
                </pre>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Metrics bar */}
        <FadeIn delay={0.25} className="mt-20 border-t border-border/40 pt-10">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {metrics.map((m) => (
              <div key={m.label} className="text-center group">
                <p className={`text-2xl font-bold tracking-tight sm:text-3xl ${m.color} transition-colors`}>{m.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{m.label}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
