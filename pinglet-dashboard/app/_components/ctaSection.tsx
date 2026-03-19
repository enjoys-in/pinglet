"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FadeIn } from "./shared/fade-in"

export default function CTASection() {
  return (
    <section className="w-full py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl border border-border/40 bg-card/80 backdrop-blur-sm p-12 text-center sm:p-16 lg:p-20">
            {/* Animated background orbs */}
            <div className="orb orb-purple -z-10 left-[10%] top-[10%] h-[250px] w-[250px]" />
            <div className="orb orb-blue -z-10 right-[10%] bottom-[10%] h-[200px] w-[200px]" />
            <div className="orb orb-pink -z-10 left-[50%] top-[50%] h-[180px] w-[180px] -translate-x-1/2 -translate-y-1/2" />
            {/* Dot grid background */}
            <div className="dot-grid pointer-events-none absolute inset-0 -z-10 opacity-40" />

            <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="size-3" />
              Get started today
            </span>

            <h2 className="mx-auto max-w-lg text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to <span className="gradient-text-animated">boost your engagement</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              Join hundreds of early adopters building better notification
              experiences with Pinglet.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link href="/auth/login">
                <Button size="lg" className="h-12 rounded-full px-8 text-sm font-medium shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-purple-500 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300">
                  Start building free
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="h-12 rounded-full px-8 text-sm font-medium border-border/60 hover:bg-muted/60 transition-all duration-300">
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
