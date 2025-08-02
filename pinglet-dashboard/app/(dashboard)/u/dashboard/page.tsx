"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Bell, Users, Globe, TrendingUp, TrendingDown, Calendar, Edit, MapPin, Monitor, Clock } from "lucide-react"

// Mock data
const statsData = [
  {
    title: "Total Notifications Sent",
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
    title: "Failed Notifications",
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
    icon: Calendar,
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your notification analytics and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Notification Analytics</CardTitle>
                <CardDescription>Sent vs Failed notifications</CardDescription>
              </div>
              <Select defaultValue="weekly">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={notificationChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sent" fill="#3b82f6" name="Sent" />
                <Bar dataKey="failed" fill="#ef4444" name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Performance Rates</CardTitle>
                <CardDescription>Click rate vs Drop rate percentage</CardDescription>
              </div>
              <Select defaultValue="weekly">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rateChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="clickRate" stroke="#10b981" name="Click Rate %" />
                <Line type="monotone" dataKey="dropRate" stroke="#f59e0b" name="Drop Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subscribers</CardTitle>
          <CardDescription>Manage your notification subscribers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subscriber ID</TableHead>
                <TableHead>Device Type</TableHead>
                <TableHead>Notifications Sent</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribersData.map((subscriber) => (
                <TableRow key={subscriber.id}>
                  <TableCell className="font-medium">{subscriber.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      <Badge variant="outline">{subscriber.deviceType}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>{subscriber.notificationsSent}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" title={`Created: ${subscriber.createdOn}`}>
                        <Calendar className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title={`Updated: ${subscriber.updatedOn}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title={`Country: ${subscriber.country}`}>
                        <MapPin className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title={`Browser: ${subscriber.browser}`}>
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title={`Subscribed: ${subscriber.subscribedTime}`}>
                        <Clock className="h-4 w-4" />
                      </Button>
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
