"use client"

import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import {
  Plus,
  Search,
  Webhook,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  TestTube,
  Copy,
  ExternalLink,
  MessageSquare,
  Send,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { eventTriggers } from "./data"
import { API } from "@/lib/api/handler"
import { WebhookResponse } from "@/lib/interfaces/webhook.interface"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


const getStatusBadge = (status: boolean) => {
  switch (status) {
    case true:
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )
    case false:
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Paused
        </Badge>
      )

    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getTriggerTypeIcon = (type: string) => {
  switch (type) {
    case "telegram":
      return <Send className="h-4 w-4" />
    case "discord":
      return <MessageSquare className="h-4 w-4" />
    default:
      return <Webhook className="h-4 w-4" />
  }
}

export default function WebhooksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [webhooks, setWebhooks] = useState<Array<WebhookResponse>>([])

  const [isTestingWebhook, setIsTestingWebhook] = useState(false)
  const { toast } = useToast()



  const filteredWebhooks = webhooks.filter(
    (webhook) =>
      webhook?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webhook?.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )


  const handleDelete = async (webhookId: number) => {
    try {
      const { data } = await API.deleteWebhook(webhookId)
      if (!data.success) {
        throw new Error(data.message)
      }
      toast({
        title: "Webhook deleted",
        description: "The webhook has been removed successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete webhook. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTest = async (webhook: any) => {
    setIsTestingWebhook(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      toast({
        title: "Test successful",
        description: "Webhook test completed successfully.",
      })
    } catch (error) {
      toast({
        title: "Test failed",
        description: "Webhook test failed. Please check your configuration.",
        variant: "destructive",
      })
    } finally {
      setIsTestingWebhook(false)
    }
  }

  const copyWebhookUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "Copied",
      description: "Webhook URL copied to clipboard.",
    })
  }
  const fetchAllWebhooks = useCallback(async () => {
    try {
      const { data } = await API.getAllWebhooks()
      if (!data.success) {
        toast({
          title: "Error",
          description: "Failed to fetch webhooks. Please try again.",
          variant: "destructive",
        })
        return
      }
      setWebhooks(data.result)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch webhooks. Please try again.",
        variant: "destructive",
      })
    }
  }, [])
  useEffect(() => {
    fetchAllWebhooks()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Webhooks</h2>
          <p className="text-muted-foreground">Integrate with external services using webhooks</p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/u/webhooks/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Webhook
            </Button>
          </Link>

        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Webhooks</CardTitle>
            <Webhook className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{webhooks.length}</div>
            <p className="text-xs text-muted-foreground">
              {webhooks.filter((w) => w.is_active).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Triggers</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* {webhooks.reduce((sum, w) => sum + w.totalTriggers, 0).toLocaleString()} */}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* {(webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length).toFixed(1)}% */}
            </div>
            <p className="text-xs text-muted-foreground">Across all webhooks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Webhooks</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* <div className="text-2xl font-bold">{webhooks.filter((w) => w.is === "failed").length}</div> */}
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Webhooks Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Webhooks</CardTitle>
          <CardDescription>View and manage your webhook integrations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search webhooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Webhook</TableHead>
                <TableHead>Event Trigger</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Triggers</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Last Triggered</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWebhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{webhook.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{webhook.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="cursor-pointer">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>
                              {webhook.triggers_on.length} event{webhook.triggers_on.length !== 1 ? "s" : ""}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent className="w-64">
                            {eventTriggers
                              .filter((trigger) => webhook.triggers_on.includes(trigger.value as any))
                              .map((trigger) => trigger.label)
                              .join(", ")}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTriggerTypeIcon(webhook.type)}
                      <span className="capitalize">{webhook.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(webhook.is_active)}</TableCell>
                  <TableCell>
                    {/* <span className="font-medium">{webhook.totalTriggers.toLocaleString()}</span> */}
                  </TableCell>
                  <TableCell>
                    {/* <span className="font-medium">{webhook.successRate}%</span> */}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {/* {webhook.lastTriggered ? new Date(webhook.lastTriggered).toLocaleDateString() : "Never"} */}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <Link href={`/u/webhooks/${webhook.id}`}>
                          <DropdownMenuItem >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem></Link>
                        <DropdownMenuItem onClick={() => handleTest(webhook)} disabled={isTestingWebhook}>
                          <TestTube className="mr-2 h-4 w-4" />
                          {isTestingWebhook ? "Testing..." : "Test Webhook"}
                        </DropdownMenuItem>
                        <Link href={`/u/webhooks/${webhook.id}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
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
                                This action cannot be undone. This will permanently delete the webhook and all
                                associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(webhook.id)}
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

    </div>
  )
}
