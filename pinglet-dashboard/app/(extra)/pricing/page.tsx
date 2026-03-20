"use client"

import { useState, useCallback } from "react"
import { Check, Infinity, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { pricingPlans, freePlanFeatures } from "@/app/_components/_data/pricing"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const toMonthly = useCallback(() => setIsAnnual(false), [])
  const toAnnual = useCallback(() => setIsAnnual(true), [])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free. Upgrade when you&apos;re ready. No hidden fees, ever.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Free plan callout */}
        <div className="mx-auto mb-12 max-w-2xl">
          <div className="flex items-center justify-between rounded-2xl border border-border/40 bg-card/70 backdrop-blur-sm p-6">
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
                <Infinity className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-base font-semibold">Free Forever</p>
                <p className="text-sm text-muted-foreground">No credit card required</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">$0</p>
              <p className="text-xs text-muted-foreground">/month</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
            {freePlanFeatures.slice(0, 4).map((f) => (
              <span key={f} className="flex items-center gap-1.5">
                <Check className="size-3 text-emerald-500" /> {f}
              </span>
            ))}
          </div>
        </div>

        {/* Toggle */}
        <div className="mb-10 flex justify-center">
          <div className="inline-flex items-center rounded-full border border-border/50 bg-card/70 backdrop-blur-sm p-1 shadow-sm">
            <button
              onClick={toMonthly}
              className={cn(
                "rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                !isAnnual
                  ? "bg-gradient-to-r from-primary to-purple-500 text-white shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly
            </button>
            <button
              onClick={toAnnual}
              className={cn(
                "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-all duration-300",
                isAnnual
                  ? "bg-gradient-to-r from-primary to-purple-500 text-white shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Annual
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-500">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="mx-auto grid max-w-5xl gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300",
                plan.popular
                  ? "border-primary/50 bg-card shadow-xl shadow-primary/5"
                  : "border-border/40 bg-card/70 backdrop-blur-sm hover:border-border/60"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-purple-500 px-3 py-0.5 text-xs font-medium text-white shadow-sm">
                  <Sparkles className="size-3" />
                  Popular
                </span>
              )}

              <p className="text-base font-semibold">{plan.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className={cn("text-4xl font-bold tracking-tight", plan.popular && "bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent")}>
                  {isAnnual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>

              <ul className="my-6 flex-grow space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={cn("mt-0.5 size-4 shrink-0", plan.popular ? "text-primary" : "text-emerald-500")} />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Link href="/auth/login">
                <Button
                  className={cn(
                    "mt-auto w-full rounded-full font-medium transition-all duration-300",
                    plan.popular && "bg-gradient-to-r from-primary to-purple-500 hover:shadow-lg hover:shadow-primary/25 border-0"
                  )}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
