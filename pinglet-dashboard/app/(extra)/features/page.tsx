import { Bell, Zap, Shield, Palette, Code2, Globe, BarChart3, Layers, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const features = [
  {
    icon: Bell,
    title: "4 Notification Types",
    description: "Browser push, in-app toast, glassmorphism cards, and custom HTML templates — one API for all.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Zap,
    title: "Real-time SSE Delivery",
    description: "Instant delivery via Server-Sent Events. No polling, no WebSockets setup. Just works.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Palette,
    title: "Fully Customizable",
    description: "Override position, theme, sounds, branding, progress bars, animations, and more per notification.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Code2,
    title: "Simple Integration",
    description: "Two script tags and you're live. No npm packages, no build steps, no framework lock-in.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "SRI checksums, domain validation, project-scoped tokens, and Zod payload validation.",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Globe,
    title: "Multi-Website Support",
    description: "Manage multiple websites under one project. Each with its own domain and configuration.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: BarChart3,
    title: "Analytics & Insights",
    description: "Track delivery rates, click-through rates, engagement metrics, and subscriber growth.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Layers,
    title: "Custom Events",
    description: "Trigger frontend JavaScript events from notification button clicks. Add to cart, open modal, navigate — anything.",
    color: "from-violet-500 to-purple-500",
  },
]

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Features</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to deliver beautiful, real-time notifications to your users.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div key={feature.title} className="group rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} shadow-md mb-4`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-6">Ready to get started?</p>
          <div className="flex justify-center gap-3">
            <Link href="/auth/login">
              <Button className="rounded-full gap-2">Get Started Free <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" className="rounded-full">Read the Docs</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
