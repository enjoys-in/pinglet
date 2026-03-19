"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeIn } from "./shared/fade-in"

export default function CTASection() {
  return (
    <section className="w-full py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-12 text-center sm:p-16 lg:p-20">
            {/* Dot grid background */}
            <div className="dot-grid pointer-events-none absolute inset-0 -z-10 opacity-50" />
            {/* Radial glow */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08),transparent_60%)]" />

            <h2 className="mx-auto max-w-lg text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to boost your engagement?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Join thousands of developers who trust Pinglet to deliver
              notifications that matter.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/auth/login">
                <Button size="lg" className="h-11 rounded-full px-8 text-sm font-medium shadow-lg shadow-primary/20">
                  Start building free
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="h-11 rounded-full px-8 text-sm font-medium">
                  Talk to sales
                </Button>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
