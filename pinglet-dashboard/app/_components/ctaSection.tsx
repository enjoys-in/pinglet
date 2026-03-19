"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeIn } from "./shared/fade-in"

export default function CTASection() {
  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_70%_30%,hsl(0_0%_100%/0.08),transparent_50%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_80%,hsl(0_0%_100%/0.06),transparent_50%)]" />

      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to boost your engagement?
            </h2>
            <p className="mx-auto mt-5 max-w-lg text-base text-white/70 sm:text-lg leading-relaxed">
              Join thousands of developers who trust Pinglet to deliver
              notifications that matter. Start free today.
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/auth/login">
                <Button
                  size="lg"
                  className="h-12 rounded-xl bg-white px-8 text-sm font-semibold text-primary shadow-lg hover:bg-white/90"
                >
                  Start for Free
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-xl border-white/25 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/10"
                >
                  Live Demo
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
