"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Copy, Check, Trash2, Plus, Code2, Zap, Bell,
    ChevronDown, ChevronUp, Smartphone, Layers, Monitor, Download,
    SendHorizontal, RotateCcw, ExternalLink
} from "lucide-react"
import Link from "next/link"

// ─── Types ──────────────────────────────────────────────────────────────────────
type NotificationType = "-1" | "0" | "1" | "2"

interface ButtonDef {
    text: string
    action: string
    src?: string
    event?: string
    data?: string
}

interface PayloadState {
    projectId: string
    type: NotificationType
    // Body fields (type 0/2)
    title: string
    description: string
    icon: string
    logo: string
    url: string
    tag: string
    // Media
    mediaType: string
    mediaSrc: string
    // Buttons
    buttons: ButtonDef[]
    // Push fields (type -1)
    pushBody: string
    pushIcon: string
    pushBadge: string
    pushImage: string
    pushTag: string
    pushUrl: string
    requireInteraction: boolean
    silent: boolean
    renotify: boolean
    // Template fields (type 1)
    templateId: string
    customTemplate: string
    // Overrides
    showOverrides: boolean
    position: string
    duration: string
    auto_dismiss: boolean
    transition: string
    maxVisible: string
    themeMode: string
    soundPlay: boolean
    soundSrc: string
    soundVolume: string
    brandingShow: boolean
    brandingHtml: string
    progressBarShow: boolean
    progressBarColor: string
}

const INITIAL_STATE: PayloadState = {
    projectId: "",
    type: "0",
    title: "",
    description: "",
    icon: "",
    logo: "",
    url: "",
    tag: "",
    mediaType: "",
    mediaSrc: "",
    buttons: [],
    pushBody: "",
    pushIcon: "",
    pushBadge: "",
    pushImage: "",
    pushTag: "",
    pushUrl: "",
    requireInteraction: false,
    silent: false,
    renotify: false,
    templateId: "",
    customTemplate: "{}",
    showOverrides: false,
    position: "",
    duration: "",
    auto_dismiss: true,
    transition: "",
    maxVisible: "",
    themeMode: "",
    soundPlay: false,
    soundSrc: "",
    soundVolume: "",
    brandingShow: true,
    brandingHtml: "",
    progressBarShow: true,
    progressBarColor: "",
}

const TYPE_INFO: Record<NotificationType, { label: string; icon: typeof Bell; color: string; desc: string }> = {
    "0": { label: "Glassmorphism", icon: Layers, color: "from-purple-600 to-pink-500", desc: "Frosted-glass card — primary in-app renderer" },
    "2": { label: "Compat Alias", icon: Monitor, color: "from-emerald-500 to-teal-500", desc: "Backward compat — same as Type 0" },
    "-1": { label: "Browser Push", icon: Smartphone, color: "from-blue-600 to-cyan-500", desc: "Native OS notification via service worker" },
    "1": { label: "Custom Template", icon: Code2, color: "from-amber-500 to-orange-500", desc: "Server-stored HTML template with variables" },
}

// ─── Component ──────────────────────────────────────────────────────────────────
export default function PayloadCreatorPage() {
    const [state, setState] = useState<PayloadState>(INITIAL_STATE)
    const [copied, setCopied] = useState<string | null>(null)
    const [outputTab, setOutputTab] = useState("json")

    const set = useCallback(<K extends keyof PayloadState>(key: K, value: PayloadState[K]) => {
        setState(prev => ({ ...prev, [key]: value }))
    }, [])

    const addButton = () => {
        const max = state.type === "-1" ? 2 : 3
        if (state.buttons.length < max) {
            set("buttons", [...state.buttons, { text: "", action: "close", src: "", event: "", data: "" }])
        }
    }

    const removeButton = (idx: number) => {
        set("buttons", state.buttons.filter((_, i) => i !== idx))
    }

    const updateButton = (idx: number, key: keyof ButtonDef, value: string) => {
        const updated = [...state.buttons]
        updated[idx] = { ...updated[idx], [key]: value }
        set("buttons", updated)
    }

    // ─── Build Payload ──────────────────────────────────────────────────────────
    const buildPayload = useCallback(() => {
        const payload: Record<string, unknown> = {
            projectId: state.projectId || "YOUR_PROJECT_ID",
            type: state.type,
        }

        if (state.type === "-1") {
            const data: Record<string, unknown> = {
                title: state.title || "Notification Title",
            }
            if (state.pushBody) data.body = state.pushBody
            if (state.pushIcon) data.icon = state.pushIcon
            if (state.pushBadge) data.badge = state.pushBadge
            if (state.pushImage) data.image = state.pushImage
            if (state.pushTag) data.tag = state.pushTag
            if (state.requireInteraction) data.requireInteraction = true
            if (state.silent) data.silent = true
            if (state.renotify) data.renotify = true
            if (state.pushUrl) data.data = { url: state.pushUrl }
            if (state.buttons.length > 0) {
                data.actions = state.buttons.slice(0, 2).map(b => ({
                    action: b.action,
                    title: b.text,
                    ...(b.src ? { icon: b.src } : {}),
                }))
            }
            payload.data = data
        } else if (state.type === "1") {
            payload.template_id = state.templateId || "TEMPLATE_ID"
            let tmpl: Record<string, unknown> = {}
            try { tmpl = JSON.parse(state.customTemplate || "{}") } catch { tmpl = {} }
            payload.custom_template = tmpl
        } else {
            // Type 0 and 2
            if (state.tag) payload.tag = state.tag
            const body: Record<string, unknown> = {
                title: state.title || "Notification Title",
            }
            if (state.description) body.description = state.description
            if (state.icon) body.icon = state.icon
            if (state.logo) body.logo = state.logo
            if (state.url) body.url = state.url
            if (state.mediaType && state.mediaSrc) {
                body.media = { type: state.mediaType, src: state.mediaSrc }
            }
            if (state.buttons.length > 0) {
                body.buttons = state.buttons.map(b => {
                    const btn: Record<string, unknown> = { text: b.text, action: b.action }
                    if (b.src && ["redirect", "link", "alert"].includes(b.action)) btn.src = b.src
                    if (b.action === "event" && b.event) {
                        btn.event = b.event
                        if (b.data) {
                            try { btn.data = JSON.parse(b.data) } catch { btn.data = b.data }
                        }
                    }
                    return btn
                })
            }
            payload.body = body

            // Overrides
            if (state.showOverrides) {
                const overrides: Record<string, unknown> = {}
                if (state.position) overrides.position = state.position
                if (state.duration) overrides.duration = parseInt(state.duration)
                if (!state.auto_dismiss) overrides.auto_dismiss = false
                if (state.transition) overrides.transition = state.transition
                if (state.maxVisible) overrides.maxVisible = parseInt(state.maxVisible)
                if (state.themeMode) overrides.theme = { mode: state.themeMode }
                if (state.soundPlay) {
                    const sound: Record<string, unknown> = { play: true }
                    if (state.soundSrc) sound.src = state.soundSrc
                    if (state.soundVolume) sound.volume = parseFloat(state.soundVolume)
                    overrides.sound = sound
                }
                if (!state.brandingShow) overrides.branding = { show: false }
                else if (state.brandingHtml) overrides.branding = { show: true, html: state.brandingHtml }
                if (!state.progressBarShow) overrides.progressBar = { show: false }
                else if (state.progressBarColor) overrides.progressBar = { show: true, color: state.progressBarColor }
                if (Object.keys(overrides).length > 0) payload.overrides = overrides
            }
        }

        return payload
    }, [state])

    // ─── Generate cURL ──────────────────────────────────────────────────────────
    const buildCurl = useCallback(() => {
        const payload = buildPayload()
        const json = JSON.stringify(payload, null, 2)
        return `curl -X POST https://pinglet.enjoys.in/api/v1/notifications/send \\\n  -H "Content-Type: application/json" \\\n  -H "X-Project-ID: ${state.projectId || "YOUR_PROJECT_ID"}" \\\n  -d '${json}'`
    }, [buildPayload, state.projectId])

    // ─── Generate fetch() code ──────────────────────────────────────────────────
    const buildFetch = useCallback(() => {
        const payload = buildPayload()
        const json = JSON.stringify(payload, null, 2)
        return `const response = await fetch("https://pinglet.enjoys.in/api/v1/notifications/send", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-Project-ID": "${state.projectId || "YOUR_PROJECT_ID"}",
  },
  body: JSON.stringify(${json}),
});

const result = await response.json();
console.log(result);`
    }, [buildPayload, state.projectId])

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        setCopied(label)
        setTimeout(() => setCopied(null), 2000)
    }

    const jsonPayload = JSON.stringify(buildPayload(), null, 2)
    const maxButtons = state.type === "-1" ? 2 : 3
    const currentInfo = TYPE_INFO[state.type]

    return (
        <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
            {/* Hero */}
            <div className="relative overflow-hidden border-b border-border/40">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-purple-500/5" />
                <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
                        <Code2 className="w-3.5 h-3.5" />
                        Payload Creator
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
                        Notification Payload Builder
                    </h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
                        Visually build your notification payload for any type. Get ready-to-use JSON, cURL, and fetch code.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <Link href="/docs">
                            <Button variant="outline" size="sm" className="rounded-full gap-1.5">
                                <Zap className="w-3.5 h-3.5" /> Docs
                            </Button>
                        </Link>
                        <Link href="/demo">
                            <Button variant="outline" size="sm" className="rounded-full gap-1.5">
                                <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
                    {/* ── Left: Builder Form (3/5) ── */}
                    <div className="xl:col-span-3 space-y-6">
                        {/* Project ID */}
                        <Card className="border-border/50">
                            <CardContent className="p-5">
                                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Project ID</Label>
                                <Input
                                    placeholder="your-24-char-project-id"
                                    value={state.projectId}
                                    onChange={e => set("projectId", e.target.value)}
                                    className="bg-muted/30 font-mono text-sm"
                                    maxLength={24}
                                />
                                <p className="text-[10px] text-muted-foreground mt-1.5">Exactly 24 characters. Found in your Pinglet dashboard.</p>
                            </CardContent>
                        </Card>

                        {/* Type Selector */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            {(Object.entries(TYPE_INFO) as [NotificationType, typeof TYPE_INFO[NotificationType]][]).map(([id, info]) => {
                                const Icon = info.icon
                                const isActive = state.type === id
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => set("type", id)}
                                        className={`text-left p-4 rounded-xl border-2 transition-all ${isActive
                                                ? "border-primary bg-primary/5 shadow-md scale-[1.02]"
                                                : "border-border/50 bg-card/50 hover:border-border hover:shadow-sm"
                                            }`}
                                    >
                                        <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${info.color} mb-2`}>
                                            <Icon className="w-4 h-4 text-white" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-foreground">{info.label}</h3>
                                        <p className="text-[10px] text-muted-foreground mt-0.5">{info.desc}</p>
                                        <Badge variant={isActive ? "default" : "secondary"} className="text-[9px] mt-2 px-1.5 py-0">
                                            Type {id}
                                        </Badge>
                                    </button>
                                )
                            })}
                        </div>

                        {/* ── Type 0 / 2: Glassmorphism Fields ── */}
                        {(state.type === "0" || state.type === "2") && (
                            <div className="space-y-5">
                                {/* Content */}
                                <Card className="border-border/50">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <Bell className="w-4 h-4 text-primary" /> Content
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-0">
                                        <div>
                                            <Label className="text-xs">Title <span className="text-destructive">*</span></Label>
                                            <Input placeholder="Hello from Pinglet!" value={state.title} onChange={e => set("title", e.target.value)} className="bg-muted/30 mt-1" />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Description</Label>
                                            <Textarea placeholder="Notification body..." value={state.description} onChange={e => set("description", e.target.value)} rows={2} className="bg-muted/30 mt-1 resize-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-xs">Icon <span className="text-muted-foreground">(URL, emoji, SVG, base64)</span></Label>
                                                <Input placeholder="🔔 or https://..." value={state.icon} onChange={e => set("icon", e.target.value)} className="bg-muted/30 mt-1" />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Logo URL</Label>
                                                <Input placeholder="https://..." value={state.logo} onChange={e => set("logo", e.target.value)} className="bg-muted/30 mt-1" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-xs">Click-Through URL</Label>
                                                <Input placeholder="https://example.com" value={state.url} onChange={e => set("url", e.target.value)} className="bg-muted/30 mt-1" />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Tag <span className="text-muted-foreground">(dedup key)</span></Label>
                                                <Input placeholder="promo-summer-2026" value={state.tag} onChange={e => set("tag", e.target.value)} className="bg-muted/30 mt-1" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Media */}
                                <Card className="border-border/50">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Media Attachment</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-0">
                                        <div className="grid grid-cols-5 gap-2">
                                            {["", "image", "video", "audio", "iframe"].map(mt => (
                                                <button
                                                    key={mt || "none"}
                                                    type="button"
                                                    onClick={() => set("mediaType", mt)}
                                                    className={`py-2 px-3 rounded-lg border-2 text-xs font-medium transition-all text-center ${state.mediaType === mt ? "border-primary bg-primary/5 text-primary" : "border-border/50 text-muted-foreground hover:border-border"
                                                        }`}
                                                >
                                                    {mt || "None"}
                                                </button>
                                            ))}
                                        </div>
                                        {state.mediaType && (
                                            <div>
                                                <Label className="text-xs">Media Source URL</Label>
                                                <Input placeholder="https://..." value={state.mediaSrc} onChange={e => set("mediaSrc", e.target.value)} className="bg-muted/30 mt-1" />
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Buttons */}
                                <Card className="border-border/50">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm flex items-center gap-2">
                                                Action Buttons <span className="text-xs text-muted-foreground font-normal">({state.buttons.length}/{maxButtons})</span>
                                            </CardTitle>
                                            {state.buttons.length < maxButtons && (
                                                <Button type="button" variant="outline" size="sm" onClick={addButton} className="h-7 text-xs gap-1">
                                                    <Plus className="w-3 h-3" /> Add
                                                </Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-0">
                                        {state.buttons.length === 0 && (
                                            <p className="text-xs text-muted-foreground text-center py-4">No buttons. Click &quot;Add&quot; to attach action buttons.</p>
                                        )}
                                        {state.buttons.map((btn, i) => (
                                            <div key={i} className="p-3 rounded-lg border border-border/50 bg-muted/20 space-y-2 relative">
                                                <button type="button" onClick={() => removeButton(i)} className="absolute top-2 right-2 p-1 rounded text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                                                <div className="grid grid-cols-2 gap-2 pr-8">
                                                    <div>
                                                        <Label className="text-[10px]">Label</Label>
                                                        <Input placeholder="Click me" value={btn.text} onChange={e => updateButton(i, "text", e.target.value)} className="bg-background h-8 text-xs mt-0.5" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-[10px]">Action</Label>
                                                        <Select value={btn.action} onValueChange={v => updateButton(i, "action", v)}>
                                                            <SelectTrigger className="bg-background h-8 text-xs mt-0.5"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="redirect">Redirect (new tab)</SelectItem>
                                                                <SelectItem value="link">Link (same tab)</SelectItem>
                                                                <SelectItem value="close">Close</SelectItem>
                                                                <SelectItem value="reload">Reload</SelectItem>
                                                                <SelectItem value="alert">Alert</SelectItem>
                                                                <SelectItem value="event">Event</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                                {["redirect", "link", "alert"].includes(btn.action) && (
                                                    <div>
                                                        <Label className="text-[10px]">{btn.action === "alert" ? "Alert Message" : "URL"}</Label>
                                                        <Input placeholder={btn.action === "alert" ? "Hello!" : "https://..."} value={btn.src || ""} onChange={e => updateButton(i, "src", e.target.value)} className="bg-background h-8 text-xs mt-0.5" />
                                                    </div>
                                                )}
                                                {btn.action === "event" && (
                                                    <div className="space-y-2">
                                                        <div>
                                                            <Label className="text-[10px]">Event Name <span className="text-destructive">*</span></Label>
                                                            <Input placeholder="pinglet:addToCart" value={btn.event || ""} onChange={e => updateButton(i, "event", e.target.value)} className="bg-background h-8 text-xs font-mono mt-0.5" />
                                                        </div>
                                                        <div>
                                                            <Label className="text-[10px]">Event Data (JSON)</Label>
                                                            <Textarea placeholder='{"productId": "SKU-123"}' value={btn.data || ""} onChange={e => updateButton(i, "data", e.target.value)} rows={2} className="bg-background text-xs font-mono mt-0.5 resize-none" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>

                                {/* Overrides */}
                                <Card className="border-border/50">
                                    <CardHeader className="pb-0">
                                        <button
                                            type="button"
                                            className="w-full flex items-center justify-between"
                                            onClick={() => set("showOverrides", !state.showOverrides)}
                                        >
                                            <CardTitle className="text-sm flex items-center gap-2">
                                                Overrides <Badge variant="secondary" className="text-[9px]">Premium</Badge>
                                            </CardTitle>
                                            {state.showOverrides ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                        </button>
                                    </CardHeader>
                                    {state.showOverrides && (
                                        <CardContent className="space-y-4 pt-4">
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                <div>
                                                    <Label className="text-[10px]">Position</Label>
                                                    <Select value={state.position} onValueChange={v => set("position", v)}>
                                                        <SelectTrigger className="bg-muted/30 h-8 text-xs mt-0.5"><SelectValue placeholder="Default" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="top-right">Top Right</SelectItem>
                                                            <SelectItem value="top-left">Top Left</SelectItem>
                                                            <SelectItem value="bottom-right">Bottom Right</SelectItem>
                                                            <SelectItem value="bottom-left">Bottom Left</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label className="text-[10px]">Duration (ms)</Label>
                                                    <Input placeholder="5000" value={state.duration} onChange={e => set("duration", e.target.value)} className="bg-muted/30 h-8 text-xs mt-0.5" />
                                                </div>
                                                <div>
                                                    <Label className="text-[10px]">Transition</Label>
                                                    <Select value={state.transition} onValueChange={v => set("transition", v)}>
                                                        <SelectTrigger className="bg-muted/30 h-8 text-xs mt-0.5"><SelectValue placeholder="Default" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="fade">Fade</SelectItem>
                                                            <SelectItem value="slide">Slide</SelectItem>
                                                            <SelectItem value="zoom">Zoom</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label className="text-[10px]">Max Visible</Label>
                                                    <Input placeholder="3" value={state.maxVisible} onChange={e => set("maxVisible", e.target.value)} className="bg-muted/30 h-8 text-xs mt-0.5" />
                                                </div>
                                                <div>
                                                    <Label className="text-[10px]">Theme Mode</Label>
                                                    <Select value={state.themeMode} onValueChange={v => set("themeMode", v)}>
                                                        <SelectTrigger className="bg-muted/30 h-8 text-xs mt-0.5"><SelectValue placeholder="Auto" /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="auto">Auto</SelectItem>
                                                            <SelectItem value="light">Light</SelectItem>
                                                            <SelectItem value="dark">Dark</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label className="text-[10px]">Progress Bar Color</Label>
                                                    <Input placeholder="#4da6ff" value={state.progressBarColor} onChange={e => set("progressBarColor", e.target.value)} className="bg-muted/30 h-8 text-xs mt-0.5" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                                                <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                                                    <Label className="text-[10px]">Auto Dismiss</Label>
                                                    <Switch checked={state.auto_dismiss} onCheckedChange={v => set("auto_dismiss", v)} />
                                                </div>
                                                <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                                                    <Label className="text-[10px]">Sound</Label>
                                                    <Switch checked={state.soundPlay} onCheckedChange={v => set("soundPlay", v)} />
                                                </div>
                                                <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                                                    <Label className="text-[10px]">Branding</Label>
                                                    <Switch checked={state.brandingShow} onCheckedChange={v => set("brandingShow", v)} />
                                                </div>
                                                <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                                                    <Label className="text-[10px]">Progress Bar</Label>
                                                    <Switch checked={state.progressBarShow} onCheckedChange={v => set("progressBarShow", v)} />
                                                </div>
                                            </div>
                                            {state.soundPlay && (
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <Label className="text-[10px]">Sound URL</Label>
                                                        <Input placeholder="https://..." value={state.soundSrc} onChange={e => set("soundSrc", e.target.value)} className="bg-muted/30 h-8 text-xs mt-0.5" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-[10px]">Volume (0-1)</Label>
                                                        <Input placeholder="0.5" value={state.soundVolume} onChange={e => set("soundVolume", e.target.value)} className="bg-muted/30 h-8 text-xs mt-0.5" />
                                                    </div>
                                                </div>
                                            )}
                                            {state.brandingShow && (
                                                <div>
                                                    <Label className="text-[10px]">Custom Branding HTML</Label>
                                                    <Input placeholder='Powered by <b>Enjoys</b>' value={state.brandingHtml} onChange={e => set("brandingHtml", e.target.value)} className="bg-muted/30 h-8 text-xs mt-0.5" />
                                                </div>
                                            )}
                                        </CardContent>
                                    )}
                                </Card>
                            </div>
                        )}

                        {/* ── Type -1: Browser Push Fields ── */}
                        {state.type === "-1" && (
                            <div className="space-y-5">
                                <Card className="border-blue-500/20">
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <Smartphone className="w-4 h-4 text-blue-500" /> Browser Push Content
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4 pt-0">
                                        <div>
                                            <Label className="text-xs">Title <span className="text-destructive">*</span></Label>
                                            <Input placeholder="Order Shipped" value={state.title} onChange={e => set("title", e.target.value)} className="bg-muted/30 mt-1" />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Body</Label>
                                            <Textarea placeholder="Your package is on the way." value={state.pushBody} onChange={e => set("pushBody", e.target.value)} rows={2} className="bg-muted/30 mt-1 resize-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-xs">Icon URL</Label>
                                                <Input placeholder="https://icon.png" value={state.pushIcon} onChange={e => set("pushIcon", e.target.value)} className="bg-muted/30 mt-1" />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Badge URL</Label>
                                                <Input placeholder="https://badge.png" value={state.pushBadge} onChange={e => set("pushBadge", e.target.value)} className="bg-muted/30 mt-1" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-xs">Image URL</Label>
                                                <Input placeholder="https://hero.jpg" value={state.pushImage} onChange={e => set("pushImage", e.target.value)} className="bg-muted/30 mt-1" />
                                            </div>
                                            <div>
                                                <Label className="text-xs">Tag (dedup)</Label>
                                                <Input placeholder="order-123" value={state.pushTag} onChange={e => set("pushTag", e.target.value)} className="bg-muted/30 mt-1" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-xs">Click URL</Label>
                                            <Input placeholder="https://example.com/track/123" value={state.pushUrl} onChange={e => set("pushUrl", e.target.value)} className="bg-muted/30 mt-1" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                                                <Label className="text-[10px]">Require Interaction</Label>
                                                <Switch checked={state.requireInteraction} onCheckedChange={v => set("requireInteraction", v)} />
                                            </div>
                                            <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                                                <Label className="text-[10px]">Silent</Label>
                                                <Switch checked={state.silent} onCheckedChange={v => set("silent", v)} />
                                            </div>
                                            <div className="flex items-center justify-between rounded-lg border border-border/50 px-3 py-2">
                                                <Label className="text-[10px]">Renotify</Label>
                                                <Switch checked={state.renotify} onCheckedChange={v => set("renotify", v)} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Push Buttons */}
                                <Card className="border-blue-500/20">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-sm">Actions <span className="text-xs text-muted-foreground font-normal">(max 2 — browser limit)</span></CardTitle>
                                            {state.buttons.length < 2 && (
                                                <Button type="button" variant="outline" size="sm" onClick={addButton} className="h-7 text-xs gap-1"><Plus className="w-3 h-3" /> Add</Button>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 pt-0">
                                        {state.buttons.map((btn, i) => (
                                            <div key={i} className="p-3 rounded-lg border border-border/50 bg-muted/20 relative">
                                                <button type="button" onClick={() => removeButton(i)} className="absolute top-2 right-2 p-1 rounded text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                                                <div className="grid grid-cols-2 gap-2 pr-8">
                                                    <div>
                                                        <Label className="text-[10px]">Title</Label>
                                                        <Input placeholder="View Order" value={btn.text} onChange={e => updateButton(i, "text", e.target.value)} className="bg-background h-8 text-xs mt-0.5" />
                                                    </div>
                                                    <div>
                                                        <Label className="text-[10px]">Action</Label>
                                                        <Select value={btn.action} onValueChange={v => updateButton(i, "action", v)}>
                                                            <SelectTrigger className="bg-background h-8 text-xs mt-0.5"><SelectValue /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="view">View</SelectItem>
                                                                <SelectItem value="dismiss">Dismiss</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* ── Type 1: Template Fields ── */}
                        {state.type === "1" && (
                            <Card className="border-amber-500/20">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Code2 className="w-4 h-4 text-amber-500" /> Template
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4 pt-0">
                                    <div>
                                        <Label className="text-xs">Template ID <span className="text-destructive">*</span></Label>
                                        <Input placeholder="42" value={state.templateId} onChange={e => set("templateId", e.target.value)} className="bg-muted/30 mt-1 font-mono" />
                                    </div>
                                    <div>
                                        <Label className="text-xs">Custom Template (JSON) <span className="text-destructive">*</span></Label>
                                        <Textarea
                                            placeholder={'{\n  "user_name": "John Doe",\n  "order_total": "$49.99"\n}'}
                                            value={state.customTemplate}
                                            onChange={e => set("customTemplate", e.target.value)}
                                            rows={6}
                                            className="bg-muted/30 mt-1 font-mono text-xs resize-none"
                                        />
                                        <p className="text-[10px] text-muted-foreground mt-1">Key-value object — shape depends on your template definition.</p>
                                    </div>
                                    <div className="rounded-lg bg-amber-500/5 border border-amber-500/20 p-3">
                                        <p className="text-[10px] text-muted-foreground">
                                            <strong className="text-foreground">Note:</strong> Type 1 must NOT include body or data fields. The template_id must reference an existing template in your dashboard.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* ── Right: Output Panel (2/5) ── */}
                    <div className="xl:col-span-2">
                        <div className="xl:sticky xl:top-6 space-y-4">
                            {/* Type Badge */}
                            <div className="flex items-center gap-3 pb-2">
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${currentInfo.color}`}>
                                    <currentInfo.icon className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">{currentInfo.label}</p>
                                    <p className="text-[10px] text-muted-foreground">Type {state.type}</p>
                                </div>
                            </div>

                            {/* Output Tabs */}
                            <Card className="border-border/50 overflow-hidden">
                                <div className={`h-1 bg-gradient-to-r ${currentInfo.color}`} />
                                <CardContent className="p-0">
                                    <Tabs value={outputTab} onValueChange={setOutputTab}>
                                        <TabsList className="w-full rounded-none border-b border-border/50 bg-muted/30 p-0.5">
                                            <TabsTrigger value="json" className="rounded-lg text-xs flex-1 data-[state=active]:bg-background">JSON</TabsTrigger>
                                            <TabsTrigger value="curl" className="rounded-lg text-xs flex-1 data-[state=active]:bg-background">cURL</TabsTrigger>
                                            <TabsTrigger value="fetch" className="rounded-lg text-xs flex-1 data-[state=active]:bg-background">fetch()</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="json" className="mt-0">
                                            <div className="relative">
                                                <button
                                                    onClick={() => copyToClipboard(jsonPayload, "json")}
                                                    className="absolute top-2 right-2 p-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all z-10"
                                                >
                                                    {copied === "json" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                                <pre className="p-4 text-xs font-mono overflow-auto max-h-[60vh] bg-[hsl(240,10%,4%)] text-[hsl(0,0%,80%)] leading-relaxed">
                                                    {jsonPayload}
                                                </pre>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="curl" className="mt-0">
                                            <div className="relative">
                                                <button
                                                    onClick={() => copyToClipboard(buildCurl(), "curl")}
                                                    className="absolute top-2 right-2 p-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all z-10"
                                                >
                                                    {copied === "curl" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                                <pre className="p-4 text-xs font-mono overflow-auto max-h-[60vh] bg-[hsl(240,10%,4%)] text-[hsl(0,0%,80%)] leading-relaxed whitespace-pre-wrap">
                                                    {buildCurl()}
                                                </pre>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="fetch" className="mt-0">
                                            <div className="relative">
                                                <button
                                                    onClick={() => copyToClipboard(buildFetch(), "fetch")}
                                                    className="absolute top-2 right-2 p-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all z-10"
                                                >
                                                    {copied === "fetch" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                                <pre className="p-4 text-xs font-mono overflow-auto max-h-[60vh] bg-[hsl(240,10%,4%)] text-[hsl(0,0%,80%)] leading-relaxed whitespace-pre-wrap">
                                                    {buildFetch()}
                                                </pre>
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs gap-1.5"
                                    onClick={() => copyToClipboard(jsonPayload, "json-btn")}
                                >
                                    {copied === "json-btn" ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                    {copied === "json-btn" ? "Copied!" : "Copy JSON"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-xs gap-1.5"
                                    onClick={() => {
                                        const blob = new Blob([jsonPayload], { type: "application/json" })
                                        const url = URL.createObjectURL(blob)
                                        const a = document.createElement("a")
                                        a.href = url
                                        a.download = `pinglet-payload-type${state.type}.json`
                                        a.click()
                                        URL.revokeObjectURL(url)
                                    }}
                                >
                                    <Download className="w-3 h-3" /> Download
                                </Button>
                                <Button type="button" variant="outline" size="sm" className="text-xs gap-1.5" onClick={() => setState(INITIAL_STATE)}>
                                    <RotateCcw className="w-3 h-3" />
                                </Button>
                            </div>

                            {/* Quick hints */}
                            <div className="rounded-xl border border-border/50 bg-muted/30 p-4 space-y-2">
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Quick Reference</p>
                                <div className="space-y-1.5 text-[10px] text-muted-foreground">
                                    {state.type === "0" || state.type === "2" ? (
                                        <>
                                            <p>• <strong>body.title</strong> is required (min 3 chars)</p>
                                            <p>• <strong>icon</strong> accepts URL, emoji, SVG, or base64</p>
                                            <p>• <strong>media.type:</strong> image | video | audio | iframe</p>
                                            <p>• <strong>buttons:</strong> max 3, actions: redirect | link | close | reload | alert | event</p>
                                            <p>• <strong>tag:</strong> same tag replaces existing notification</p>
                                            <p>• <strong>overrides:</strong> premium projects only (is_tff flag)</p>
                                        </>
                                    ) : state.type === "-1" ? (
                                        <>
                                            <p>• Uses <strong>data</strong> field (not body)</p>
                                            <p>• <strong>data.title:</strong> required (1-100 chars)</p>
                                            <p>• <strong>actions:</strong> max 2 (browser limitation)</p>
                                            <p>• Queued via BullMQ on backend (not SSE)</p>
                                            <p>• Requires push permission from user</p>
                                        </>
                                    ) : (
                                        <>
                                            <p>• <strong>template_id</strong> + <strong>custom_template</strong> are required</p>
                                            <p>• Must NOT include body or data fields</p>
                                            <p>• Template must exist in your dashboard</p>
                                            <p>• custom_template shape depends on template definition</p>
                                        </>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-1.5 border-t border-border/30">
                                    <Badge variant="outline" className="text-[9px]">Type: {state.type}</Badge>
                                    <Badge variant="outline" className="text-[9px]">SDK v0.0.3</Badge>
                                    <Badge variant="outline" className="text-[9px]">Rate: 30 req/min</Badge>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
