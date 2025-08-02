"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Pause, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for flows
const flowsData = [
  {
    id: 1,
    name: "Welcome Flow",
    description: "Automated welcome sequence for new subscribers",
    status: "Active",
    triggers: 2,
    actions: 3,
    lastRun: "2024-01-20",
  },
  {
    id: 2,
    name: "Abandoned Cart Recovery",
    description: "Re-engage users who left items in cart",
    status: "Paused",
    triggers: 1,
    actions: 2,
    lastRun: "2024-01-18",
  },
  {
    id: 3,
    name: "Weekly Newsletter",
    description: "Send weekly digest to all subscribers",
    status: "Active",
    triggers: 1,
    actions: 1,
    lastRun: "2024-01-21",
  },
]

export default function FlowsPage() {
  const [flows, setFlows] = useState(flowsData)
  const { toast } = useToast()

  const toggleFlowStatus = (id: number) => {
    setFlows((prev) =>
      prev.map((flow) => (flow.id === id ? { ...flow, status: flow.status === "Active" ? "Paused" : "Active" } : flow)),
    )
    toast({
      title: "Flow status updated",
      description: "The flow status has been changed successfully.",
    })
  }

  const deleteFlow = (id: number) => {
    setFlows((prev) => prev.filter((flow) => flow.id !== id))
    toast({
      title: "Flow deleted",
      description: "The flow has been deleted successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Flows</h1>
          <p className="text-muted-foreground">Create automated workflows for your notification campaigns</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Flow
        </Button>
      </div>

      {/* Flow Builder Canvas Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Flow Builder</CardTitle>
          <CardDescription>Drag and drop components to create your notification workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="space-y-4">
              <div className="text-gray-500">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Drag-and-Drop Flow Builder</h3>
                <p className="text-gray-500">Create workflows by connecting triggers, conditions, and actions</p>
              </div>
              <div className="flex justify-center space-x-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Play className="h-8 w-8 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Triggers</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Conditions</span>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Actions</span>
                </div>
              </div>
              <Button className="mt-4">Start Building Your First Flow</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Flows */}
      <Card>
        <CardHeader>
          <CardTitle>Your Flows</CardTitle>
          <CardDescription>Manage your existing notification workflows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {flows.map((flow) => (
              <div key={flow.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{flow.name}</h3>
                      <Badge variant={flow.status === "Active" ? "default" : "secondary"}>{flow.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{flow.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>
                        {flow.triggers} Trigger{flow.triggers !== 1 ? "s" : ""}
                      </span>
                      <span>
                        {flow.actions} Action{flow.actions !== 1 ? "s" : ""}
                      </span>
                      <span>Last run: {flow.lastRun}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => toggleFlowStatus(flow.id)}>
                      {flow.status === "Active" ? (
                        <>
                          <Pause className="mr-1 h-3 w-3" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="mr-1 h-3 w-3" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteFlow(flow.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
