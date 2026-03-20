import { CheckCircle, AlertCircle, Clock } from "lucide-react"

const services = [
  { name: "API", status: "operational", uptime: "99.99%" },
  { name: "SSE Real-time", status: "operational", uptime: "99.98%" },
  { name: "Dashboard", status: "operational", uptime: "99.99%" },
  { name: "Push Service", status: "operational", uptime: "99.97%" },
  { name: "CDN / Static Assets", status: "operational", uptime: "100%" },
  { name: "Webhook Delivery", status: "operational", uptime: "99.95%" },
]

const statusIcon = (status: string) => {
  if (status === "operational") return <CheckCircle className="w-4 h-4 text-emerald-500" />
  if (status === "degraded") return <Clock className="w-4 h-4 text-amber-500" />
  return <AlertCircle className="w-4 h-4 text-red-500" />
}

export default function StatusPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-gradient-to-b from-emerald-500/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
          <div className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" /> All Systems Operational
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">System Status</h1>
          <p className="text-lg text-muted-foreground">Current status of Pinglet services.</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-xl border border-border/50 bg-card/80 divide-y divide-border/40">
          {services.map((service) => (
            <div key={service.name} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                {statusIcon(service.status)}
                <span className="text-sm font-medium text-foreground">{service.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">{service.uptime} uptime</span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full capitalize">{service.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
