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
      "Segment users by behavior, location, or custom attributes. Send the right message to the right person at the right time.",
    icon: Zap,
  },
  {
    title: "Lightning Fast Delivery",
    description:
      "Optimized infrastructure delivers notifications in under 40ms. Built for speed from day one.",
    icon: Rocket,
  },
  {
    title: "Real-time Analytics",
    description:
      "Track opens, clicks, and engagement in real-time. Understand what's working and iterate fast.",
    icon: BarChart3,
  },
  {
    title: "Secure by Default",
    description:
      "HTTPS everywhere, encrypted storage, and privacy-first design. Your users' data stays safe.",
    icon: Shield,
  },
  {
    title: "Easy Integration",
    description:
      "Drop-in JavaScript SDK and REST API. Get push notifications working in your web app in under 5 minutes.",
    icon: Layers,
  },
  {
    title: "Developer Support",
    description:
      "Responsive email support, detailed docs, and an active community. We're here when you need help.",
    icon: Headphones,
  },
]
