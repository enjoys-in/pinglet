import { Badge } from "@/components/ui/badge"

const changelog = [
  {
    version: "v1.1.0",
    date: "March 2026",
    tag: "Latest",
    sections: [
      {
        title: "Activity Tracking",
        changes: [
          "Activity page fully aligned with backend API response shapes",
          "Typed interfaces for ActivityEvent, ActivityStats, TopPage",
          "Fixed Total Events showing [object Object] — now safely sums numeric counts only",
          "Fixed avgDuration → avgSessionDuration field name",
          "Fixed Top Pages chart keys (page_url/views instead of page/count)",
          "Events response now reads { events, total } shape with proper pagination",
          "Unique Visitors label corrected to 30d",
        ],
      },
      {
        title: "Flows Engine",
        changes: [
          "Duplicate event trigger prevention — used events are disabled in preset dropdown",
          "Loop detection warning banner when same event is assigned to multiple triggers",
          "Event name input shows red border + error text for duplicate events",
          "Fixed JSON editor validation for template variables inside quotes (e.g. \"{{userId}}\")",
          "Fixed JSON editor width overflow in flow config panel",
          "Fixed Invalid Date display — supports both camelCase and snake_case date fields",
        ],
      },
      {
        title: "Widgets",
        changes: [
          "Widget configuration system with 11 fields (position, autoDismiss, autoShow, animation, etc.)",
          "Config badges displayed on widget list cards",
          "Fixed copy script URL generating undefined — now outputs proper <script> tag",
          "Widget edit mode (WidgetForm supports update via widgetId prop)",
        ],
      },
      {
        title: "Data & Sync",
        changes: [
          "IDB-first fetch with background API refresh across all CRUD operations",
          "IDB sync on create/update/delete for projects, websites, widgets, and flows",
          "Fixed non-functional project delete handler",
          "WebhookEvent enum expanded to 12 events (added queued, delivered, dismissed)",
          "Flow EVENT_PRESETS with 24 events across 6 categories + custom event support",
        ],
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "March 2026",
    tag: "",
    sections: [
      {
        title: "Flows Engine",
        changes: [
          "Visual notification flow builder with 15 node types (Event Trigger, Condition, Delay, Notification, Webhook, A/B Split, Filter, Schedule, Rate Limit, Presence Check, Transform, Email, Merge, Diverge, Note)",
          "Flows backend — entity, service, controller, routes, stats API",
          "Flows CRUD with real backend API integration (create, update, delete, toggle status)",
          "Flow stats dashboard (total flows, active, triggers, notifications)",
          "Context menu & keyboard shortcuts (Ctrl+S save, Ctrl+Z undo, Ctrl+C/V copy-paste)",
          "SmoothStep edges, transitions, CSS animations on flow canvas",
          "Flow export/import as JSON",
        ],
      },
      {
        title: "Payload Creator",
        changes: [
          "Visual payload builder for all 4 notification types",
          "JSON / cURL / fetch output tabs with copy support",
        ],
      },
      {
        title: "Tracking & Events",
        changes: [
          "Emit 'request' event to Kafka for total_request tracking",
          "Activity & session tracking integrated into SDK v0.0.3 bundle",
          "Custom Events documentation tab in docs + event fields in demo playground",
        ],
      },
    ],
  },
  {
    version: "v0.4.0",
    date: "November 2025",
    tag: "",
    sections: [
      {
        title: "SDK v0.0.3",
        changes: [
          "Custom video player, playSound fix, scoping fix",
          "Type 0 → Glassmorphism rename, Type 2 → Compat renderer",
          "Custom event button action support",
          "Tag-based notification deduplication",
          "Overrides for sound, theme, and progress bar",
          "Improved stacking & queue behavior",
        ],
      },
      {
        title: "Pages & Navigation",
        changes: [
          "Added Docs, Demo, Pricing, Changelog, Privacy, Terms extra pages",
          "Navbar active state indicator & Home link",
          "Full-fledged demo with all 4 notification types",
          "Demo playground redesign with type selector and live preview",
        ],
      },
    ],
  },
  {
    version: "v0.3.0",
    date: "October 2025",
    tag: "",
    sections: [
      {
        title: "Dashboard Features",
        changes: [
          "Activity, sessions, inbox, unsubscribe analytics pages",
          "Project settings (quiet hours, rate limiting, fallback channels)",
          "Live presence widget",
          "16 new API methods for dashboard endpoints",
          "Sidebar nav updates with all new sections",
        ],
      },
      {
        title: "Backend",
        changes: [
          "CORS split (public/protected routes)",
          "New entities & services: inbox, activity, presence, session-recording, unsubscribe-analytics, notification-guards, fallback-channel",
          "Webhook event listener & dispatch",
          "Protected routes enforcement",
        ],
      },
      {
        title: "Analytics & Dashboard",
        changes: [
          "Dashboard & analytics endpoints with subscriber enrichment",
          "Replace mock data with real API calls on dashboard & analytics",
          "Webhook endpoints return tracking stats with success_rate",
          "Webhook dispatch, tracking & notification stats",
          "Chart bucket filling & stats neutral state",
          "Settings page and error pages",
        ],
      },
      {
        title: "Bug Fixes",
        changes: [
          "Hydration errors, null safety, webhook 404, template layout fixes",
          "Project details page redesign with theme-aware colors + error state",
          "Cookies not being set in browser",
          "Smooth sidebar animation + analytics redesign with modern chart colors",
        ],
      },
    ],
  },
  {
    version: "v0.2.0",
    date: "September 2025",
    tag: "",
    sections: [
      {
        title: "Caching & Plans",
        changes: [
          "Redis caching layer with typed keys/TTLs",
          "Seed 43 default templates migration",
          "Cache all GET API endpoints with invalidation on writes",
          "Plan-based feature enforcement, quota middleware, white-label gates",
          "Plan seeding migration",
        ],
      },
      {
        title: "Dashboard Redesign",
        changes: [
          "Glassmorphism, gradients, animations across all dashboard pages",
          "Auth pages redesign matching purple theme",
          "Fresh landing page with purple theme, dot grid, bento features, vertical timeline",
          "NextTopLoader color update",
          "Notification stats computed from data + responsive layout",
        ],
      },
      {
        title: "Infrastructure",
        changes: [
          "Docker images & Dockerfile with memory optimizations",
          "Build scripts & deployment pipeline",
          "Database migrations — enum fixes, template escaping, PostgreSQL compatibility",
          "Buffer-equal-constant-time patch for Node.js v25",
          "Reset password flow fixes",
        ],
      },
    ],
  },
  {
    version: "v0.1.0",
    date: "August 2025",
    tag: "",
    sections: [
      {
        title: "Templates & Webhooks",
        changes: [
          "Custom template support in SDK npm package",
          "Webhook and template support backend",
          "Template reference error fixes",
          "Tracking event API URL fixes",
          "Dump & load templates from production DB via .sql",
        ],
      },
      {
        title: "Core Notifications",
        changes: [
          "Browser push notifications (Type -1) via service worker",
          "Kafka event stream introduced",
          "SRI checksum validation & domain whitelisting",
          "Rate limiting (30 req/min)",
          "Notification API routes for send & subscribe",
          "Service worker ready for push",
        ],
      },
      {
        title: "Initial Release",
        changes: [
          "Type 0 in-app toast notifications with SSE real-time connection",
          "Basic notification API with Zod validation",
          "Project, website, and template management UI",
          "Dashboard layout with sidebar navigation",
          "Authentication (login, signup, logout, password reset)",
          "JS SDK builder with versioning and checksum/hash",
        ],
      },
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
        <div className="space-y-14">
          {changelog.map((release) => (
            <div key={release.version} className="relative pl-8 border-l-2 border-border/50">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-bold text-foreground">{release.version}</h2>
                <span className="text-sm text-muted-foreground">{release.date}</span>
                {release.tag && (
                  <Badge variant="secondary" className="text-xs">{release.tag}</Badge>
                )}
              </div>
              <div className="space-y-4">
                {release.sections.map((section, si) => (
                  <div key={si}>
                    <h3 className="text-sm font-semibold text-foreground mb-2">{section.title}</h3>
                    <ul className="space-y-1.5">
                      {section.changes.map((change, i) => (
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
          ))}
        </div>
      </div>
    </div>
  )
}
