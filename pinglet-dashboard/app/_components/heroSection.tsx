"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "./shared/fade-in"

const stats = [
  { value: "10K+", label: "Developers" },
  { value: "99.9%", label: "Uptime" },
  { value: "<40ms", label: "Delivery" },
  { value: "300%", label: "More Engagement" },
]

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Gradient orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]" />
      <div className="pointer-events-none absolute -top-20 left-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />

      <div className="mx-auto max-w-7xl px-6 pb-20 pt-24 md:pb-28 md:pt-32">
        <FadeIn className="mx-auto max-w-4xl text-center">
          <Badge className="mb-6 inline-flex items-center gap-1.5 rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary/10">
            <Sparkles className="size-3" />
            Now in Beta
          </Badge>

          <h1 className="text-[2.5rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Push Notifications
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              That Actually Work
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg md:text-xl md:leading-relaxed">
            Engage your users with personalized, real-time notifications.
            Boost engagement by up to 300% with smart targeting.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="h-12 rounded-xl px-8 text-sm font-semibold shadow-lg shadow-primary/25 transition-shadow hover:shadow-xl hover:shadow-primary/30">
                Start for Free
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="h-12 rounded-xl px-8 text-sm font-semibold">
                Live Demo
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
            {["No credit card", "Free forever plan", "5-min setup"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="size-3.5 text-primary" />
                {t}
              </span>
            ))}
          </div>
        </FadeIn>

        {/* Dashboard preview */}
        <FadeIn delay={0.15} className="relative mx-auto mt-20 max-w-5xl">
          <div className="rounded-xl border border-border/60 bg-card p-1.5 shadow-2xl shadow-black/5 dark:shadow-black/30">
            <div className="overflow-hidden rounded-lg">
              <Image
                src="https://cdn.dribbble.com/userupload/12302729/file/original-fa372845e394ee85bebe0389b9d86871.png?resize=1504x1128&vertical=center"
                width={1280}
                height={720}
                alt="Pinglet dashboard preview"
                className="h-auto w-full"
                priority
              />
            </div>
          </div>
          <div className="pointer-events-none absolute -bottom-10 -right-10 -z-10 h-80 w-80 rounded-full bg-primary/15 blur-[80px]" />
          <div className="pointer-events-none absolute -left-10 -top-10 -z-10 h-80 w-80 rounded-full bg-primary/10 blur-[80px]" />
        </FadeIn>

        {/* Stats bar */}
        <FadeIn delay={0.3} className="mx-auto mt-16 max-w-3xl">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 bg-card px-4 py-5"
              >
                <span className="text-xl font-bold sm:text-2xl">{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
