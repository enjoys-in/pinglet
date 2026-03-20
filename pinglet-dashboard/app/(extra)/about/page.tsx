import { Heart, Rocket, Users, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">About Pinglet</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The modern notification platform built by developers, for developers.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16 space-y-16">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Pinglet was born from the frustration of integrating push notifications into modern web apps.
            Existing solutions were either too complex, too expensive, or locked you into their ecosystem.
            We set out to build something better — a notification platform that&apos;s simple to integrate,
            powerful to use, and respects your users&apos; privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { icon: Rocket, title: "Our Mission", desc: "Make real-time notifications accessible to every developer, regardless of scale or budget." },
            { icon: Heart, title: "Built with Care", desc: "Every feature is designed with developer experience in mind. Simple APIs, clear docs, no bloat." },
            { icon: Users, title: "Community First", desc: "Open feedback, transparent roadmap, and a growing community of developers." },
            { icon: Globe, title: "Made by ENJOYS", desc: "Pinglet is built and maintained by ENJOYS, a team passionate about developer tools." },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-border/50 bg-card/80 p-6">
              <item.icon className="w-6 h-6 text-primary mb-3" />
              <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
