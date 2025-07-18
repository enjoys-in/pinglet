"use client"
import React, { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from '@/components/ui/badge'

import { useToast } from '@/hooks/use-toast'
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
import { Button } from '@/components/ui/button'
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
const page = () => {

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
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Flow Builder</CardTitle>
                    <CardDescription>Drag and drop nodes to create your notification workflow.</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>


            {selectedFlow && (<Card className="sm:max-w-[600px]">
                <CardHeader>
                    <CardTitle>{selectedFlow?.name}</CardTitle>
                    <CardDescription>{selectedFlow?.description}</CardDescription>
                </CardHeader>
                <CardContent>



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

                </CardContent>



            </Card>)}
        </div >
    )
}

export default page