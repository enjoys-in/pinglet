"use client"

import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "./shared/section-header"
import { FadeIn, StaggerContainer, StaggerItem } from "./shared/fade-in"
import { features } from "./_data/features"

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <SectionHeader
            badge="Features"
            title="Everything you need to engage users"
            description="Powerful tools to craft, target, and optimize your notification strategy — all in one platform."
          />
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <StaggerItem key={feature.title}>
              <Card
                className={`group relative h-full overflow-hidden border-border/50 bg-card transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20 ${
                  i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-all group-hover:bg-primary/15 group-hover:ring-primary/30">
                    <feature.icon className="size-5" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
                {/* Subtle hover gradient */}
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br from-primary/[0.02] to-transparent" />
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
