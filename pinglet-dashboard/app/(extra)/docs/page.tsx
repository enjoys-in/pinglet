"use client";
import React, { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check, BookOpen, Send, Code2, ChevronLeft, Zap } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const examples = {
    "-1": {
        label: "Browser Push",
        tag: "Upcoming",
        description:
            "Triggers native browser push notifications. Works even if the browser/tab is closed (requires service worker).",
        endpoint: "https://pinglet.enjoys.in/api/v1/notifications/send",
        method: "POST",
        headers: {
            "x-project-id": "your-project-id",
            "x-pinglet-version": "1.0.5",
        },
        request: {
            project_id: "your-project-id",
            type: -1,
            variant: "default",
            data: {
                title: "Pinglet Alert",
                description: "Browser Push is active!",
                actions: [{ text: "Dismiss", action: "close" }],
            },
        },
        response: {
            message: "OK",
            result: "Notification Sent",
            success: true,
            "X-API-PLATFORM STATUS": "OK",
        },
        schema: [
            { name: "project_id", type: "string", required: true, desc: "Your project unique ID" },
            { name: "type", type: "number", required: true, desc: "Set to -1 for browser push" },
            { name: "variant", type: "string", required: false, desc: '"default"' },
            { name: "data.title", type: "string", required: true, desc: "Notification title" },
            { name: "data.description", type: "string", required: false, desc: "Notification body text" },
            { name: "data.badge", type: "string", required: false, desc: "Badge URL" },
            { name: "data.icon", type: "string", required: true, desc: "Icon URL" },
            { name: "data.image", type: "string", required: false, desc: "Image URL" },
            { name: "data.timestamp", type: "number", required: false, desc: "Milliseconds timestamp" },
            { name: "data.requireInteraction", type: "boolean", required: false, desc: "Require user click to dismiss" },
            { name: "data.vibrate", type: "number[]", required: false, desc: "Vibration pattern e.g. [200, 100, 200]" },
            { name: "data.data", type: "object", required: false, desc: "Payload sent to client-side handler" },
            { name: "data.data.duration", type: "number", required: false, desc: "Auto dismiss after ms" },
            { name: "data.data.url", type: "string", required: false, desc: "Open URL on click" },
            { name: "data.data.func", type: "string", required: false, desc: "Custom function as string" },
            { name: "data.data.payload", type: "object", required: false, desc: "Custom payload for func" },
            { name: "data.actions[]", type: "array", required: false, desc: "Action buttons" },
            { name: "data.actions[].text", type: "string", required: true, desc: "Button label" },
            { name: "data.actions[].action", type: "string", required: true, desc: '"view" | "dismiss" | custom event name' },
            { name: "data.actions[].icon", type: "string", required: false, desc: "Button icon URL" },
            { name: "data.actions[].data", type: "any", required: false, desc: "Custom event data" },
        ],
    },
    "0": {
        label: "In-Tab",
        tag: "Live",
        description:
            "Custom styled notifications shown inside open tabs. No service worker needed.",
        endpoint: "https://pinglet.enjoys.in/api/v1/notifications/send",
        method: "POST",
        headers: {
            "x-project-id": "your-project-id",
            "x-pinglet-version": "1.0.5",
        },
        request: {
            project_id: "your-project-id",
            type: 0,
            variant: "default",
            body: {
                title: "Hello from Pinglet",
                description: "New design incoming!",
                media: { type: "icon", src: "\uD83D\uDD25" },
                buttons: [
                    { text: "Fix Now", action: "link", src: "https://example.com/action" },
                    { text: "Dismiss", action: "close" },
                ],
            },
            overrides: { auto_dismiss: false },
        },
        response: {
            message: "OK",
            result: "Notification Sent",
            success: true,
            "X-API-PLATFORM STATUS": "OK",
        },
        schema: [
            { name: "project_id", type: "string", required: true, desc: "Your project unique ID" },
            { name: "type", type: "number", required: true, desc: "Set to 0 for in-tab" },
            { name: "variant", type: "string", required: false, desc: '"default"' },
            { name: "body.title", type: "string", required: true, desc: "Notification title" },
            { name: "body.description", type: "string", required: false, desc: "Notification body" },
            { name: "body.icon", type: "string", required: false, desc: "Emoji / text / SVG / base64" },
            { name: "body.logo", type: "string", required: false, desc: "URL or base64" },
            { name: "body.url", type: "string", required: false, desc: "Open URL on click" },
            { name: "body.media.type", type: "string", required: false, desc: '"image" | "audio" | "video" | "iframe"' },
            { name: "body.media.src", type: "string", required: false, desc: "Must be a valid URL" },
            { name: "body.buttons[]", type: "array", required: false, desc: "Action buttons" },
            { name: "body.buttons[].text", type: "string", required: true, desc: "Button label" },
            { name: "body.buttons[].action", type: "string", required: true, desc: '"reload" | "close" | "redirect" | "link" | "alert" | "event"' },
            { name: "body.buttons[].src", type: "string", required: false, desc: "URL or message for redirect/link/alert" },
            { name: "body.buttons[].event", type: "string", required: false, desc: 'Event name (when action="event")' },
            { name: "body.buttons[].data", type: "any", required: false, desc: "Custom event data" },
            { name: "overrides.position", type: "string", required: false, desc: '"top-right" | "top-left" | "bottom-right" | "bottom-left"' },
            { name: "overrides.transition", type: "string", required: false, desc: '"fade" | "slide" | "zoom"' },
            { name: "overrides.duration", type: "number", required: false, desc: "Auto dismiss after ms" },
            { name: "overrides.auto_dismiss", type: "boolean", required: false, desc: "Enable auto dismiss" },
            { name: "overrides.maxVisible", type: "number", required: false, desc: "Max visible notifications" },
            { name: "overrides.stacking", type: "boolean", required: false, desc: "Stack multiple notifications" },
            { name: "overrides.dismissible", type: "boolean", required: false, desc: "Allow manual dismiss" },
            { name: "overrides.pauseOnHover", type: "boolean", required: false, desc: "Pause timer on hover" },
            { name: "overrides.sound.play", type: "boolean", required: false, desc: "Play notification sound" },
            { name: "overrides.sound.src", type: "string", required: false, desc: "Sound URL" },
            { name: "overrides.sound.volume", type: "number", required: false, desc: "0 to 1" },
            { name: "overrides.branding.show", type: "boolean", required: false, desc: "Show branding" },
            { name: "overrides.branding.once", type: "boolean", required: false, desc: "Show only once" },
            { name: "overrides.branding.html", type: "string", required: false, desc: "Custom branding HTML" },
            { name: "overrides.theme.mode", type: "string", required: false, desc: '"light" | "dark" | "auto"' },
            { name: "overrides.theme.customClass", type: "string", required: false, desc: "Custom CSS class" },
            { name: "overrides.theme.rounded", type: "boolean", required: false, desc: "Rounded corners" },
            { name: "overrides.theme.shadow", type: "boolean", required: false, desc: "Drop shadow" },
            { name: "overrides.theme.border", type: "boolean", required: false, desc: "Show border" },
            { name: "overrides.progressBar.show", type: "boolean", required: false, desc: "Show progress bar" },
            { name: "overrides.progressBar.color", type: "string", required: false, desc: "Hex/RGB color" },
            { name: "overrides.progressBar.height", type: "number", required: false, desc: "Height in px" },
            { name: "overrides.iconDefaults.show", type: "boolean", required: false, desc: "Show icon" },
            { name: "overrides.iconDefaults.size", type: "number", required: false, desc: "Icon size in px" },
            { name: "overrides.iconDefaults.position", type: "string", required: false, desc: '"left" | "right" | "top"' },
            { name: "overrides.website", type: "string", required: false, desc: "Target website URL" },
            { name: "overrides.time", type: "boolean", required: false, desc: "Show timestamp" },
            { name: "overrides.favicon", type: "boolean", required: false, desc: "Show favicon" },
        ],
    },
    "1": {
        label: "Custom Template",
        tag: "Upcoming",
        description:
            "Fully custom template with HTML, CSS, and variables. Perfect for SaaS branding and marketing.",
        endpoint: "https://pinglet.enjoys.in/api/v1/notifications/send",
        method: "POST",
        headers: {
            "x-project-id": "your-project-id",
            "x-pinglet-version": "1.0.0",
        },
        request: {
            project_id: "your-project-id",
            template_id: "template-abc",
            type: 1,
            variant: "promo",
            data: {
                title: "Welcome to Pinglet",
            },
        },
        response: {
            message: "OK",
            result: "Notification Sent",
            success: true,
            "X-API-PLATFORM STATUS": "OK",
        },
        schema: [
            { name: "project_id", type: "string", required: true, desc: "Your project unique ID" },
            { name: "template_id", type: "string", required: true, desc: "Template ID to render" },
            { name: "type", type: "number", required: true, desc: "Set to 1 for custom" },
            { name: "variant", type: "string", required: false, desc: "Template variant name" },
            { name: "data", type: "object", required: false, desc: "Variables used inside the template" },
        ],
    },
    "2": {
        label: "Glassmorphism HTML",
        tag: "Live",
        description:
            "Modern glassmorphism card notification rendered as an HTML overlay. Supports rich media, action buttons, tag-based deduplication, and config overrides.",
        endpoint: "https://pinglet.enjoys.in/api/v1/notifications/send",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Project-ID": "your-project-id",
            "X-Pinglet-Id": "your-pinglet-id",
        },
        request: {
            projectId: "your-project-id",
            type: "2",
            tag: "promo-summer-2026",
            body: {
                title: "Summer Sale — Upgrade Now",
                description:
                    "Get 60% off Professional plan for a limited time. Includes analytics, webhooks, and priority support.",
                icon: "https://cdn.example.com/icons/sale.png",
                logo: "https://pinglet.enjoys.in/logo-full.png",
                url: "https://pinglet.enjoys.in/pricing?promo=summer2026",
                media: {
                    type: "image",
                    src: "https://cdn.example.com/banners/summer-sale.jpg",
                },
                buttons: [
                    { text: "Upgrade Now", action: "redirect", src: "https://pinglet.enjoys.in/pricing?promo=summer2026" },
                    { text: "Learn More", action: "link", src: "https://pinglet.enjoys.in/blog/summer-sale" },
                    { text: "Not Now", action: "close" },
                ],
            },
        },
        response: {
            message: "OK",
            result: "Notification Sent",
            success: true,
            "X-API-PLATFORM STATUS": "OK",
        },
        schema: [
            { name: "projectId", type: "string", required: true, desc: "Your project unique ID (exactly 24 characters)" },
            { name: "type", type: "string", required: true, desc: 'Set to "2" for glassmorphism HTML' },
            { name: "tag", type: "string", required: false, desc: "Dedup key — replaces existing notification with same tag" },
            { name: "body.title", type: "string", required: true, desc: "Notification title (min 3 characters)" },
            { name: "body.description", type: "string", required: false, desc: "Notification body text" },
            { name: "body.icon", type: "string", required: false, desc: "URL or base64 for small icon (top-left)" },
            { name: "body.logo", type: "string", required: false, desc: "URL or base64, used as fallback if no icon" },
            { name: "body.url", type: "string", required: false, desc: "Click-through URL when user clicks the notification body" },
            { name: "body.media.type", type: "string", required: false, desc: '"image" | "video" | "audio" | "iframe"' },
            { name: "body.media.src", type: "string", required: false, desc: "Valid http/https URL for the media" },
            { name: "body.buttons[]", type: "array", required: false, desc: "Action buttons (max 3)" },
            { name: "body.buttons[].text", type: "string", required: true, desc: "Button label" },
            { name: "body.buttons[].action", type: "string", required: true, desc: '"redirect" | "link" | "alert" | "event" | "reload" | "close" | "onClick"' },
            { name: "body.buttons[].src", type: "string", required: false, desc: "URL for redirect/link, or message for alert" },
            { name: "body.buttons[].event", type: "string", required: false, desc: 'Event name (when action="event")' },
            { name: "body.buttons[].onClick", type: "string", required: false, desc: 'JS function name (when action="onClick")' },
            { name: "overrides.position", type: "string", required: false, desc: '"top-right" | "top-left" | "bottom-right" | "bottom-left"' },
            { name: "overrides.duration", type: "number", required: false, desc: "Auto-close timer in milliseconds" },
            { name: "overrides.auto_dismiss", type: "boolean", required: false, desc: "If false, stays until manually closed" },
            { name: "overrides.sound.play", type: "boolean", required: false, desc: "Play notification sound on arrival" },
            { name: "overrides.sound.src", type: "string", required: false, desc: "Sound URL" },
            { name: "overrides.sound.volume", type: "number", required: false, desc: "Volume 0 to 1" },
            { name: "overrides.theme.mode", type: "string", required: false, desc: '"light" | "dark" | "auto"' },
        ],
    },
};

type ExampleKey = keyof typeof examples;

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <div className="relative group">
            <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-1.5 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-all z-10"
            >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <pre className="bg-[hsl(240,10%,6%)] text-[hsl(0,0%,85%)] p-4 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-border/30">
                {lang && <span className="text-muted-foreground/50 text-[10px] uppercase tracking-wider block mb-2">{lang}</span>}
                {code}
            </pre>
        </div>
    );
}

const PingletApiUsage = () => {
    const [activeTab, setActiveTab] = useState<ExampleKey | "events">("0");
    const params = useParams();
    const projectId = params?.project_id;

    return (
        <div className="space-y-6">
            {/* Back + Header */}
            <div>
                <Link href={`/u/projects/${projectId}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Project
                </Link>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">API Documentation</h1>
                        <p className="text-sm text-muted-foreground">Send notifications via the Pinglet API</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ExampleKey | "events")} className="w-full">
                <TabsList className="bg-muted/50 border border-border/50 p-1 rounded-xl">
                    {(Object.entries(examples) as [ExampleKey, typeof examples[ExampleKey]][]).map(([key, val]) => (
                        <TabsTrigger
                            key={key}
                            value={key}
                            className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm gap-2"
                        >
                            {val.label}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                val.tag === "Live"
                                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                            }`}>
                                {val.tag}
                            </span>
                        </TabsTrigger>
                    ))}
                    <TabsTrigger
                        value="events"
                        className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm gap-2"
                    >
                        Custom Events
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            Guide
                        </span>
                    </TabsTrigger>
                </TabsList>

                {(Object.entries(examples) as [ExampleKey, typeof examples[ExampleKey]][]).map(([key, val]) => (
                    <TabsContent key={key} value={key} className="mt-6 space-y-6">
                        {/* Description card */}
                        <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                                    <Zap className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-foreground">{val.label}</h2>
                                    <p className="text-sm text-muted-foreground mt-1">{val.description}</p>
                                </div>
                            </div>

                            {/* Endpoint */}
                            <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-4 py-2.5 border border-border/50">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                                    {val.method}
                                </span>
                                <code className="text-sm font-mono text-foreground break-all">{val.endpoint}</code>
                            </div>
                        </div>

                        {/* Headers + Request + Response */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left: Headers + Request */}
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Code2 className="w-4 h-4 text-primary" />
                                        <h3 className="text-sm font-semibold text-foreground">Headers</h3>
                                    </div>
                                    <CodeBlock code={JSON.stringify(val.headers, null, 2)} lang="json" />
                                </div>

                                <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Send className="w-4 h-4 text-primary" />
                                            <h3 className="text-sm font-semibold text-foreground">Request Body</h3>
                                        </div>
                                    </div>
                                    <CodeBlock code={JSON.stringify(val.request, null, 2)} lang="json" />
                                </div>

                                <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-emerald-500" />
                                        <h3 className="text-sm font-semibold text-foreground">Response</h3>
                                    </div>
                                    <CodeBlock code={JSON.stringify(val.response, null, 2)} lang="json" />
                                </div>
                            </div>

                            {/* Right: Schema */}
                            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-semibold text-foreground">Request Schema</h3>
                                </div>
                                <div className="space-y-0 divide-y divide-border/40 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
                                    {val.schema.map((field, i) => (
                                        <div key={i} className="py-3 first:pt-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <code className="text-xs font-mono font-medium text-foreground">{field.name}</code>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{field.type}</span>
                                                {field.required && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 font-medium">required</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{field.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                ))}

                {/* ── Custom Events Guide ── */}
                <TabsContent value="events" className="mt-6 space-y-6">
                    {/* Overview */}
                    <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-blue-500/10 shrink-0">
                                <Zap className="w-4 h-4 text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-foreground">Custom Event Button Action</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Trigger real DOM CustomEvents on the user&apos;s browser when they click a notification button.
                                    Your frontend JavaScript listens for the event and executes any logic — add to cart, open modal,
                                    track conversion, navigate, and more.
                                </p>
                            </div>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-4 border border-border/50 text-xs font-mono leading-relaxed text-muted-foreground">
                            <span className="text-foreground font-semibold block mb-2">How It Works:</span>
                            1. Backend sends notification with button → action: &quot;event&quot;<br />
                            2. SDK renders notification → User clicks button<br />
                            3. SDK fires: <code className="text-primary">window.dispatchEvent(new CustomEvent(&quot;name&quot;, {'{'}detail: payload{'}'}))</code><br />
                            4. SDK auto-dismisses notification + tracks click<br />
                            5. Your JS listener catches the event and runs your logic
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-6">
                            {/* Event Button Schema */}
                            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <Code2 className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-semibold text-foreground">Event Button Schema</h3>
                                </div>
                                <div className="space-y-0 divide-y divide-border/40">
                                    {[
                                        { name: "text", type: "string", required: true, desc: "Button label shown to the user" },
                                        { name: "action", type: '"event"', required: true, desc: 'Must be exactly "event"' },
                                        { name: "event", type: "string", required: true, desc: 'Custom event name (e.g. "pinglet:addToCart")' },
                                        { name: "data", type: "any", required: false, desc: "Payload sent as event.detail — object, array, string, number" },
                                    ].map((field, i) => (
                                        <div key={i} className="py-3 first:pt-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <code className="text-xs font-mono font-medium text-foreground">{field.name}</code>
                                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{field.type}</span>
                                                {field.required && (
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 font-medium">required</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{field.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* All Button Actions Reference */}
                            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <BookOpen className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-semibold text-foreground">All Button Actions</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                        <thead>
                                            <tr className="border-b border-border/50 text-left text-muted-foreground">
                                                <th className="pb-2 pr-4 font-medium">Action</th>
                                                <th className="pb-2 pr-4 font-medium">Required Fields</th>
                                                <th className="pb-2 font-medium">Behavior</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/30">
                                            {[
                                                ["redirect", "src (valid URL)", "Opens URL in new tab (_blank)"],
                                                ["link", "src (valid URL)", "Opens URL in same tab"],
                                                ["alert", "src (string)", "Shows browser alert(src)"],
                                                ["reload", "—", "Reloads the page"],
                                                ["close", "—", "Dismisses the notification"],
                                                ["event", "event (string)", "Fires CustomEvent on window"],
                                                ["onClick", "onClick (fn string)", "Evaluates inline function"],
                                            ].map(([action, required, behavior], i) => (
                                                <tr key={i}>
                                                    <td className="py-2 pr-4">
                                                        <code className="text-xs font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary">{action}</code>
                                                    </td>
                                                    <td className="py-2 pr-4 text-muted-foreground">{required}</td>
                                                    <td className="py-2 text-foreground">{behavior}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Example: Add to Cart */}
                            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Send className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-semibold text-foreground">Example: Add to Cart</h3>
                                </div>
                                <CodeBlock code={JSON.stringify({
                                    type: "2",
                                    projectId: "your-project-id",
                                    body: {
                                        title: "Flash Sale!",
                                        description: "50% off — limited time only",
                                        icon: "https://example.com/sale-icon.png",
                                        buttons: [
                                            { text: "Add to Cart", action: "event", event: "pinglet:addToCart", data: { productId: "SKU-123", quantity: 1, discount: 50 } },
                                            { text: "Maybe Later", action: "close" }
                                        ]
                                    }
                                }, null, 2)} lang="json" />
                            </div>

                            {/* Example: Multiple Event Buttons */}
                            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Send className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-semibold text-foreground">Example: Multiple Event Buttons</h3>
                                </div>
                                <CodeBlock code={JSON.stringify({
                                    type: "2",
                                    projectId: "your-project-id",
                                    body: {
                                        title: "New Feature: Dark Mode",
                                        description: "Try our new dark mode theme!",
                                        buttons: [
                                            { text: "Enable Dark Mode", action: "event", event: "theme:toggle", data: { theme: "dark" } },
                                            { text: "Leave Feedback", action: "event", event: "feedback:open", data: { feature: "dark-mode", version: "2.0" } },
                                            { text: "Not Now", action: "close" }
                                        ]
                                    }
                                }, null, 2)} lang="json" />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            {/* Frontend Listener */}
                            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Code2 className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-semibold text-foreground">Frontend Listener</h3>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Add this after the Pinglet SDK script tag. The <code className="px-1 py-0.5 rounded bg-muted text-foreground">event.detail</code> contains
                                    whatever you sent in the <code className="px-1 py-0.5 rounded bg-muted text-foreground">data</code> field.
                                </p>
                                <CodeBlock code={`<script>\n  // Listen for the custom event by name\n  window.addEventListener("pinglet:addToCart", function (e) {\n    console.log("Payload received:", e.detail);\n\n    // e.detail = { productId: "SKU-123", quantity: 1, discount: 50 }\n    addItemToCart(e.detail.productId, e.detail.quantity);\n  });\n</script>`} lang="html" />
                            </div>

                            {/* React / SPA Usage */}
                            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Code2 className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-semibold text-foreground">React / SPA Usage</h3>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    For React, Vue, Next.js, or Angular — register the listener in a lifecycle hook and clean up on unmount.
                                </p>
                                <CodeBlock code={`// React example\nuseEffect(() => {\n  const handler = (e: CustomEvent) => {\n    console.log("Event data:", e.detail);\n    // Your logic here\n  };\n  window.addEventListener("pinglet:addToCart", handler);\n  return () => window.removeEventListener("pinglet:addToCart", handler);\n}, []);`} lang="tsx" />
                            </div>

                            {/* More Use Cases */}
                            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-semibold text-foreground">Use Cases</h3>
                                </div>
                                <div className="space-y-3 text-xs">
                                    {[
                                        { title: "Open Modal / Dialog", event: "ui:openModal", data: '{ modalId: "product-detail", productSlug: "wireless-headphones" }' },
                                        { title: "Track Conversion", event: "analytics:conversion", data: '{ campaign: "summer-sale", value: 15.00, currency: "USD" }' },
                                        { title: "Apply Coupon Code", event: "promo:applyCoupon", data: '{ code: "SAVE20", discount: 20, minOrder: 50 }' },
                                        { title: "Start Chat / Support", event: "support:openChat", data: '{ department: "sales", priority: "high" }' },
                                        { title: "SPA Navigation", event: "app:navigate", data: '{ path: "/dashboard/orders", tab: "pending" }' },
                                        { title: "Theme Toggle", event: "theme:toggle", data: '{ theme: "dark" }' },
                                    ].map((uc, i) => (
                                        <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/30">
                                            <p className="font-medium text-foreground mb-1">{uc.title}</p>
                                            <code className="block text-muted-foreground">event: &quot;{uc.event}&quot;</code>
                                            <code className="block text-muted-foreground">data: {uc.data}</code>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Important Notes */}
                            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-sm p-6 space-y-3">
                                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <span className="text-amber-500">&#9888;</span> Important Notes
                                </h3>
                                <ul className="space-y-2 text-xs text-muted-foreground">
                                    <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span>You <strong>must</strong> register your listener — the SDK only fires the event</li>
                                    <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span>Works with Type 0 (toast), Type 1 (template), and Type 2 (glassmorphism)</li>
                                    <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span>Notification auto-dismisses after the event is dispatched</li>
                                    <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span>Max 3 buttons per notification — any combination of actions is allowed</li>
                                    <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span>Don&apos;t put sensitive data (passwords, tokens) in the payload — it&apos;s visible in the notification</li>
                                    <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span>Use namespaced names like &quot;app:action&quot; or &quot;pinglet:action&quot; to avoid collisions</li>
                                    <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span>The <code className="px-1 py-0.5 rounded bg-muted text-foreground">data</code> field accepts any JSON type: object, array, string, number</li>
                                    <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span>Backend validates: action must be &quot;event&quot;, event must be a string, data is optional</li>
                                </ul>
                            </div>

                            {/* Valid / Invalid Quick Ref */}
                            <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm p-6 space-y-4">
                                <h3 className="text-sm font-semibold text-foreground">Quick Reference</h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-wider mb-2">Valid Payloads</p>
                                        <CodeBlock code={`// Minimal — just event name\n{ "text": "Click Me", "action": "event", "event": "app:clicked" }\n\n// With object data\n{ "text": "Buy", "action": "event", "event": "shop:buy", "data": { "id": 1 } }\n\n// With array data\n{ "text": "Select", "action": "event", "event": "bulk:select", "data": [1, 2, 3] }`} lang="json" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-medium text-red-500 uppercase tracking-wider mb-2">Invalid (Rejected)</p>
                                        <CodeBlock code={`// Missing "event" field\n{ "text": "Click", "action": "event" }\n\n// "event" is not a string\n{ "text": "Click", "action": "event", "event": 123 }\n\n// Wrong action type\n{ "text": "Click", "action": "customEvent", "event": "x" }`} lang="json" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PingletApiUsage;
