"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Plus,
  Search,
  GitBranch,
  Play,
  Pause,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload,
  Zap,
  Filter,
  Clock,
  Bell,
  Users,
  ArrowRight,
  Copy,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock data
const flows = [
  {
    id: "FLOW001",
    name: "Welcome Series",
    description: "Onboarding flow for new users",
    status: "active",
    triggers: 3,
    actions: 5,
    executions: 1250,
    successRate: 94.5,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    lastExecution: "2024-01-23 10:30:00",
    project: "Onboarding",
  },
  {
    id: "FLOW002",
    name: "Abandoned Cart Recovery",
    description: "Re-engage users who left items in cart",
    status: "active",
    triggers: 2,
    actions: 4,
    executions: 890,
    successRate: 87.2,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-21",
    lastExecution: "2024-01-23 14:20:00",
    project: "E-commerce",
  },
  {
    id: "FLOW003",
    name: "Feature Announcement",
    description: "Notify users about new features",
    status: "paused",
    triggers: 1,
    actions: 2,
    executions: 0,
    successRate: 0,
    createdAt: "2024-01-17",
    updatedAt: "2024-01-22",
    lastExecution: null,
    project: "Product Updates",
  },
  {
    id: "FLOW004",
    name: "Weekly Digest",
    description: "Send weekly summary notifications",
    status: "draft",
    triggers: 1,
    actions: 3,
    executions: 0,
    successRate: 0,
    createdAt: "2024-01-18",
    updatedAt: "2024-01-23",
    lastExecution: null,
    project: "Marketing",
  },
]

const nodeTypes = [
  {
    type: "trigger",
    name: "User Registration",
    description: "Triggered when a user registers",
    icon: Users,
    color: "bg-blue-100 text-blue-800",
  },
  {
    type: "trigger",
    name: "Time-based",
    description: "Triggered at specific times",
    icon: Clock,
    color: "bg-purple-100 text-purple-800",
  },
  {
    type: "condition",
    name: "User Segment",
    description: "Filter users by criteria",
    icon: Filter,
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    type: "action",
    name: "Send Notification",
    description: "Send push notification",
    icon: Bell,
    color: "bg-green-100 text-green-800",
  },
  {
    type: "action",
    name: "Wait/Delay",
    description: "Add delay between actions",
    icon: Clock,
    color: "bg-gray-100 text-gray-800",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <Play className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )
    case "paused":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <Pause className="w-3 h-3 mr-1" />
          Paused
        </Badge>
      )
    case "draft":
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          <Edit className="w-3 h-3 mr-1" />
          Draft
        </Badge>
      )
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function FlowsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedFlow, setSelectedFlow] = useState<any>(null)
  const [isCanvasOpen, setIsCanvasOpen] = useState(false)
  const { toast } = useToast()

  const filteredFlows = flows.filter((flow) => {
    const matchesSearch =
      flow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      flow.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || flow.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (flowId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast({
        title: "Flow deleted",
        description: "The flow has been removed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete flow. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleExport = (flow: any) => {
    const flowData = {
      id: flow.id,
      name: flow.name,
      description: flow.description,
      nodes: [
        { id: "1", type: "trigger", data: { label: "User Registration" } },
        { id: "2", type: "action", data: { label: "Send Welcome Notification" } },
      ],
      edges: [{ id: "e1-2", source: "1", target: "2" }],
    }

    const dataStr = JSON.stringify(flowData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `${flow.name.toLowerCase().replace(/\s+/g, "-")}-flow.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Flow exported",
      description: "Flow has been exported as JSON file.",
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Notification Flows</h2>
          <p className="text-muted-foreground">Create and manage automated notification workflows</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Flow
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Flow</DialogTitle>
                <DialogDescription>Start building your automated notification workflow.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="flow-name">Flow Name</Label>
                  <Input id="flow-name" placeholder="Enter flow name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flow-description">Description</Label>
                  <Textarea id="flow-description" placeholder="Describe what this flow does" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flow-project">Project</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      setIsCanvasOpen(true)
                      toast({
                        title: "Flow created",
                        description: "Your new flow has been created. Start building!",
                      })
                    }}
                  >
                    Create & Edit
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Flows</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flows.length}</div>
            <p className="text-xs text-muted-foreground">{flows.filter((f) => f.status === "active").length} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flows.reduce((sum, f) => sum + f.executions, 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(flows.reduce((sum, f) => sum + f.successRate, 0) / flows.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">Across all flows</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Flows</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flows.filter((f) => f.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
      </div>

      {/* Flows Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Flows</CardTitle>
          <CardDescription>View and manage your notification workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between space-x-2 mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search flows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-[300px] pl-8"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
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
                <TableHead>Flow</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Triggers</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFlows.map((flow) => (
                <TableRow key={flow.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{flow.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{flow.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(flow.status)}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{flow.project}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{flow.triggers}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{flow.actions}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{flow.executions.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{flow.successRate}%</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {flow.lastExecution ? new Date(flow.lastExecution).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedFlow(flow)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setIsCanvasOpen(true)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Flow
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport(flow)}>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the flow and all associated
                                data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(flow.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Flow Canvas Dialog */}
      <Dialog open={isCanvasOpen} onOpenChange={setIsCanvasOpen}>
        <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Flow Builder</DialogTitle>
            <DialogDescription>Drag and drop nodes to create your notification workflow.</DialogDescription>
          </DialogHeader>

          <div className="flex h-[70vh]">
            {/* Node Palette */}
            <div className="w-64 border-r p-4 space-y-4">
              <h3 className="font-medium">Node Types</h3>
              <div className="space-y-2">
                {nodeTypes.map((node, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                    draggable
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${node.color}`}>
                        <node.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{node.name}</div>
                        <div className="text-xs text-muted-foreground">{node.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 p-4 bg-muted/20 relative">
              <div className="text-center text-muted-foreground mt-20">
                <GitBranch className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Flow Canvas</h3>
                <p className="text-sm">Drag nodes from the left panel to start building your flow.</p>
                <p className="text-xs mt-2">
                  This is a simplified representation. In a real implementation, you would use a library like React
                  Flow.
                </p>
              </div>

              {/* Sample Flow Visualization */}
              <div className="absolute top-20 left-20 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-blue-100 text-blue-800 rounded-lg border-2 border-blue-200">
                    <Users className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">User Registration</div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="p-4 bg-green-100 text-green-800 rounded-lg border-2 border-green-200">
                    <Bell className="h-6 w-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Welcome Notification</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setIsCanvasOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsCanvasOpen(false)
                  toast({
                    title: "Flow saved",
                    description: "Your flow has been saved successfully.",
                  })
                }}
              >
                Save Flow
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Flow Details Dialog */}
      <Dialog open={!!selectedFlow} onOpenChange={() => setSelectedFlow(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedFlow?.name}</DialogTitle>
            <DialogDescription>{selectedFlow?.description}</DialogDescription>
          </DialogHeader>

          {selectedFlow && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Status</CardTitle>
                  </CardHeader>
                  <CardContent>{getStatusBadge(selectedFlow.status)}</CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Executions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedFlow.executions.toLocaleString()}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Success Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{selectedFlow.successRate}%</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Last Execution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      {selectedFlow.lastExecution
                        ? new Date(selectedFlow.lastExecution).toLocaleString()
                        : "Never executed"}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Flow Structure</h4>
                <div className="text-sm text-muted-foreground">
                  <div>• {selectedFlow.triggers} trigger(s)</div>
                  <div>• {selectedFlow.actions} action(s)</div>
                  <div>• Project: {selectedFlow.project}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
