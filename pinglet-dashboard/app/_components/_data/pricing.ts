export interface PricingPlan {
  name: string
  monthlyPrice: string
  annualPrice: string
  description: string
  features: string[]
  cta: string
  popular?: boolean
}

export const freePlanFeatures = [
  "Up to 10K notifications/month",
  "Basic analytics dashboard",
  "Standard delivery speed",
  "Email support",
  "Basic targeting options",
  "10 Widgets",
  "Limited integrations",
]

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    monthlyPrice: "$7",
    annualPrice: "$5.6",
    description: "Perfect for small teams and startups.",
    features: [
      "Up to 50–100K notifications/month",
      "Basic analytics dashboard",
      "Standard delivery speed",
      "Email support",
      "Basic targeting options",
      "100 Widgets",
      "Limited integrations",
    ],
    cta: "Start Now",
  },
  {
    name: "Professional",
    monthlyPrice: "$29",
    annualPrice: "$24",
    description: "Ideal for growing businesses.",
    features: [
      "Up to 500K notifications/month",
      "Advanced analytics & A/B testing",
      "Up to 250 Custom Widgets",
      "Limited Custom HTML Editor",
      "Browser notifications",
      "Priority email support",
      "Limited Webhooks",
    ],
    cta: "Start Now",
    popular: true,
  },
  {
    name: "Enterprise",
    monthlyPrice: "$99",
    annualPrice: "$80",
    description: "For large organizations with complex needs.",
    features: [
      "Unlimited notifications",
      "Custom analytics",
      "AI-powered optimization",
      "24/7 phone & email support",
      "Advanced API access",
      "Unlimited Custom Widgets",
      "White-label solution",
      "Webhook integration",
      "Custom HTML templates",
    ],
    cta: "Contact Sales",
  },
]
