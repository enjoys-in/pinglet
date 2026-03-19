import { Zap, BarChart3, Shield, Layers, Rocket, Headphones } from "lucide-react"
import type { LucideIcon } from "lucide-react"

export interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

export const features: Feature[] = [
  {
    title: "Smart Targeting",
    description:
      "Advanced user segmentation and behavioral targeting ensures messages reach the right people at the perfect moment.",
    icon: Zap,
  },
  {
    title: "Lightning Fast Delivery",
    description:
      "Global infrastructure delivers notifications in under 5–40ms with 99.9% uptime guarantee.",
    icon: Rocket,
  },
  {
    title: "Deep Analytics",
    description:
      "Comprehensive real-time analytics and A/B testing tools. Track opens, clicks, conversions, and lifetime value.",
    icon: BarChart3,
  },
  {
    title: "Enterprise Security",
    description:
      "End-to-end encryption and compliance features. Your data and your users' privacy are our top priority.",
    icon: Shield,
  },
  {
    title: "Custom Integration",
    description:
      "Seamlessly integrate with your existing systems. SDKs for iOS, Android, Web, and custom solutions.",
    icon: Layers,
  },
  {
    title: "24/7 Support",
    description:
      "Dedicated support team available around the clock to help you succeed with your notification strategy.",
    icon: Headphones,
  },
]
