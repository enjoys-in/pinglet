"use client"

import { SectionHeader } from "./shared/section-header"
import { FadeIn, StaggerContainer, StaggerItem } from "./shared/fade-in"
import { features } from "./_data/features"
import { cn } from "@/lib/utils"

const iconColorClasses = [
  "icon-purple",
  "icon-blue",
  "icon-emerald",
  "icon-pink",
  "icon-amber",
  "icon-cyan",
]

export default function FeaturesSection() {
  return (
    <section id="features" className="relative w-full py-24 md:py-32">
      {/* Subtle background orbs */}
      <div className="orb orb-purple -z-10 right-[10%] top-[20%] h-[400px] w-[400px] opacity-50" />
      <div className="orb orb-cyan -z-10 left-[5%] bottom-[10%] h-[300px] w-[300px] opacity-50" />

      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <SectionHeader
            badge="Features"
            title="Everything you need, nothing you don't"
            description="Simple but powerful tools to send, target, and track push notifications — built for startups."
          />
        </FadeIn>

        {/* Bento grid */}
        <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <StaggerItem
              key={feature.title}
              className={cn(i < 2 && "lg:col-span-1 md:col-span-1", i === 0 && "lg:col-span-2")}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm p-6 transition-all duration-300 hover:border-border/80 hover:bg-card/90 glow-card">
                <div className={cn("mb-4 flex size-11 items-center justify-center rounded-xl", iconColorClasses[i % iconColorClasses.length])}>
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                {/* Corner gradient on hover */}
                <div className="pointer-events-none absolute -bottom-24 -right-24 size-48 rounded-full bg-primary/5 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
                {/* Top-left subtle accent */}
                <div className="pointer-events-none absolute -left-12 -top-12 size-32 rounded-full bg-gradient-to-br from-primary/3 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
