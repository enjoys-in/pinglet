import { BookOpen, ArrowRight, Code2, Zap, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const guides = [
  {
    title: "Getting Started with Pinglet",
    description: "Set up your first project and send your first notification in under 2 minutes.",
    icon: Zap,
    href: "/docs",
    tag: "Beginner",
  },
  {
    title: "Custom Events Deep Dive",
    description: "Learn how to trigger frontend actions from notification button clicks.",
    icon: Code2,
    href: "/docs",
    tag: "Intermediate",
  },
  {
    title: "Advanced Overrides & Theming",
    description: "Customize every aspect of your notifications — position, sound, branding, and more.",
    icon: Layers,
    href: "/docs",
    tag: "Advanced",
  },
  {
    title: "Browser Push with Service Workers",
    description: "Set up native OS push notifications that work even when the browser is closed.",
    icon: BookOpen,
    href: "/docs",
    tag: "Intermediate",
  },
]

export default function GuidesPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Guides</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Step-by-step tutorials to help you make the most of Pinglet.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-4">
          {guides.map((guide) => (
            <Link key={guide.title} href={guide.href} className="block group">
              <div className="rounded-xl border border-border/50 bg-card/80 p-6 flex items-start gap-4 hover:shadow-md transition-all hover:border-primary/30">
                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                  <guide.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{guide.title}</h3>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">{guide.tag}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{guide.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/docs">
            <Button variant="outline" className="rounded-full gap-2">
              <BookOpen className="w-3.5 h-3.5" /> Full Documentation
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
