"use client"

import { Quote, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { SectionHeader } from "./shared/section-header"
import { FadeIn, StaggerContainer, StaggerItem } from "./shared/fade-in"
import { testimonials } from "./_data/testimonials"

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="w-full py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <SectionHeader
            badge="Testimonials"
            title="Loved by developers worldwide"
            description="See what teams are saying about Pinglet's notification platform."
          />
        </FadeIn>

        <StaggerContainer className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <StaggerItem key={t.author}>
              <Card className="group h-full border-border/50 transition-all duration-300 hover:border-border hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20">
                <CardContent className="flex h-full flex-col p-6">
                  <Quote className="mb-4 size-5 text-primary/40" />
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: t.rating }, (_, j) => (
                      <Star key={j} className="size-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="flex-grow text-sm leading-relaxed text-foreground/90">
                    {t.quote}
                  </p>
                  <div className="mt-5 flex items-center gap-3 border-t border-border/40 pt-4">
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {t.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-tight">{t.author}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
