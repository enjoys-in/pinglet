import { Plug, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const integrations = [
  { name: "React", description: "Drop-in hooks and components for React apps", icon: "⚛️" },
  { name: "Next.js", description: "Server and client-side integration for Next.js", icon: "▲" },
  { name: "Vue", description: "Vue composables and plugin support", icon: "💚" },
  { name: "Angular", description: "Angular service and directive integration", icon: "🅰️" },
  { name: "WordPress", description: "One-click plugin for WordPress sites", icon: "📝" },
  { name: "Shopify", description: "Shopify app for e-commerce notifications", icon: "🛍️" },
  { name: "Slack", description: "Forward notifications to Slack channels", icon: "💬" },
  { name: "Webhooks", description: "Send events to any HTTP endpoint", icon: "🔗" },
  { name: "Zapier", description: "Connect Pinglet to 5000+ apps via Zapier", icon: "⚡" },
]

export default function IntegrationsPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
          <div className="flex items-center justify-center gap-2 text-primary mb-4">
            <Plug className="w-5 h-5" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Integrations</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect Pinglet with your favorite tools and frameworks.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {integrations.map((item) => (
            <div key={item.name} className="rounded-xl border border-border/50 bg-card/80 p-5 hover:shadow-md transition-shadow">
              <span className="text-2xl mb-3 block">{item.icon}</span>
              <h3 className="text-sm font-semibold text-foreground mb-1">{item.name}</h3>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center rounded-2xl border border-border/50 bg-card/80 p-10">
          <h2 className="text-xl font-bold text-foreground mb-2">Need a custom integration?</h2>
          <p className="text-muted-foreground mb-6">Our API makes it easy to integrate with any platform.</p>
          <div className="flex justify-center gap-3">
            <Link href="/docs"><Button className="rounded-full gap-2">View API Docs <ArrowRight className="w-3.5 h-3.5" /></Button></Link>
            <Link href="/contact"><Button variant="outline" className="rounded-full">Contact Us</Button></Link>
          </div>
        </div>
      </div>
    </div>
  )
}
