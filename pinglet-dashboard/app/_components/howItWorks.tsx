"use client"

import { SectionHeader } from "./shared/section-header"
import { FadeIn } from "./shared/fade-in"
import { steps } from "./_data/how-it-works"

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative w-full overflow-hidden bg-muted/40 py-24 md:py-32">
      {/* Subtle radial background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.04),transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <SectionHeader
            badge="How It Works"
            title="Up and running in minutes"
            description="Three simple steps to start engaging your users with targeted push notifications."
          />
        </FadeIn>

        <div className="relative mx-auto max-w-4xl">
          {/* Connector line (desktop) */}
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />

          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {steps.map((step, i) => (
              <FadeIn
                key={step.step}
                delay={i * 0.12}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number */}
                <div className="relative z-10 mb-6 flex size-20 items-center justify-center rounded-2xl bg-card shadow-lg shadow-black/[0.04] ring-1 ring-border dark:shadow-black/20">
                  <span className="bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-2xl font-bold text-transparent">
                    {step.step}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
