"use client"

import { useEffect,  useMemo, useState } from "react"
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
  BarChart3,

} from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { db } from "@/lib/db"
import { API } from "@/lib/api/handler"
import { AllProjectsResponse } from "@/lib/interfaces/project.interface"


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
  const [templateCategories, setTemplateCategories] = useState<{ name: string; slug: string }[]>([])


  const [projects, setProjects] = useState<AllProjectsResponse[]>([])

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.website.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || project.category.slug === categoryFilter

      return matchesSearch && matchesCategory
    })
  }, [projects, searchQuery, categoryFilter])


  const fetchAllProjects = async () => {
    try {
      const { data } = await API.getAllProjects()
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch projects")
      }
      await db.bulkPutItems("projects", data.result as any[])
      setProjects(data.result)
    } catch (error) { }
  }
  const fetchTemplateCategories = async () => {
    try {
      const categories = await db.getAllItems("template_categories")
      setTemplateCategories(categories)
    } catch (error) {
      console.error("Failed to fetch categories", error)
    }
  }

  useEffect(() => {
    fetchAllProjects()
    fetchTemplateCategories()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">Manage your notification projects and campaigns</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/u/projects/create">
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
              {projects.filter((p) => p.is_active).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notifications</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.reduce((sum, p) => sum + (p?.notifications || 0), 0)}</div>
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
              {projects.reduce((sum, p) => sum + (p?.subscribers || 0), 0).toLocaleString()}
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
              {(projects.reduce((sum, p) => sum + (p?.clickRate || 0), 0) / projects.length).toFixed(1)}%
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
                  {templateCategories.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))
                  }
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
                    <Link href={`/u/projects/${project.id}`} className="space-y-1">
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-muted-foreground">{project.unique_id}</div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{project?.category?.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{project?.website?.domain}</TableCell>
                  <TableCell>{getStatusBadge(project.is_active ? "active" : "paused")}</TableCell>
                  <TableCell>
                    <span className="font-medium">{project?.notifications || 0}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{project?.subscribers?.toLocaleString() || 0}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{project?.clickRate || 0}%</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(project.updated_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/u/projects/${project.id}`}>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            View Project
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/u/projects/${project.id}/update`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Project
                          </DropdownMenuItem></Link>

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
