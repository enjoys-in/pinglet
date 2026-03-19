"use client"

import { SectionHeader } from "./shared/section-header"
import { FadeIn, StaggerContainer, StaggerItem } from "./shared/fade-in"
import { testimonials } from "./_data/testimonials"

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full bg-muted/30 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <SectionHeader
            badge="Testimonials"
            title="Loved by developers worldwide"
            description="See what teams are saying about Pinglet's notification platform."
          />
        </FadeIn>

        {/* Masonry-like staggered grid */}
        <StaggerContainer className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.author} className="break-inside-avoid">
              <div className="rounded-2xl border border-border/50 bg-card p-6 transition-colors duration-300 hover:border-border">
                <p className="text-sm leading-relaxed text-foreground/80">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-semibold text-primary">
                    {t.author.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-tight">{t.author}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
