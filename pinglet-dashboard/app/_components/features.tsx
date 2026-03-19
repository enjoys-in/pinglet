"use client"

import { SectionHeader } from "./shared/section-header"
import { FadeIn, StaggerContainer, StaggerItem } from "./shared/fade-in"
import { features } from "./_data/features"
import { cn } from "@/lib/utils"

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <SectionHeader
            badge="Features"
            title="Everything you need to engage users"
            description="Powerful tools to craft, target, and optimize your notification strategy — all in one platform."
          />
        </FadeIn>

        {/* Bento grid: first row 2 cols wide, rest in 3 cols */}
        <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <StaggerItem
              key={feature.title}
              className={cn(i < 2 && "lg:col-span-1 md:col-span-1", i === 0 && "lg:col-span-2")}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border/50 bg-card p-6 transition-colors duration-300 hover:border-border hover:bg-accent/50">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </div>
                <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
                {/* Corner gradient on hover */}
                <div className="pointer-events-none absolute -bottom-24 -right-24 size-48 rounded-full bg-primary/5 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
