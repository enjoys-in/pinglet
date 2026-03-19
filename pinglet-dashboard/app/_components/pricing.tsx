"use client"

import { useState, useCallback } from "react"
import { Check, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "./shared/section-header"
import { FadeIn } from "./shared/fade-in"
import { pricingPlans, freePlanFeatures } from "./_data/pricing"
import { cn } from "@/lib/utils"

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)
  const toMonthly = useCallback(() => setIsAnnual(false), [])
  const toAnnual = useCallback(() => setIsAnnual(true), [])

  return (
    <section id="pricing" className="relative w-full overflow-hidden bg-muted/40 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.04),transparent_50%)]" />

      <div className="mx-auto max-w-7xl px-6">
        <FadeIn>
          <SectionHeader
            badge="Pricing"
            title="Simple, transparent pricing"
            description="Start free. Upgrade when you're ready. No hidden fees, ever."
          />
        </FadeIn>

        {/* Free plan */}
        <FadeIn className="mx-auto mb-14 max-w-3xl">
          <Card className="overflow-hidden border-primary/20">
            <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-between sm:p-8">
              <div className="text-center sm:text-left">
                <div className="mb-1.5 flex items-center justify-center gap-2 sm:justify-start">
                  <Sparkles className="size-4 text-primary" />
                  <h3 className="text-lg font-bold">Free Forever</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Everything you need to get started — no credit card required.
                </p>
              </div>
              <div className="flex items-baseline gap-1 shrink-0">
                <span className="text-4xl font-extrabold">$0</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
            </CardContent>
          </Card>
          <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-xs text-muted-foreground">
            {freePlanFeatures.slice(0, 5).map((f) => (
              <span key={f} className="flex items-center gap-1.5">
                <Check className="size-3 text-primary" /> {f}
              </span>
            ))}
          </div>
        </FadeIn>

        {/* Billing toggle */}
        <FadeIn className="mb-10 flex justify-center">
          <div className="inline-flex items-center rounded-xl bg-muted p-1 ring-1 ring-border/50">
            <button
              onClick={toMonthly}
              className={cn(
                "rounded-lg px-5 py-2 text-sm font-medium transition-all",
                !isAnnual
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={toAnnual}
              className={cn(
                "flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium transition-all",
                isAnnual
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annual
              <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[10px] font-semibold">
                -20%
              </Badge>
            </button>
          </div>
        </FadeIn>

        {/* Plan cards */}
        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1}>
              <Card
                className={cn(
                  "relative h-full transition-all duration-300",
                  plan.popular
                    ? "border-primary/60 shadow-xl shadow-primary/[0.08] dark:shadow-primary/[0.15] lg:scale-[1.03]"
                    : "border-border/50 hover:border-border hover:shadow-lg hover:shadow-black/[0.03] dark:hover:shadow-black/20"
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="rounded-full px-3 py-0.5 text-xs font-semibold shadow-sm">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="flex h-full flex-col p-6">
                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                  <div className="mt-5 flex items-baseline">
                    <span className="text-4xl font-extrabold">
                      {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="ml-1.5 text-sm text-muted-foreground">/month</span>
                  </div>
                  <ul className="my-6 flex-grow space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={cn(
                      "mt-auto w-full rounded-lg font-medium",
                      plan.popular && "shadow-sm shadow-primary/25"
                    )}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
