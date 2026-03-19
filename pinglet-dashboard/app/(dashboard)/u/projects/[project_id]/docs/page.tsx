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
    const [activeTab, setActiveTab] = useState<ExampleKey>("0");
    const params = useParams();
    const projectId = params?.project_id;

    const current = examples[activeTab];

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
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ExampleKey)} className="w-full">
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
            </Tabs>
        </div>
    );
};

export default PingletApiUsage;
