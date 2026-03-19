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
  "Basic targeting",
  "5 Widgets",
  "REST API access",
]

export const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    monthlyPrice: "$7",
    annualPrice: "$5",
    description: "For side projects and early-stage apps.",
    features: [
      "Up to 50K notifications/month",
      "Basic analytics dashboard",
      "Standard delivery speed",
      "Email support",
      "Basic targeting",
      "Up to 50 Widgets",
      "REST API access",
    ],
    cta: "Start Now",
  },
  {
    name: "Growth",
    monthlyPrice: "$29",
    annualPrice: "$24",
    description: "For growing products with real users.",
    features: [
      "Up to 500K notifications/month",
      "Advanced analytics & insights",
      "Up to 250 Custom Widgets",
      "Custom HTML Editor",
      "Browser notifications",
      "Priority email support",
      "Webhook integration",
    ],
    cta: "Start Now",
    popular: true,
  },
  {
    name: "Scale",
    monthlyPrice: "$99",
    annualPrice: "$80",
    description: "For teams that need more power.",
    features: [
      "Unlimited notifications",
      "Custom analytics & reports",
      "Unlimited Custom Widgets",
      "Advanced API access",
      "Custom HTML templates",
      "Dedicated Slack support",
      "White-label option",
    ],
    cta: "Contact Us",
  },
]
