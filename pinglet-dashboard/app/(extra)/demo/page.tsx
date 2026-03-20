"use client"

import { useState, useCallback } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Bell, Sparkles, SendHorizontal, RotateCcw, Plus, Trash2, Copy, Check,
  Monitor, Smartphone, Layers, Image, Video, Volume2, Code2,
  ChevronDown, ChevronUp, Zap, Eye
} from "lucide-react"
import { API } from "@/lib/api/handler"
import { __config } from "@/constants/config"
import { DEFAULT_IMAGE } from "@/lib/utils"
import { showToast } from "@/components/brand-toaster/toastContainer"

// ─── Notification Types ────────────────────────────────────────────────────────
const NOTIFICATION_TYPES = [
  {
    id: "-1",
    label: "Browser Push",
    icon: Smartphone,
    description: "Native OS push notification via service worker. Works even if the tab is closed.",
    badge: "OS Level",
    color: "from-blue-600 to-cyan-500",
    gradient: "bg-gradient-to-br from-blue-600/10 to-cyan-500/10 border-blue-500/20",
  },
  {
    id: "0",
    label: "In-Tab Toast",
    icon: Monitor,
    description: "Custom styled toast notification inside open browser tabs.",
    badge: "Live",
    color: "from-purple-600 to-pink-500",
    gradient: "bg-gradient-to-br from-purple-600/10 to-pink-500/10 border-purple-500/20",
  },
  {
    id: "1",
    label: "Custom Template",
    icon: Code2,
    description: "Server-rendered HTML template with custom variables and branding.",
    badge: "Template",
    color: "from-amber-500 to-orange-500",
    gradient: "bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20",
  },
  {
    id: "2",
    label: "Glassmorphism",
    icon: Layers,
    description: "Modern glassmorphism card with rich media, buttons, and tag dedup.",
    badge: "New",
    color: "from-emerald-500 to-teal-500",
    gradient: "bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
  },
]

// ─── Form Schema ────────────────────────────────────────────────────────────────
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  pushIcon: z.string().optional(),
  pushImage: z.string().optional(),
  pushUrl: z.string().optional(),
  requireInteraction: z.boolean().optional(),
  mediaType: z.string().optional(),
  mediaSrc: z.string().optional(),
  bodyIcon: z.string().optional(),
  bodyLogo: z.string().optional(),
  bodyUrl: z.string().optional(),
  templateId: z.string().optional(),
  variant: z.string().optional(),
  tag: z.string().optional(),
  buttons: z.array(
    z.object({
      text: z.string().min(1, "Required"),
      action: z.string().min(1, "Required"),
      src: z.string().optional(),
      event: z.string().optional(),
      eventData: z.string().optional(),
    })
  ).max(3),
})

type FormValues = z.infer<typeof formSchema>

const MEDIA_PRESETS: Record<string, string> = {
  image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
  video: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  audio: "http://commondatastorage.googleapis.com/codeskulptor-assets/Evillaugh.ogg",
  iframe: "https://www.youtube.com/embed/dQw4w9WgXcQ",
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function PlaygroundPage() {
  const [selectedType, setSelectedType] = useState("0")
  const [sending, setSending] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showPayload, setShowPayload] = useState(false)

  const PID = __config.APP.APP_ENV === "DEV"
    ? "0e5c2a5f527acdbe13791234"
    : "84d5cbb85cf887d76b55492f"

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      pushIcon: "",
      pushImage: "",
      pushUrl: "",
      requireInteraction: false,
      mediaType: "none",
      mediaSrc: "",
      bodyIcon: "",
      bodyLogo: "",
      bodyUrl: "",
      templateId: "",
      variant: "",
      tag: "",
      buttons: [],
    },
  })

  const { watch, handleSubmit, reset } = form
  const { fields: buttonFields, append, remove } = useFieldArray({ control: form.control, name: "buttons" })
  const watchedButtons = watch("buttons")

  const buildPayload = useCallback((data: FormValues) => {
    const payload: Record<string, any> = { projectId: PID }

    switch (selectedType) {
      case "-1": {
        payload.type = "-1"
        payload.variant = "default"
        payload.data = {
          title: data.title,
          ...(data.description && { description: data.description }),
          icon: data.pushIcon || DEFAULT_IMAGE,
          ...(data.pushImage && { image: data.pushImage }),
          ...(data.requireInteraction && { requireInteraction: true }),
          ...(data.pushUrl && { data: { url: data.pushUrl } }),
        }
        if (data.buttons.length > 0) {
          payload.data.actions = data.buttons.map((b: any) => ({
            text: b.text,
            action: b.action === "close" ? "dismiss" : b.action === "redirect" ? "view" : b.action,
            ...(b.src && { icon: b.src }),
          }))
        }
        break
      }
      case "0": {
        payload.type = "0"
        payload.variant = "default"
        payload.body = {
          title: data.title,
          ...(data.description && { description: data.description }),
          ...(data.bodyIcon && { icon: data.bodyIcon }),
          ...(data.bodyLogo && { logo: data.bodyLogo }),
          ...(data.bodyUrl && { url: data.bodyUrl }),
        }
        if (data.mediaType && data.mediaType !== "none") {
          payload.body.media = {
            type: data.mediaType,
            src: data.mediaSrc || MEDIA_PRESETS[data.mediaType] || DEFAULT_IMAGE,
          }
        }
        if (data.buttons.length > 0) {
          payload.body.buttons = data.buttons.map((b: any) => ({
            text: b.text, action: b.action, ...(b.src && { src: b.src }),
            ...(b.action === "event" && b.event && { event: b.event }),
            ...(b.action === "event" && b.eventData && { data: (() => { try { return JSON.parse(b.eventData) } catch { return b.eventData } })() }),
          }))
        }
        break
      }
      case "1": {
        payload.type = "1"
        payload.template_id = data.templateId || "template-abc"
        payload.variant = data.variant || "default"
        payload.data = { title: data.title, ...(data.description && { description: data.description }) }
        break
      }
      case "2": {
        payload.type = "2"
        if (data.tag) payload.tag = data.tag
        payload.body = {
          title: data.title,
          ...(data.description && { description: data.description }),
          ...(data.bodyIcon && { icon: data.bodyIcon }),
          ...(data.bodyLogo && { logo: data.bodyLogo }),
          ...(data.bodyUrl && { url: data.bodyUrl }),
        }
        if (data.mediaType && data.mediaType !== "none" && data.mediaType !== "icon" && data.mediaType !== "logo") {
          payload.body.media = {
            type: data.mediaType,
            src: data.mediaSrc || MEDIA_PRESETS[data.mediaType] || MEDIA_PRESETS.image,
          }
        }
        if (data.buttons.length > 0) {
          payload.body.buttons = data.buttons.map((b: any) => ({
            text: b.text, action: b.action, ...(b.src && { src: b.src }),
            ...(b.action === "event" && b.event && { event: b.event }),
            ...(b.action === "event" && b.eventData && { data: (() => { try { return JSON.parse(b.eventData) } catch { return b.eventData } })() }),
          }))
        }
        break
      }
    }

    return payload
  }, [selectedType, PID])

  const onSubmit = async (data: FormValues) => {
    setSending(true)
    try {
      const payload = buildPayload(data)
      const res = await API.demoNotification(payload)
      showToast({ title: res.data.message || "Notification sent!", type: "success", duration: 4000 })
    } catch (err: any) {
      showToast({ title: err?.response?.data?.message || "Failed to send", type: "error", duration: 5000 })
    } finally {
      setSending(false)
    }
  }

  const handleCopyPayload = () => {
    const data = form.getValues()
    const payload = buildPayload(data)
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const currentTypeInfo = NOTIFICATION_TYPES.find(t => t.id === selectedType)!
  const maxButtons = selectedType === "-1" ? 2 : 3

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-pink-500/5" />
        <div className="relative max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Interactive Playground
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            Notification Playground
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test all Pinglet notification types in real-time. Configure, preview the payload, and send.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Type Selector */}
        <div className="mb-10">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Choose Notification Type</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {NOTIFICATION_TYPES.map((type) => {
              const Icon = type.icon
              const isActive = selectedType === type.id
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`group relative text-left p-5 rounded-2xl border-2 transition-all duration-300 ${
                    isActive
                      ? `${type.gradient} border-current shadow-lg scale-[1.02]`
                      : "bg-card/50 border-border/50 hover:border-border hover:shadow-md hover:scale-[1.01]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-xl bg-gradient-to-br ${type.color} shadow-md`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <Badge variant={isActive ? "default" : "secondary"} className="text-[10px] px-2 py-0.5">
                      {type.badge}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 text-sm">{type.label}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{type.description}</p>
                  {isActive && (
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-t-full bg-gradient-to-r ${type.color}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* ── Left: Form Fields (3/5) ── */}
              <div className="lg:col-span-3 space-y-6">
                {/* Content Card */}
                <Card className="border-border/50 shadow-sm">
                  <CardContent className="p-6 space-y-5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <Bell className="w-4 h-4 text-primary" />
                      Content
                    </div>
                    <FormField control={form.control} name="title" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title <span className="text-destructive">*</span></FormLabel>
                        <FormControl><Input placeholder="Hello from Pinglet!" className="bg-muted/30" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="description" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea placeholder="Notification body text..." rows={3} className="bg-muted/30 resize-none" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>

                {/* Type -1: Browser Push */}
                {selectedType === "-1" && (
                  <Card className="border-blue-500/20 shadow-sm">
                    <CardContent className="p-6 space-y-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Smartphone className="w-4 h-4 text-blue-500" />
                        Browser Push Options
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="pushIcon" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Icon URL</FormLabel>
                            <FormControl><Input placeholder="https://..." className="bg-muted/30" {...field} /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="pushImage" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl><Input placeholder="https://..." className="bg-muted/30" {...field} /></FormControl>
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="pushUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Click URL</FormLabel>
                          <FormControl><Input placeholder="https://example.com" className="bg-muted/30" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="requireInteraction" render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border border-border/50 p-4">
                          <div>
                            <FormLabel className="mb-0">Require Interaction</FormLabel>
                            <p className="text-xs text-muted-foreground">Won&apos;t auto-dismiss until user clicks</p>
                          </div>
                          <FormControl>
                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                        </FormItem>
                      )} />
                    </CardContent>
                  </Card>
                )}

                {/* Type 0 & 2: In-Tab / Glassmorphism */}
                {(selectedType === "0" || selectedType === "2") && (
                  <Card className={`shadow-sm ${selectedType === "2" ? "border-emerald-500/20" : "border-purple-500/20"}`}>
                    <CardContent className="p-6 space-y-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        {selectedType === "2"
                          ? <Layers className="w-4 h-4 text-emerald-500" />
                          : <Monitor className="w-4 h-4 text-purple-500" />}
                        {selectedType === "2" ? "Glassmorphism Options" : "In-Tab Options"}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="bodyIcon" render={({ field }) => (
                          <FormItem>
                            <FormLabel>{selectedType === "0" ? "Icon (emoji/text)" : "Icon URL"}</FormLabel>
                            <FormControl><Input placeholder={selectedType === "0" ? "🔥 or URL" : "https://..."} className="bg-muted/30" {...field} /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="bodyLogo" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Logo URL</FormLabel>
                            <FormControl><Input placeholder="https://..." className="bg-muted/30" {...field} /></FormControl>
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="bodyUrl" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Click-Through URL</FormLabel>
                          <FormControl><Input placeholder="https://example.com" className="bg-muted/30" {...field} /></FormControl>
                        </FormItem>
                      )} />
                      {selectedType === "2" && (
                        <FormField control={form.control} name="tag" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tag (dedup key)</FormLabel>
                            <FormControl><Input placeholder="promo-summer-2026" className="bg-muted/30" {...field} /></FormControl>
                            <p className="text-xs text-muted-foreground">Same tag replaces the active notification</p>
                          </FormItem>
                        )} />
                      )}

                      {/* Media Selector */}
                      <div className="space-y-3">
                        <FormLabel>Media Attachment</FormLabel>
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                          {[
                            { id: "none", label: "None", icon: "✕" },
                            ...(selectedType === "0" ? [{ id: "icon", label: "Icon", icon: "😀" }] : []),
                            { id: "image", label: "Image", icon: "🖼" },
                            { id: "video", label: "Video", icon: "🎬" },
                            { id: "audio", label: "Audio", icon: "🔊" },
                            { id: "iframe", label: "Iframe", icon: "📄" },
                          ].map(opt => {
                            const isActive = watch("mediaType") === opt.id
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => form.setValue("mediaType", opt.id)}
                                className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-medium transition-all ${
                                  isActive
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border/50 text-muted-foreground hover:border-border"
                                }`}
                              >
                                <span className="text-lg">{opt.icon}</span>
                                {opt.label}
                              </button>
                            )
                          })}
                        </div>
                        {watch("mediaType") !== "none" && watch("mediaType") !== "icon" && watch("mediaType") && (
                          <FormField control={form.control} name="mediaSrc" render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs">Custom Media URL <span className="text-muted-foreground">(leave empty for preset)</span></FormLabel>
                              <FormControl><Input placeholder="https://..." className="bg-muted/30 text-sm" {...field} /></FormControl>
                            </FormItem>
                          )} />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Type 1: Template */}
                {selectedType === "1" && (
                  <Card className="border-amber-500/20 shadow-sm">
                    <CardContent className="p-6 space-y-5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                        <Code2 className="w-4 h-4 text-amber-500" />
                        Template Options
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="templateId" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Template ID <span className="text-destructive">*</span></FormLabel>
                            <FormControl><Input placeholder="template-abc" className="bg-muted/30" {...field} /></FormControl>
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="variant" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Variant</FormLabel>
                            <FormControl><Input placeholder="default" className="bg-muted/30" {...field} /></FormControl>
                          </FormItem>
                        )} />
                      </div>
                      <p className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 border border-border/50">
                        Template rendering uses server-defined HTML/CSS. Title and description are passed as template variables.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons (all types except 1) */}
                {selectedType !== "1" && (
                  <Card className="border-border/50 shadow-sm">
                    <CardContent className="p-6 space-y-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <Sparkles className="w-4 h-4 text-primary" />
                          Action Buttons
                          <span className="text-xs text-muted-foreground font-normal">({buttonFields.length}/{maxButtons})</span>
                        </div>
                        {buttonFields.length < maxButtons && (
                          <Button type="button" variant="outline" size="sm" onClick={() => append({ text: "", action: "close", src: "", event: "", eventData: "" })} className="h-8 text-xs gap-1.5">
                            <Plus className="w-3 h-3" /> Add
                          </Button>
                        )}
                      </div>
                      {buttonFields.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground">
                          <p className="text-sm">No action buttons added</p>
                          <p className="text-xs mt-1">Click &quot;Add&quot; to attach buttons to your notification</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {buttonFields.map((field, index) => (
                            <div key={field.id} className="relative p-4 rounded-xl border border-border/50 bg-muted/20 space-y-3">
                              <button type="button" onClick={() => remove(index)} className="absolute top-3 right-3 p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <div className="grid grid-cols-2 gap-3 pr-8">
                                <FormField control={form.control} name={`buttons.${index}.text`} render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs">Label</FormLabel>
                                    <FormControl><Input placeholder="Click me" className="bg-background h-9 text-sm" {...field} /></FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name={`buttons.${index}.action`} render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs">Action</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                      <FormControl>
                                        <SelectTrigger className="bg-background h-9 text-sm">
                                          <SelectValue placeholder="Action" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {selectedType === "-1" ? (
                                          <>
                                            <SelectItem value="view">View</SelectItem>
                                            <SelectItem value="dismiss">Dismiss</SelectItem>
                                          </>
                                        ) : (
                                          <>
                                            <SelectItem value="redirect">Redirect</SelectItem>
                                            <SelectItem value="link">Link (new tab)</SelectItem>
                                            <SelectItem value="close">Close</SelectItem>
                                            <SelectItem value="alert">Alert</SelectItem>
                                            <SelectItem value="reload">Reload</SelectItem>
                                            <SelectItem value="event">Event</SelectItem>
                                          </>
                                        )}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )} />
                              </div>
                              {watchedButtons[index] && ["redirect", "link", "alert", "view"].includes(watchedButtons[index].action) && (
                                <FormField control={form.control} name={`buttons.${index}.src`} render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-xs">
                                      {watchedButtons[index].action === "alert" ? "Alert Message" : "URL"}
                                    </FormLabel>
                                    <FormControl>
                                      <Input placeholder={watchedButtons[index].action === "alert" ? "Hello!" : "https://..."} className="bg-background h-9 text-sm" {...field} />
                                    </FormControl>
                                  </FormItem>
                                )} />
                              )}
                              {watchedButtons[index] && watchedButtons[index].action === "event" && (
                                <div className="space-y-3">
                                  <FormField control={form.control} name={`buttons.${index}.event`} render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-xs">Event Name <span className="text-destructive">*</span></FormLabel>
                                      <FormControl>
                                        <Input placeholder='pinglet:addToCart' className="bg-background h-9 text-sm font-mono" {...field} />
                                      </FormControl>
                                      <p className="text-[10px] text-muted-foreground">The CustomEvent name dispatched on window</p>
                                    </FormItem>
                                  )} />
                                  <FormField control={form.control} name={`buttons.${index}.eventData`} render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-xs">Event Data <span className="text-muted-foreground">(JSON, optional)</span></FormLabel>
                                      <FormControl>
                                        <Textarea
                                          placeholder='{"productId": "SKU-123", "quantity": 1}'
                                          rows={3}
                                          className="bg-background text-sm font-mono resize-none"
                                          {...field}
                                        />
                                      </FormControl>
                                      <p className="text-[10px] text-muted-foreground">Sent as event.detail to your listener</p>
                                    </FormItem>
                                  )} />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* ── Right: Payload Preview + Actions (2/5) ── */}
              <div className="lg:col-span-2 space-y-6">
                <div className="lg:sticky lg:top-6 space-y-6">
                  {/* Send Card */}
                  <Card className="border-border/50 shadow-sm overflow-hidden">
                    <div className={`h-1.5 bg-gradient-to-r ${currentTypeInfo.color}`} />
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${currentTypeInfo.color}`}>
                          <currentTypeInfo.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{currentTypeInfo.label}</p>
                          <p className="text-xs text-muted-foreground">Ready to send</p>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className={`w-full h-11 gap-2 bg-gradient-to-r ${currentTypeInfo.color} hover:opacity-90 text-white shadow-lg`}
                        disabled={sending}
                      >
                        {sending ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <SendHorizontal className="w-4 h-4" />
                        )}
                        {sending ? "Sending..." : "Send Notification"}
                      </Button>

                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" className="flex-1 text-xs gap-1.5" onClick={() => reset()}>
                          <RotateCcw className="w-3 h-3" /> Reset
                        </Button>
                        <Button type="button" variant="outline" size="sm" className="flex-1 text-xs gap-1.5" onClick={handleCopyPayload}>
                          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          {copied ? "Copied!" : "Copy JSON"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Payload Preview */}
                  <Card className="border-border/50 shadow-sm">
                    <CardContent className="p-0">
                      <button
                        type="button"
                        onClick={() => setShowPayload(!showPayload)}
                        className="w-full flex items-center justify-between p-4 text-sm font-semibold text-foreground hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-primary" />
                          Live Payload Preview
                        </div>
                        {showPayload ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      {showPayload && (
                        <div className="border-t border-border/50">
                          <pre className="p-4 text-xs font-mono overflow-auto max-h-[50vh] bg-[hsl(240,10%,4%)] text-[hsl(0,0%,80%)] rounded-b-xl leading-relaxed">
                            {JSON.stringify(buildPayload(form.getValues()), null, 2)}
                          </pre>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Type Info */}
                  <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Endpoint</p>
                    <code className="block text-xs font-mono text-foreground bg-background/80 px-3 py-2 rounded-lg border border-border/50 break-all">
                      POST /api/v1/notifications/send
                    </code>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Badge variant="outline" className="text-[10px]">Type: {selectedType}</Badge>
                      {selectedType === "-1" && <Badge variant="outline" className="text-[10px]">Service Worker</Badge>}
                      {selectedType === "2" && <Badge variant="outline" className="text-[10px]">Tag Dedup</Badge>}
                      {selectedType === "1" && <Badge variant="outline" className="text-[10px]">Server Rendered</Badge>}
                      <Badge variant="outline" className="text-[10px]">Max {maxButtons} Buttons</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
