"use client"

import { useLayoutEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FolderOpen,
  Users,
  Bell,
  Eye,
  Edit,
  Trash2,
  ShoppingCart,
  CreditCard,
  Megaphone,
  Truck,
  BarChart3,
  Building,
} from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { db } from "@/lib/db"

// Mock data
const projects = [
  {
    id: "PRJ001",
    name: "Welcome Onboarding",
    category: "Onboarding",
    website: "app.example.com",
    notifications: 45,
    subscribers: 1250,
    clickRate: 12.5,
    status: "active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    template: "welcome-series",
  },
   
]

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "E-commerce":
      return <ShoppingCart className="h-4 w-4" />
    case "Payment":
      return <CreditCard className="h-4 w-4" />
    case "Marketing":
      return <Megaphone className="h-4 w-4" />
    case "Delivery":
      return <Truck className="h-4 w-4" />
    case "Survey & Polls":
      return <BarChart3 className="h-4 w-4" />
    case "Agency":
      return <Building className="h-4 w-4" />
    default:
      return <FolderOpen className="h-4 w-4" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    case "paused":
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Paused</Badge>
    case "draft":
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.website.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const categories = [...new Set(projects.map((p) => p.category))]
  const fetchTemplateCategories = async () => {
    try {
      // const itmes = await db.getAllItems("template-categories") 

    } catch (error) {
      
    }
  }
  useLayoutEffect(() => {
    fetchTemplateCategories()
  },[])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage your notification projects and campaigns</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/projects/create">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.filter((p) => p.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.reduce((sum, p) => sum + p.notifications, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {projects.reduce((sum, p) => sum + p.subscribers, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Unique subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Click Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(projects.reduce((sum, p) => sum + p.clickRate, 0) / projects.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>View and manage all your notification projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2 mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px] pl-8"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[150px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Website</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notifications</TableHead>
                <TableHead>Subscribers</TableHead>
                <TableHead>Click Rate</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">{project.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getCategoryIcon(project.category)}
                      <span>{project.category}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{project.website}</TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell>
                    <span className="font-medium">{project.notifications}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{project.subscribers.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{project.clickRate}%</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Project
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          Send Notification
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
