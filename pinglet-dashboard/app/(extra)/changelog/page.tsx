import { Badge } from "@/components/ui/badge"

const changelog = [
  {
    version: "v0.0.3",
    date: "June 2025",
    tag: "Latest",
    changes: [
      "Added Type 2 Glassmorphism HTML notifications",
      "Custom event button action support",
      "Tag-based notification deduplication",
      "Overrides for sound, theme, and progress bar",
      "Improved stacking & queue behavior",
    ],
  },
  {
    version: "v0.0.2",
    date: "May 2025",
    tag: "",
    changes: [
      "Browser push notifications (Type -1) via service worker",
      "SRI checksum validation",
      "Domain whitelisting security",
      "Rate limiting (30 req/min)",
    ],
  },
  {
    version: "v0.0.1",
    date: "April 2025",
    tag: "",
    changes: [
      "Initial release with Type 0 in-app toast notifications",
      "SSE real-time connection",
      "Basic notification API with Zod validation",
      "Dashboard for project management",
    ],
  },
]

export default function ChangelogPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Changelog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What&apos;s new in Pinglet. All the latest updates and improvements.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-12">
          {changelog.map((release) => (
            <div key={release.version} className="relative pl-8 border-l-2 border-border/50">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xl font-bold text-foreground">{release.version}</h2>
                <span className="text-sm text-muted-foreground">{release.date}</span>
                {release.tag && (
                  <Badge variant="secondary" className="text-xs">{release.tag}</Badge>
                )}
              </div>
              <ul className="space-y-2">
                {release.changes.map((change, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-1.5 shrink-0">•</span>
                    {change}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
