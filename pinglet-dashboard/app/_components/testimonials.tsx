"use client"

import { Star } from "lucide-react"
import { SectionHeader } from "./shared/section-header"
import { FadeIn, StaggerContainer, StaggerItem } from "./shared/fade-in"
import { testimonials } from "./_data/testimonials"

const avatarGradients = [
  "from-purple-500 to-violet-600",
  "from-blue-500 to-cyan-500",
  "from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
  "from-indigo-500 to-purple-500",
]

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative w-full bg-muted/30 py-24 md:py-32 overflow-hidden">
      {/* Background orbs */}
      <div className="orb orb-blue -z-10 left-[5%] top-[20%] h-[350px] w-[350px] opacity-40" />
      <div className="orb orb-pink -z-10 right-[10%] bottom-[15%] h-[300px] w-[300px] opacity-40" />

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
          {testimonials.map((t, i) => (
            <StaggerItem key={t.author} className="break-inside-avoid">
              <div className="rounded-2xl border border-border/40 bg-card/70 backdrop-blur-sm p-6 transition-all duration-300 hover:border-border/70 glow-card">
                {/* Star ratings */}
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="size-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className={`flex size-9 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradients[i % avatarGradients.length]} text-xs font-bold text-white shadow-sm`}>
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
