"use client"

import { useState } from "react"
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const webhookSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  eventTrigger: z.string().min(1, "Event trigger is required"),
  triggerType: z.enum(["rest", "telegram", "discord"]),
  url: z.string().url("Please enter a valid URL").optional(),
  telegramBotId: z.string().optional(),
  discordWebhookUrl: z.string().url("Please enter a valid Discord webhook URL").optional(),
  description: z.string().optional(),
})

type WebhookForm = z.infer<typeof webhookSchema>

// Mock data
const webhooks = [
  {
    id: "WH001",
    name: "Slack Notifications",
    description: "Send notifications to Slack channel",
    eventTrigger: "notification.sent",
    triggerType: "rest",
    url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
    status: "active",
    lastTriggered: "2024-01-23 10:30:00",
    totalTriggers: 1250,
    successRate: 98.5,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
  },
  {
    id: "WH002",
    name: "Discord Alerts",
    description: "Send alerts to Discord server",
    eventTrigger: "notification.failed",
    triggerType: "discord",
    url: "https://discord.com/api/webhooks/123456789/abcdefghijklmnopqrstuvwxyz",
    status: "active",
    lastTriggered: "2024-01-22 14:20:00",
    totalTriggers: 45,
    successRate: 95.6,
    createdAt: "2024-01-16",
    updatedAt: "2024-01-21",
  },
  {
    id: "WH003",
    name: "Telegram Bot",
    description: "Send updates via Telegram bot",
    eventTrigger: "user.subscribed",
    triggerType: "telegram",
    telegramBotId: "123456789:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw",
    status: "paused",
    lastTriggered: "2024-01-20 09:15:00",
    totalTriggers: 890,
    successRate: 92.3,
    createdAt: "2024-01-17",
    updatedAt: "2024-01-22",
  },
  {
    id: "WH004",
    name: "Analytics Webhook",
    description: "Send analytics data to external service",
    eventTrigger: "notification.clicked",
    triggerType: "rest",
    url: "https://api.analytics.example.com/webhook",
    status: "failed",
    lastTriggered: "2024-01-19 16:45:00",
    totalTriggers: 0,
    successRate: 0,
    createdAt: "2024-01-18",
    updatedAt: "2024-01-23",
  },
]

const eventTriggers = [
  { value: "notification.sent", label: "Notification Sent" },
  { value: "notification.failed", label: "Notification Failed" },
  { value: "notification.clicked", label: "Notification Clicked" },
  { value: "user.subscribed", label: "User Subscribed" },
  { value: "user.unsubscribed", label: "User Unsubscribed" },
  { value: "project.created", label: "Project Created" },
  { value: "domain.verified", label: "Domain Verified" },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      )
    case "paused":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Paused
        </Badge>
      )
    case "failed":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Failed
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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<any>(null)
  const [isTestingWebhook, setIsTestingWebhook] = useState(false)
  const { toast } = useToast()

  const form = useForm<WebhookForm>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      name: "",
      eventTrigger: "",
      triggerType: "rest",
      url: "",
      telegramBotId: "",
      discordWebhookUrl: "",
      description: "",
    },
  })

  const watchedTriggerType = form.watch("triggerType")

  const filteredWebhooks = webhooks.filter(
    (webhook) =>
      webhook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      webhook.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const onSubmit = async (data: WebhookForm) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Webhook created",
        description: `${data.name} has been created successfully.`,
      })
      setIsAddDialogOpen(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create webhook. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (webhookId: string) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
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

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Webhooks</h2>
          <p className="text-muted-foreground">Integrate with external services using webhooks</p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Webhook
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Webhook</DialogTitle>
                <DialogDescription>Create a new webhook to integrate with external services.</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter webhook name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Describe what this webhook does" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="eventTrigger"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Trigger</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select event trigger" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {eventTriggers.map((trigger) => (
                              <SelectItem key={trigger.value} value={trigger.value}>
                                {trigger.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="triggerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trigger Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="rest">REST URL</SelectItem>
                            <SelectItem value="telegram">Telegram Bot</SelectItem>
                            <SelectItem value="discord">Discord Webhook</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchedTriggerType === "rest" && (
                    <FormField
                      control={form.control}
                      name="url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Webhook URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/webhook" {...field} />
                          </FormControl>
                          <FormDescription>The URL where POST requests will be sent</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {watchedTriggerType === "telegram" && (
                    <FormField
                      control={form.control}
                      name="telegramBotId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telegram Bot Token</FormLabel>
                          <FormControl>
                            <Input placeholder="123456789:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw" {...field} />
                          </FormControl>
                          <FormDescription>Your Telegram bot token from @BotFather</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {watchedTriggerType === "discord" && (
                    <FormField
                      control={form.control}
                      name="discordWebhookUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discord Webhook URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://discord.com/api/webhooks/..." {...field} />
                          </FormControl>
                          <FormDescription>Discord webhook URL from your server settings</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Create Webhook</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
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
              {webhooks.filter((w) => w.status === "active").length} active
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
              {webhooks.reduce((sum, w) => sum + w.totalTriggers, 0).toLocaleString()}
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
              {(webhooks.reduce((sum, w) => sum + w.successRate, 0) / webhooks.length).toFixed(1)}%
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
            <div className="text-2xl font-bold">{webhooks.filter((w) => w.status === "failed").length}</div>
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
                    <Badge variant="outline">
                      {eventTriggers.find((t) => t.value === webhook.eventTrigger)?.label || webhook.eventTrigger}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTriggerTypeIcon(webhook.triggerType)}
                      <span className="capitalize">{webhook.triggerType}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(webhook.status)}</TableCell>
                  <TableCell>
                    <span className="font-medium">{webhook.totalTriggers.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{webhook.successRate}%</span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {webhook.lastTriggered ? new Date(webhook.lastTriggered).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedWebhook(webhook)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleTest(webhook)} disabled={isTestingWebhook}>
                          <TestTube className="mr-2 h-4 w-4" />
                          {isTestingWebhook ? "Testing..." : "Test Webhook"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyWebhookUrl(webhook.url || webhook.telegramBotId || "")}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy URL
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
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

      {/* Webhook Details Dialog */}
      <Dialog open={!!selectedWebhook} onOpenChange={() => setSelectedWebhook(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedWebhook?.name}</DialogTitle>
            <DialogDescription>{selectedWebhook?.description}</DialogDescription>
          </DialogHeader>

          {selectedWebhook && (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="configuration">Configuration</TabsTrigger>
                <TabsTrigger value="logs">Logs</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Status</CardTitle>
                    </CardHeader>
                    <CardContent>{getStatusBadge(selectedWebhook.status)}</CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Triggers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedWebhook.totalTriggers.toLocaleString()}</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedWebhook.successRate}%</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Last Triggered</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm">
                        {selectedWebhook.lastTriggered
                          ? new Date(selectedWebhook.lastTriggered).toLocaleString()
                          : "Never triggered"}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="configuration" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Event Trigger</h4>
                    <Badge variant="outline">
                      {eventTriggers.find((t) => t.value === selectedWebhook.eventTrigger)?.label ||
                        selectedWebhook.eventTrigger}
                    </Badge>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Trigger Type</h4>
                    <div className="flex items-center gap-2">
                      {getTriggerTypeIcon(selectedWebhook.triggerType)}
                      <span className="capitalize">{selectedWebhook.triggerType}</span>
                    </div>
                  </div>

                  {selectedWebhook.url && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Webhook URL</h4>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted p-2 rounded flex-1 truncate">{selectedWebhook.url}</code>
                        <Button size="sm" variant="outline" onClick={() => copyWebhookUrl(selectedWebhook.url)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => window.open(selectedWebhook.url, "_blank")}>
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {selectedWebhook.telegramBotId && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Telegram Bot Token</h4>
                      <code className="text-xs bg-muted p-2 rounded block">{selectedWebhook.telegramBotId}</code>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="logs" className="space-y-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Webhook className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Webhook execution logs will appear here.</p>
                  <p className="text-xs mt-2">Recent triggers and their responses will be displayed.</p>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
