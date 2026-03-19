"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from "recharts"
import { Bell, Users, Globe, TrendingUp, TrendingDown, Calendar, MapPin, Monitor, Clock, ArrowUpRight, ArrowDownRight, Activity, FolderOpen } from "lucide-react"

// Gradient color sets for stat cards
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

// Mock data
const statsData = [
  {
    title: "Total Requests",
    value: "345",
    change: "+2%",
    trend: "up",
    icon: Activity,
  },
  {
    title: "Notifications Sent",
    value: "12,345",
    change: "+12%",
    trend: "up",
    icon: Bell,
  },
  {
    title: "Click Rate",
    value: "8.2%",
    change: "+2.1%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Drop Rate",
    value: "3.1%",
    change: "-0.5%",
    trend: "down",
    icon: TrendingDown,
  },
  {
    title: "Closed",
    value: "4",
    change: "0%",
    trend: "down",
    icon: Bell,
  },
  {
    title: "Failed",
    value: "234",
    change: "-15%",
    trend: "down",
    icon: Bell,
  },
  {
    title: "Total Websites",
    value: "8",
    change: "+2",
    trend: "up",
    icon: Globe,
  },
  {
    title: "Total Projects",
    value: "15",
    change: "+3",
    trend: "up",
    icon: FolderOpen,
  },
  {
    title: "Subscribed Users",
    value: "2,847",
    change: "+156",
    trend: "up",
    icon: Users,
  },
]

const subscribersData = [
  {
    id: "SUB001",
    deviceType: "Mobile",
    notificationsSent: 45,
    createdOn: "2024-01-15",
    updatedOn: "2024-01-20",
    country: "US",
    browser: "Chrome",
    subscribedTime: "14:30",
  },
  {
    id: "SUB002",
    deviceType: "Desktop",
    notificationsSent: 32,
    createdOn: "2024-01-14",
    updatedOn: "2024-01-19",
    country: "UK",
    browser: "Firefox",
    subscribedTime: "09:15",
  },
  {
    id: "SUB003",
    deviceType: "Tablet",
    notificationsSent: 28,
    createdOn: "2024-01-13",
    updatedOn: "2024-01-18",
    country: "CA",
    browser: "Safari",
    subscribedTime: "16:45",
  },
]

const notificationChartData = [
  { name: "Mon", sent: 120, failed: 8 },
  { name: "Tue", sent: 150, failed: 12 },
  { name: "Wed", sent: 180, failed: 6 },
  { name: "Thu", sent: 200, failed: 15 },
  { name: "Fri", sent: 170, failed: 9 },
  { name: "Sat", sent: 90, failed: 4 },
  { name: "Sun", sent: 110, failed: 7 },
]

const rateChartData = [
  { name: "Mon", clickRate: 8.2, dropRate: 3.1 },
  { name: "Tue", clickRate: 7.8, dropRate: 3.5 },
  { name: "Wed", clickRate: 9.1, dropRate: 2.8 },
  { name: "Thu", clickRate: 8.7, dropRate: 3.2 },
  { name: "Fri", clickRate: 8.9, dropRate: 2.9 },
  { name: "Sat", clickRate: 7.5, dropRate: 3.8 },
  { name: "Sun", clickRate: 8.3, dropRate: 3.0 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your notification analytics and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 stagger-children">
        {statsData.map((stat, index) => (
          <Card key={index} className={`glass-card card-shadow hover-lift overflow-hidden bg-gradient-to-br ${cardGradients[index % cardGradients.length]} border-border/40`}>
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
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={notificationChartData}>
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
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={rateChartData}>
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
            <Badge variant="secondary" className="text-xs">{subscribersData.length} subscribers</Badge>
          </div>
        </CardHeader>
        <CardContent>
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
              {subscribersData.map((subscriber) => (
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
        </CardContent>
      </Card>
    </div>
  )
}
