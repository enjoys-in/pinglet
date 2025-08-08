"use client"

import { useLayoutEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Bell,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,

} from "lucide-react"
import Link from "next/link"

import { API } from "@/lib/api/handler"
import { GetAllNotificationsResponse } from "@/lib/interfaces/notifications.interface"


const getStatusBadge = (status: string) => {
  switch (status) {
    case "sent":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Sent
        </Badge>
      )
    case "scheduled":
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
          <Clock className="w-3 h-3 mr-1" />
          Scheduled
        </Badge>
      )
    case "failed":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      )
    case "draft":
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          <AlertCircle className="w-3 h-3 mr-1" />
          Draft
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}
type N = "all" | "sent" | "request" | "scheduled" | "failed" | "draft" | "dropped" | "closed" | "clicked"
export default function NotificationsPage() {

  const [notifications, setNotifications] = useState<GetAllNotificationsResponse[]>([])
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch =
      notification.project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.project.website.domain.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all"
    return matchesSearch && matchesStatus
  })
  const fetchAllNotifications = async () => {
    try {
      const { data } = await API.getMyNotifications()
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch notifications")

      }
      setNotifications(data.result)

    } catch (error) {
      console.error("Error fetching notifications:", error)
      return []
    }
  }
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedNotifications(filteredNotifications.map((n) => n.id))
    } else {
      setSelectedNotifications([])
    }
  }

  const handleSelectNotification = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedNotifications([...selectedNotifications, id])
    } else {
      setSelectedNotifications(selectedNotifications.filter((nId) => nId !== id))
    }
  }
  useLayoutEffect(() => {
    fetchAllNotifications()

  }, [])
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notifications</h2>
          <p className="text-muted-foreground">Manage and send push notifications to your users</p>
        </div>
        <div className="flex items-center space-x-2">
          {/* <Button asChild>
            <Link href="/u/notifications/create">
              <Plus className="mr-2 h-4 w-4" />
              New Notification
            </Link>
          </Button> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">0 from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Next in 2 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">0% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">00</div>
            <p className="text-xs text-muted-foreground"> 0 from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>View and manage all your push notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2 mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px] pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="clicked">Clicked</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="request">Request</SelectItem>
                  <SelectItem value="dropped">Dropped</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {selectedNotifications.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">{selectedNotifications.length} selected</span>
                <Button variant="outline" size="sm">
                  Bulk Actions
                </Button>
              </div>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedNotifications.length === filteredNotifications.length}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>

                <TableHead>Project</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Sent</TableHead>
                <TableHead>Clicked</TableHead>
                <TableHead>Failed</TableHead>
                <TableHead>Closed</TableHead>
                <TableHead>Dropped</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedNotifications.includes(notification.id)}
                      onCheckedChange={(checked) => handleSelectNotification(notification.id, checked as boolean)}
                    />
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline">{notification.project.name}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{notification.project.website.domain}</TableCell>
                  <TableCell>
                    <span className="font-medium">{notification.total_sent.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{notification.total_clicked.toLocaleString()}</span>
                    {notification.total_clicked > 0 && (
                      <div className="text-xs text-muted-foreground">
                        {((notification.total_sent / notification.total_clicked) * 100).toFixed(1)}%
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{notification.total_failed.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{notification.total_closed.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{notification.total_dropped.toLocaleString()}</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                      <Button variant={"outline"} size={"sm"} >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
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
