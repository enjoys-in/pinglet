"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts"
import { Bell, Users, Globe, TrendingUp, TrendingDown, MapPin, Monitor, Clock, ArrowUpRight, ArrowDownRight, Activity, FolderOpen } from "lucide-react"
import { type LucideIcon } from "lucide-react"

const cardGradients = [
  "from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20",
  "from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20",
  "from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20",
  "from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20",
  "from-rose-500/10 to-pink-500/10 dark:from-rose-500/20 dark:to-pink-500/20",
  "from-red-500/10 to-rose-500/10 dark:from-red-500/20 dark:to-rose-500/20",
  "from-indigo-500/10 to-blue-500/10 dark:from-indigo-500/20 dark:to-blue-500/20",
  "from-teal-500/10 to-emerald-500/10 dark:from-teal-500/20 dark:to-emerald-500/20",
  "from-purple-500/10 to-fuchsia-500/10 dark:from-purple-500/20 dark:to-fuchsia-500/20",
]

const iconColors = [
  "text-violet-500",
  "text-blue-500",
  "text-emerald-500",
  "text-amber-500",
  "text-rose-500",
  "text-red-500",
  "text-indigo-500",
  "text-teal-500",
  "text-purple-500",
]

interface StatConfig {
  key: string
  title: string
  icon: LucideIcon
  format?: (v: number) => string
}

const statConfigs: StatConfig[] = [
  { key: "total_requests", title: "Total Requests", icon: Activity },
  { key: "notifications_sent", title: "Notifications Sent", icon: Bell, format: (v) => v.toLocaleString() },
  { key: "click_rate", title: "Click Rate", icon: TrendingUp, format: (v) => v + "%" },
  { key: "drop_rate", title: "Drop Rate", icon: TrendingDown, format: (v) => v + "%" },
  { key: "closed", title: "Closed", icon: Bell },
  { key: "failed", title: "Failed", icon: Bell },
  { key: "total_websites", title: "Total Websites", icon: Globe },
  { key: "total_projects", title: "Total Projects", icon: FolderOpen },
  { key: "subscribed_users", title: "Subscribed Users", icon: Users, format: (v) => v.toLocaleString() },
]

interface DashboardData {
  stats: Record<string, any> | null
  notificationChart: Array<{ name: string; sent: number; failed: number }>
  ratesChart: Array<{ name: string; clickRate: number; dropRate: number }>
  subscribers: Array<{
    id: string
    deviceType: string
    notificationsSent: number
    createdOn: string
    country: string
    browser: string
  }>
}

export default function DashboardClient({ initialData }: { initialData: DashboardData }) {
  const { stats, notificationChart, ratesChart, subscribers } = initialData

  const statsData = statConfigs.map((cfg) => {
    const value = stats?.[cfg.key] ?? 0
    const change = stats?.[cfg.key + "_change"] ?? "0%"
    const trend = typeof change === "string" && change.startsWith("-") ? "down" : "up"
    return {
      ...cfg,
      value: cfg.format ? cfg.format(value) : String(value),
      change,
      trend,
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your notification analytics and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 stagger-children">
        {statsData.map((stat, index) => (
          <Card key={stat.key} className={`glass-card card-shadow hover-lift overflow-hidden bg-gradient-to-br ${cardGradients[index % cardGradients.length]} border-border/40`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
              <CardTitle className="text-xs font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-1.5 rounded-md bg-background/60 ${iconColors[index % iconColors.length]}`}>
                <stat.icon className="h-3.5 w-3.5" />
              </div>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="text-xl font-bold tracking-tight">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {stat.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-rose-500" />
                )}
                <span className={`text-xs font-medium ${stat.trend === "up" ? "text-emerald-500" : "text-rose-500"}`}>
                  {stat.change}
                </span>
                <span className="text-[10px] text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Notifications Chart */}
        <Card className="glass-card card-shadow border-border/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Notifications Overview</CardTitle>
                <CardDescription className="text-xs">Sent vs failed this week</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-normal">Weekly</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {notificationChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={notificationChart}>
                  <defs>
                    <linearGradient id="sentGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Area type="monotone" dataKey="sent" stroke="hsl(262, 83%, 58%)" strokeWidth={2} fill="url(#sentGradient)" />
                  <Area type="monotone" dataKey="failed" stroke="hsl(0, 84%, 60%)" strokeWidth={2} fill="url(#failedGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">No data available</div>
            )}
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground">Sent</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                <span className="text-xs text-muted-foreground">Failed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate Chart */}
        <Card className="glass-card card-shadow border-border/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Click & Drop Rate</CardTitle>
                <CardDescription className="text-xs">Performance trends this week</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs font-normal">Weekly</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {ratesChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={ratesChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "12px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Line type="monotone" dataKey="clickRate" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ fill: "hsl(142, 71%, 45%)", r: 3 }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="dropRate" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={{ fill: "hsl(38, 92%, 50%)", r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">No data available</div>
            )}
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-muted-foreground">Click Rate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-xs text-muted-foreground">Drop Rate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers Table */}
      <Card className="glass-card card-shadow border-border/40">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Recent Subscribers</CardTitle>
              <CardDescription className="text-xs">Manage your notification subscribers</CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">{subscribers.length} subscribers</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {subscribers.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-border/40">
                  <TableHead className="text-xs font-medium">Subscriber ID</TableHead>
                  <TableHead className="text-xs font-medium">Device</TableHead>
                  <TableHead className="text-xs font-medium">Country</TableHead>
                  <TableHead className="text-xs font-medium">Browser</TableHead>
                  <TableHead className="text-xs font-medium text-right">Notifications</TableHead>
                  <TableHead className="text-xs font-medium">Subscribed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id} className="border-border/30 hover:bg-muted/40 transition-colors">
                    <TableCell className="font-mono text-xs font-medium text-primary">{subscriber.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
                        <Badge variant="outline" className="text-[10px] font-normal">{subscriber.deviceType}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs">{subscriber.country}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">{subscriber.browser}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary" className="text-[10px] font-medium">{subscriber.notificationsSent}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{subscriber.createdOn}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center text-sm text-muted-foreground">No subscribers yet</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
