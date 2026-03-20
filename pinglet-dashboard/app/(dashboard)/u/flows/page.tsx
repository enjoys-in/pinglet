"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Plus, Search, GitBranch, Play, Pause, MoreHorizontal,
  Eye, Edit, Trash2, Download, Zap, Copy,
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  type FlowExport, getAllFlows, saveFlow, deleteFlow as removeFlow, generateFlowId,
} from "@/components/workflow/notification-flow/types"
import { API } from "@/lib/api/handler"
import { db } from "@/lib/db"
import type { AllProjectsResponse } from "@/lib/interfaces/project.interface"

const statusConfig: Record<string, { label: string; icon: typeof Play; className: string }> = {
  active: { label: "Active", icon: Play, className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  paused: { label: "Paused", icon: Pause, className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  draft:  { label: "Draft",  icon: Edit, className: "bg-muted text-muted-foreground border-border" },
}

export default function FlowsPage() {
  const [flows, setFlows] = useState<FlowExport[]>([])
  const [search, setSearch] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)
  const [viewTarget, setViewTarget] = useState<FlowExport | null>(null)
  const [newName, setNewName] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newProject, setNewProject] = useState("")
  const [projects, setProjects] = useState<AllProjectsResponse[]>([])
  const [projectsLoading, setProjectsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const reload = useCallback(() => setFlows(getAllFlows()), [])
  useEffect(reload, [reload])

  // Load projects from API, cache in IndexedDB
  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true)
    try {
      const { data } = await API.getAllProjects()
      if (data.success && data.result) {
        setProjects(data.result)
        await db.bulkPutItems("projects", data.result as any[])
      }
    } catch {
      // Fallback: load from IndexedDB
      try {
        const cached = await db.getAllItems("projects")
        if (cached?.length) setProjects(cached as unknown as AllProjectsResponse[])
      } catch {}
    } finally {
      setProjectsLoading(false)
    }
  }, [])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const filtered = flows.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    (f.description || "").toLowerCase().includes(search.toLowerCase()),
  )

  // Create
  const handleCreate = () => {
    if (!newName.trim() || !newProject) return
    const id = generateFlowId()
    const flow: FlowExport = {
      id,
      name: newName.trim(),
      description: newDesc.trim() || undefined,
      projectId: newProject,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes: [],
      edges: [],
    }
    saveFlow(flow)
    setCreateOpen(false)
    setNewName("")
    setNewDesc("")
    setNewProject("")
    toast({ title: "Flow created", description: `"${flow.name}" is ready to edit.` })
    router.push(`/u/flows/manage/build?id=${id}&projectId=${newProject}`)
  }

  // Delete
  const handleDelete = () => {
    if (!deleteTarget) return
    removeFlow(deleteTarget)
    reload()
    setDeleteTarget(null)
    toast({ title: "Flow deleted" })
  }

  // Toggle status
  const toggleStatus = (flow: FlowExport) => {
    const next = flow.status === "active" ? "paused" : "active"
    saveFlow({ ...flow, status: next })
    reload()
    toast({ title: `Flow ${next}` })
  }

  // Duplicate
  const handleDuplicate = (flow: FlowExport) => {
    const dup: FlowExport = {
      ...flow,
      id: generateFlowId(),
      name: `${flow.name} (Copy)`,
      status: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    saveFlow(dup)
    reload()
    toast({ title: "Flow duplicated" })
  }

  // Export
  const handleExport = (flow: FlowExport) => {
    const blob = new Blob([JSON.stringify(flow, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${flow.name.toLowerCase().replace(/\s+/g, "-")}-flow.json`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Exported" })
  }

  const activeCount = flows.filter(f => f.status === "active").length
  const triggerCount = flows.reduce((s, f) => s + f.nodes.filter(n => n.type === "event_trigger").length, 0)
  const actionCount = flows.reduce((s, f) => s + f.nodes.filter(n => n.type === "notification").length, 0)

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notification Flows</h2>
          <p className="text-muted-foreground">Build event-driven notification workflows visually</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Create Flow
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flows</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flows.length}</div>
            <p className="text-xs text-muted-foreground">{activeCount} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Triggers</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{triggerCount}</div>
            <p className="text-xs text-muted-foreground">Across all flows</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{actionCount}</div>
            <p className="text-xs text-muted-foreground">Notification actions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Flows</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search flows..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* Flow Cards */}
      {filtered.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <GitBranch className="size-12 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-semibold mb-1">
              {flows.length === 0 ? "No flows yet" : "No matching flows"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {flows.length === 0
                ? "Create your first event-driven notification flow."
                : "Try a different search term."}
            </p>
            {flows.length === 0 && (
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Flow
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(flow => {
            const st = statusConfig[flow.status] || statusConfig.draft
            const StIcon = st.icon
            const triggers = flow.nodes.filter(n => n.type === "event_trigger").length
            const notifs = flow.nodes.filter(n => n.type === "notification").length
            return (
              <Card key={flow.id} className="group relative hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0 mr-2">
                      <CardTitle className="text-base truncate">{flow.name}</CardTitle>
                      {flow.description && (
                        <CardDescription className="mt-1 line-clamp-2 text-xs">{flow.description}</CardDescription>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8 shrink-0">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewTarget(flow)}>
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/u/flows/manage/build?id=${flow.id}&projectId=${flow.projectId}`)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleStatus(flow)}>
                          {flow.status === "active" ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                          {flow.status === "active" ? "Pause" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDuplicate(flow)}>
                          <Copy className="mr-2 h-4 w-4" /> Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport(flow)}>
                          <Download className="mr-2 h-4 w-4" /> Export JSON
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteTarget(flow.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <Badge variant="outline" className={st.className}>
                      <StIcon className="size-3 mr-1" /> {st.label}
                    </Badge>
                    {flow.projectId && (
                      <Badge variant="secondary" className="text-[10px]">
                        {projects.find(p => String(p.id) === flow.projectId)?.name || flow.projectId}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{flow.nodes.length} nodes</span>
                    <span>{triggers} triggers</span>
                    <span>{notifs} notifications</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-2">
                    Updated {new Date(flow.updatedAt).toLocaleDateString()}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-3 text-xs"
                    onClick={() => router.push(`/u/flows/manage/build?id=${flow.id}&projectId=${flow.projectId}`)}
                  >
                    <Edit className="size-3.5 mr-1.5" /> Open Editor
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* ─── Create Dialog ─── */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Flow</DialogTitle>
            <DialogDescription>Name your flow and jump into the visual editor.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Project <span className="text-destructive">*</span></Label>
              <Select value={newProject} onValueChange={setNewProject}>
                <SelectTrigger>
                  <SelectValue placeholder={projectsLoading ? "Loading projects..." : "Select a project"} />
                </SelectTrigger>
                <SelectContent>
                  {projects.length === 0 && (
                    <div className="px-2 py-3 text-center text-sm text-muted-foreground">
                      {projectsLoading ? "Loading..." : "No projects found"}
                    </div>
                  )}
                  {projects.map(p => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      <span className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${p.is_active ? "bg-emerald-500" : "bg-gray-400"}`} />
                        {p.name}
                        <span className="text-xs text-muted-foreground">({p.website_domain})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Flow Name <span className="text-destructive">*</span></Label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Welcome Series" />
            </div>
            <div className="space-y-2">
              <Label>Description (optional)</Label>
              <Textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="What does this flow do?" rows={2} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button disabled={!newName.trim() || !newProject} onClick={handleCreate}>Create & Edit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── View Detail Dialog ─── */}
      <Dialog open={!!viewTarget} onOpenChange={() => setViewTarget(null)}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{viewTarget?.name}</DialogTitle>
            <DialogDescription>{viewTarget?.description || "No description"}</DialogDescription>
          </DialogHeader>
          {viewTarget && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline" className="ml-1">{viewTarget.status}</Badge></div>
                <div><span className="text-muted-foreground">Project:</span> <Badge variant="secondary" className="ml-1">{viewTarget.projectId?.replace("project_", "") || "—"}</Badge></div>
                <div><span className="text-muted-foreground">Nodes:</span> <span className="font-medium ml-1">{viewTarget.nodes.length}</span></div>
                <div><span className="text-muted-foreground">Edges:</span> <span className="font-medium ml-1">{viewTarget.edges.length}</span></div>
                <div><span className="text-muted-foreground">Created:</span> <span className="ml-1">{new Date(viewTarget.createdAt).toLocaleString()}</span></div>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Flow Payload</p>
                <pre className="rounded-lg bg-muted p-3 text-xs font-mono overflow-auto max-h-60">
                  {JSON.stringify(viewTarget, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirm ─── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this flow?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

