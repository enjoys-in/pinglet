"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Upload, ImageIcon, Video, Music, X, Plus, Calendar, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const notificationSchema = z.object({
  website: z.string().min(1, "Please select a website"),
  project: z.string().min(1, "Please select a project"),
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(300, "Description must be less than 300 characters"),
  icon: z.any().optional(),
  mediaType: z.enum(["none", "image", "video", "audio"]).default("none"),
  mediaFile: z.any().optional(),
  buttons: z
    .array(
      z.object({
        text: z.string().min(1, "Button text is required"),
        action: z.enum(["redirect", "alert", "custom"]),
        value: z.string().min(1, "Action value is required"),
      }),
    )
    .max(2, "Maximum 2 buttons allowed"),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  scheduled: z.boolean().default(false),
  scheduleDate: z.string().optional(),
  scheduleTime: z.string().optional(),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  silent: z.boolean().default(false),
  autoRemove: z.boolean().default(false),
})

type NotificationForm = z.infer<typeof notificationSchema>

const websites = [
  { id: "1", name: "app.example.com", domain: "app.example.com" },
  { id: "2", name: "shop.example.com", domain: "shop.example.com" },
  { id: "3", name: "blog.example.com", domain: "blog.example.com" },
]

const projects = [
  { id: "1", name: "Onboarding", websiteId: "1" },
  { id: "2", name: "Marketing", websiteId: "2" },
  { id: "3", name: "Product Updates", websiteId: "1" },
  { id: "4", name: "System Alerts", websiteId: "1" },
]

export default function CreateNotificationPage() {
  const [selectedButtons, setSelectedButtons] = useState<Array<{ text: string; action: string; value: string }>>([])
  const [previewData, setPreviewData] = useState<any>(null)
  const { toast } = useToast()

  const form = useForm<NotificationForm>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      website: "",
      project: "",
      title: "",
      description: "",
      mediaType: "none",
      buttons: [],
      priority: "normal",
      scheduled: false,
      silent: false,
      autoRemove: false,
    },
  })

  const watchedValues = form.watch()
  const selectedWebsite = websites.find((w) => w.id === watchedValues.website)
  const availableProjects = projects.filter((p) => p.websiteId === watchedValues.website)

  const addButton = () => {
    if (selectedButtons.length < 2) {
      setSelectedButtons([...selectedButtons, { text: "", action: "redirect", value: "" }])
    }
  }

  const removeButton = (index: number) => {
    const newButtons = selectedButtons.filter((_, i) => i !== index)
    setSelectedButtons(newButtons)
    form.setValue("buttons", newButtons)
  }

  const updateButton = (index: number, field: string, value: string) => {
    const newButtons = [...selectedButtons]
    newButtons[index] = { ...newButtons[index], [field]: value }
    setSelectedButtons(newButtons)
    form.setValue("buttons", newButtons)
  }

  const onSubmit = async (data: NotificationForm) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Notification created",
        description: "Your notification has been created successfully.",
      })
      // Redirect to notifications list
      window.location.href = "/notifications"
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create notification. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Live preview update
  const updatePreview = () => {
    const values = form.getValues()
    setPreviewData({
      title: values.title || "Notification Title",
      description: values.description || "Notification description will appear here",
      buttons: selectedButtons.filter((b) => b.text.trim() !== ""),
      icon: "/placeholder.svg?height=64&width=64",
    })
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/notifications">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notifications
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create Notification</h2>
          <p className="text-muted-foreground">Create a new push notification for your users</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Configure the basic details of your notification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="website"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select website" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {websites.map((website) => (
                                <SelectItem key={website.id} value={website.id}>
                                  {website.name}
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
                      name="project"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={!watchedValues.website}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select project" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableProjects.map((project) => (
                                <SelectItem key={project.id} value={project.id}>
                                  {project.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter notification title"
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              updatePreview()
                            }}
                          />
                        </FormControl>
                        <FormDescription>{field.value?.length || 0}/100 characters</FormDescription>
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
                          <Textarea
                            placeholder="Enter notification description"
                            className="resize-none"
                            rows={3}
                            {...field}
                            onChange={(e) => {
                              field.onChange(e)
                              updatePreview()
                            }}
                          />
                        </FormControl>
                        <FormDescription>{field.value?.length || 0}/300 characters</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Media & Icon */}
              <Card>
                <CardHeader>
                  <CardTitle>Media & Icon</CardTitle>
                  <CardDescription>Add an icon and optional media to your notification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Icon/Logo</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <Button variant="outline" size="sm">
                          Upload Icon
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">Max 100KB, square preferred</p>
                      </div>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="mediaType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Media Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">No Media</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="audio">Audio</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {watchedValues.mediaType !== "none" && (
                    <div>
                      <Label>Media File</Label>
                      <div className="mt-2 border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                          {watchedValues.mediaType === "image" && (
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          )}
                          {watchedValues.mediaType === "video" && <Video className="h-8 w-8 text-muted-foreground" />}
                          {watchedValues.mediaType === "audio" && <Music className="h-8 w-8 text-muted-foreground" />}
                          <div>
                            <Button variant="outline" size="sm">
                              Upload {watchedValues.mediaType}
                            </Button>
                            <p className="text-xs text-muted-foreground mt-1">Drag and drop or click to upload</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Action Buttons</CardTitle>
                  <CardDescription>Add up to 2 action buttons to your notification</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedButtons.map((button, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Button {index + 1}</Label>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeButton(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <div>
                          <Label className="text-xs">Button Text</Label>
                          <Input
                            placeholder="Button text"
                            value={button.text}
                            onChange={(e) => updateButton(index, "text", e.target.value)}
                          />
                        </div>

                        <div>
                          <Label className="text-xs">Action Type</Label>
                          <Select value={button.action} onValueChange={(value) => updateButton(index, "action", value)}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="redirect">Redirect</SelectItem>
                              <SelectItem value="alert">Alert</SelectItem>
                              <SelectItem value="custom">Custom JS</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs">
                            {button.action === "redirect"
                              ? "URL"
                              : button.action === "alert"
                                ? "Message"
                                : "JavaScript"}
                          </Label>
                          <Input
                            placeholder={
                              button.action === "redirect"
                                ? "https://example.com"
                                : button.action === "alert"
                                  ? "Alert message"
                                  : "console.log('clicked')"
                            }
                            value={button.value}
                            onChange={(e) => updateButton(index, "value", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {selectedButtons.length < 2 && (
                    <Button type="button" variant="outline" onClick={addButton} className="w-full bg-transparent">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Button
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* UTM Parameters */}
              <Card>
                <CardHeader>
                  <CardTitle>UTM Parameters</CardTitle>
                  <CardDescription>Track your notification performance with UTM parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="utmSource"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UTM Source</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., newsletter" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="utmMedium"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UTM Medium</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., push" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="utmCampaign"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UTM Campaign</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., spring_sale" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Schedule & Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>Schedule & Settings</CardTitle>
                  <CardDescription>Configure when and how your notification will be sent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="scheduled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Schedule Notification</FormLabel>
                          <FormDescription>Send this notification at a specific date and time</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {watchedValues.scheduled && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="scheduleDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="scheduleTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="silent"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Silent Notification</FormLabel>
                            <FormDescription>Send without sound or vibration</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="autoRemove"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Auto Remove</FormLabel>
                            <FormDescription>Automatically remove notification after interaction</FormDescription>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-2">
                <Button type="button" variant="outline">
                  Save as Draft
                </Button>
                <Button type="submit">{watchedValues.scheduled ? "Schedule Notification" : "Send Now"}</Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Live Preview
              </CardTitle>
              <CardDescription>See how your notification will appear</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Desktop Preview */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">DESKTOP</Label>
                  <div className="mt-2 bg-background border rounded-lg p-4 shadow-lg max-w-sm">
                    <div className="flex items-start gap-3">
                      <img src="/placeholder.svg?height=40&width=40" alt="Icon" className="w-10 h-10 rounded" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm line-clamp-1">
                          {watchedValues.title || "Notification Title"}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {watchedValues.description || "Notification description will appear here"}
                        </div>
                        {selectedWebsite && (
                          <div className="text-xs text-muted-foreground mt-1">{selectedWebsite.domain}</div>
                        )}
                        {selectedButtons.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {selectedButtons.map(
                              (button, index) =>
                                button.text && (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="h-6 px-2 text-xs bg-transparent"
                                  >
                                    {button.text}
                                  </Button>
                                ),
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Preview */}
                <div>
                  <Label className="text-xs font-medium text-muted-foreground">MOBILE</Label>
                  <div className="mt-2 bg-background border rounded-lg p-3 shadow-lg">
                    <div className="flex items-start gap-2">
                      <img src="/placeholder.svg?height=32&width=32" alt="Icon" className="w-8 h-8 rounded" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm line-clamp-1">
                          {watchedValues.title || "Notification Title"}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {watchedValues.description || "Notification description"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Settings Summary */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">SETTINGS</Label>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span>Priority:</span>
                      <Badge variant="outline" className="text-xs">
                        {watchedValues.priority || "normal"}
                      </Badge>
                    </div>
                    {watchedValues.scheduled && (
                      <div className="flex items-center justify-between text-xs">
                        <span>Scheduled:</span>
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="w-3 h-3 mr-1" />
                          Yes
                        </Badge>
                      </div>
                    )}
                    {watchedValues.silent && (
                      <div className="flex items-center justify-between text-xs">
                        <span>Silent:</span>
                        <Badge variant="outline" className="text-xs">
                          Yes
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
