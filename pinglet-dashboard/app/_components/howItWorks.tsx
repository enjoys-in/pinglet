"use client"

import { SectionHeader } from "./shared/section-header"
import { FadeIn } from "./shared/fade-in"
import { steps } from "./_data/how-it-works"

const stepColors = [
  { bg: "bg-gradient-to-br from-purple-500 to-violet-600", ring: "ring-purple-500/20" },
  { bg: "bg-gradient-to-br from-blue-500 to-cyan-500", ring: "ring-blue-500/20" },
  { bg: "bg-gradient-to-br from-pink-500 to-rose-500", ring: "ring-pink-500/20" },
]

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
          {/* Gradient vertical line */}
          <div className="absolute bottom-0 left-5 top-0 w-px bg-gradient-to-b from-purple-500/50 via-blue-500/50 to-pink-500/50 md:left-1/2 md:-translate-x-px" />

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

                  {/* Colorful gradient dot */}
                  <div className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full ${stepColors[i % stepColors.length].bg} text-sm font-bold text-white shadow-lg ring-4 ${stepColors[i % stepColors.length].ring} md:mx-0`}>
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
