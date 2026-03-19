"use client"

import { SectionHeader } from "./shared/section-header"
import { FadeIn } from "./shared/fade-in"
import { steps } from "./_data/how-it-works"

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative w-full py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <SectionHeader
            badge="How It Works"
            title="Up and running in minutes"
            description="Three simple steps to start engaging your users with targeted push notifications."
          />
        </FadeIn>

        {/* Vertical timeline */}
        <div className="relative mx-auto max-w-2xl">
          {/* Vertical line */}
          <div className="absolute bottom-0 left-5 top-0 w-px bg-border md:left-1/2 md:-translate-x-px" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <FadeIn key={step.step} delay={i * 0.1}>
                <div className="relative flex items-start gap-6 md:gap-12">
                  {/* Left text (desktop) / hidden on mobile */}
                  <div className="hidden flex-1 text-right md:block">
                    {i % 2 === 0 ? (
                      <>
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                      </>
                    ) : (
                      <div />
                    )}
                  </div>

                  {/* Dot */}
                  <div className="relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary md:mx-0">
                    {step.step}
                  </div>

                  {/* Right text (desktop) / all text on mobile */}
                  <div className="flex-1">
                    {/* Desktop: only show for odd index */}
                    <div className="hidden md:block">
                      {i % 2 !== 0 ? (
                        <>
                          <h3 className="text-lg font-semibold">{step.title}</h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                        </>
                      ) : (
                        <div />
                      )}
                    </div>
                    {/* Mobile: always show */}
                    <div className="md:hidden">
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
