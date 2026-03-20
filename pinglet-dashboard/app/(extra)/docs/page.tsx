"use client";
import React, { useState, useEffect } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check, BookOpen, Send, Code2, Zap, Layers, Bell, Palette, ArrowRight, MousePointerClick } from "lucide-react";
import Link from "next/link";

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
            projectId: "your-project-id",
            type: "-1",
            data: {
                title: "Order Shipped",
                body: "Your package is on the way.",
                icon: "https://cdn.example.com/icon.png",
                tag: "order-123",
                requireInteraction: true,
                data: { url: "https://example.com/track/123" },
                actions: [
                    { action: "view", title: "View Order" },
                    { action: "dismiss", title: "Dismiss" }
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
            projectId: "your-project-id",
            type: "1",
            template_id: "42",
            custom_template: {
                user_name: "John Doe",
                order_total: "$49.99",
                action_url: "https://example.com/orders/123",
            },
        },
        response: {
            message: "OK",
            result: "Notification Sent",
            success: true,
            "X-API-PLATFORM STATUS": "OK",
        },
        schema: [
            { name: "projectId", type: "string", required: true, desc: "Your project unique ID (24 characters)" },
            { name: "type", type: "string", required: true, desc: 'Set to "1" for custom template' },
            { name: "template_id", type: "string", required: true, desc: "ID matching an existing template" },
            { name: "custom_template", type: "object", required: true, desc: "Key-value object — shape depends on template" },
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

const sidebarSections = [
    {
        title: "Getting Started",
        items: [
            { id: "overview", label: "Overview" },
            { id: "quick-start", label: "Quick Start" },
            { id: "script-setup", label: "Script Tag Setup" },
        ],
    },
    {
        title: "Notification Types",
        items: [
            { id: "type-0", label: "Type 0 — In-App Toast" },
            { id: "type-2", label: "Type 2 — Glassmorphism" },
            { id: "type--1", label: "Type -1 — Browser Push" },
            { id: "type-1", label: "Type 1 — Custom Template" },
        ],
    },
    {
        title: "API Reference",
        items: [
            { id: "api-ref", label: "Send Notification" },
            { id: "api-schemas", label: "Payload Schemas" },
            { id: "full-schema", label: "Full API Schema" },
        ],
    },
    {
        title: "Guides",
        items: [
            { id: "custom-events", label: "Custom Events" },
            { id: "button-actions", label: "Button Actions" },
            { id: "overrides", label: "Overrides & Config" },
        ],
    },
    {
        title: "Advanced",
        items: [
            { id: "global-config", label: "Global Config" },
            { id: "sse-lifecycle", label: "SSE Lifecycle" },
            { id: "stacking", label: "Stacking & Queue" },
            { id: "branding", label: "Branding" },
            { id: "dark-mode", label: "Dark Mode" },
            { id: "font-caching", label: "Font & Image Caching" },
            { id: "error-handling", label: "Error Handling" },
            { id: "notes", label: "Notes & Gotchas" },
        ],
    },
];

const PingletDocs = () => {
    const [activeSection, setActiveSection] = useState("overview");
    const [activeTab, setActiveTab] = useState<ExampleKey | "events">("0");

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll("[data-section]");
            let current = "overview";
            sections.forEach((section) => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 120) {
                    current = section.getAttribute("data-section") || current;
                }
            });
            setActiveSection(current);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollTo = (id: string) => {
        const el = document.querySelector(`[data-section="${id}"]`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="min-h-screen">
            {/* Hero */}
            <div className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
                <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
                    <div className="flex items-center gap-2 text-sm text-primary font-medium mb-4">
                        <BookOpen className="w-4 h-4" />
                        Documentation
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Pinglet SDK Documentation</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        Everything you need to integrate real-time notifications into your website. From quick start to advanced configuration.
                    </p>
                    <div className="flex flex-wrap gap-3 mt-6">
                        <Button size="sm" className="rounded-full gap-2" onClick={() => scrollTo("quick-start")}>
                            Get Started <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                        <Link href="/demo">
                            <Button variant="outline" size="sm" className="rounded-full gap-2">
                                <Layers className="w-3.5 h-3.5" /> Live Demo
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-6 py-10">
                <div className="flex gap-10">
                    {/* Sidebar */}
                    <aside className="hidden lg:block w-56 shrink-0">
                        <nav className="sticky top-24 space-y-6">
                            {sidebarSections.map((section) => (
                                <div key={section.title}>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{section.title}</p>
                                    <ul className="space-y-0.5">
                                        {section.items.map((item) => (
                                            <li key={item.id}>
                                                <button
                                                    onClick={() => scrollTo(item.id)}
                                                    className={`w-full text-left text-sm px-3 py-1.5 rounded-lg transition-colors ${
                                                        activeSection === item.id
                                                            ? "bg-primary/10 text-primary font-medium"
                                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                                    }`}
                                                >
                                                    {item.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 space-y-16">
                        {/* ── Overview ── */}
                        <section data-section="overview" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Overview</h2>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                Pinglet is a real-time notification platform that lets you send push notifications, in-app toasts, glassmorphism cards,
                                and custom template notifications to your users with a single API call. The SDK connects via SSE (Server-Sent Events)
                                for instant delivery.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { icon: Bell, title: "4 Notification Types", desc: "Browser push, in-app toast, glassmorphism card, and custom templates" },
                                    { icon: Zap, title: "Real-time via SSE", desc: "Instant delivery through Server-Sent Events — no polling needed" },
                                    { icon: Palette, title: "Fully Customizable", desc: "Override position, theme, sounds, branding, progress bars, and more" },
                                    { icon: MousePointerClick, title: "Custom Events", desc: "Trigger frontend JS events from notification button clicks" },
                                ].map((feature) => (
                                    <div key={feature.title} className="rounded-xl border border-border/50 bg-card/80 p-5">
                                        <feature.icon className="w-5 h-5 text-primary mb-3" />
                                        <h3 className="text-sm font-semibold text-foreground mb-1">{feature.title}</h3>
                                        <p className="text-xs text-muted-foreground">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* ── Quick Start ── */}
                        <section data-section="quick-start" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Quick Start</h2>
                            <p className="text-muted-foreground mb-6">Get notifications running on your site in under 2 minutes.</p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</div>
                                        <div className="w-px flex-1 bg-border/50 my-2" />
                                    </div>
                                    <div className="flex-1 pb-6">
                                        <h3 className="font-semibold text-foreground mb-2">Create a Project</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Sign up at Pinglet, create a project, and register your website domain. You&apos;ll get a <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">project_id</code> and <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">pinglet_id</code>.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</div>
                                        <div className="w-px flex-1 bg-border/50 my-2" />
                                    </div>
                                    <div className="flex-1 pb-6">
                                        <h3 className="font-semibold text-foreground mb-2">Add Script Tags</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Add the Pinglet SDK to your HTML, before the closing <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">&lt;/body&gt;</code> tag.
                                        </p>
                                        <CodeBlock code={`<!-- Service Worker (handles browser push) -->\n<script\n  crossorigin="anonymous"\n  src="https://pinglet.enjoys.in/api/v1/public/scripts/v0.0.2/sw.js"\n></script>\n\n<!-- Main SDK -->\n<script\n  type="module"\n  crossorigin="anonymous"\n  src="https://pinglet.enjoys.in/api/v1/public/libs/pinglet-sse.js"\n  data-endpoint="https://pinglet.enjoys.in/api/v1/notifications"\n  data-configured-domain="yourdomain.com"\n  data-project-id="YOUR_PROJECT_ID"\n  data-pinglet-id="YOUR_PINGLET_ID"\n  data-checksum="sha384-XXXXXXX"\n></script>`} lang="html" />
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</div>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-foreground mb-2">Send a Notification</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Make a POST request to send your first notification.
                                        </p>
                                        <CodeBlock code={`curl -X POST https://pinglet.enjoys.in/api/v1/notifications/send \\\n  -H "Content-Type: application/json" \\\n  -H "X-Project-ID: YOUR_PROJECT_ID" \\\n  -d '{\n    "project_id": "YOUR_PROJECT_ID",\n    "type": 0,\n    "variant": "default",\n    "body": {\n      "title": "Hello from Pinglet!",\n      "description": "Your first notification"\n    }\n  }'`} lang="bash" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── Script Tag Setup ── */}
                        <section data-section="script-setup" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Script Tag Attributes</h2>
                            <p className="text-muted-foreground mb-6">Reference for all <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">data-*</code> attributes on the SDK script tag.</p>
                            <div className="rounded-xl border border-border/50 bg-card/80 p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border/50 text-left">
                                                <th className="pb-3 pr-4 font-medium text-foreground">Attribute</th>
                                                <th className="pb-3 pr-4 font-medium text-foreground">Required</th>
                                                <th className="pb-3 font-medium text-foreground">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/30 text-xs">
                                            {[
                                                ["data-endpoint", "Yes", "Pinglet API URL + /notifications"],
                                                ["data-configured-domain", "Yes", "Domain registered in dashboard"],
                                                ["data-project-id", "Yes", "24-char project ID"],
                                                ["data-pinglet-id", "Yes", "Pinglet signature token"],
                                                ["data-checksum", "Yes", "SRI checksum (sha384)"],
                                                ["data-testimonials", "No", '"true" to show floating testimonials button'],
                                                ["data-templates", "No", "Comma-separated template IDs to preload"],
                                            ].map(([attr, req, desc]) => (
                                                <tr key={attr}>
                                                    <td className="py-3 pr-4"><code className="font-mono text-primary">{attr}</code></td>
                                                    <td className="py-3 pr-4">
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${req === "Yes" ? "bg-red-500/10 text-red-500" : "bg-muted text-muted-foreground"}`}>{req}</span>
                                                    </td>
                                                    <td className="py-3 text-muted-foreground">{desc}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        {/* ── Notification Types ── */}
                        <section data-section="type-0" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-2">Notification Types</h2>
                            <p className="text-muted-foreground mb-6">Pinglet supports 4 notification types. Each type uses the same API endpoint but with different payloads.</p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {[
                                    { type: "0", name: "In-App Toast", desc: "Lightweight in-page notifications with slide/fade/zoom animations", tag: "Live", color: "from-blue-500 to-cyan-500" },
                                    { type: "2", name: "Glassmorphism HTML", desc: "Modern glass card with rich media, action buttons, and stacking", tag: "Live", color: "from-purple-500 to-pink-500" },
                                    { type: "1", name: "Custom Template", desc: "Server-stored HTML/CSS templates with variable injection", tag: "Upcoming", color: "from-amber-500 to-orange-500" },
                                    { type: "-1", name: "Browser Push", desc: "Native OS push notifications via Web Push API & service worker", tag: "Upcoming", color: "from-emerald-500 to-teal-500" },
                                ].map((item) => (
                                    <div key={item.type} className="rounded-xl border border-border/50 bg-card/80 p-5 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-xs font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>TYPE {item.type}</span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                                                item.tag === "Live" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                            }`}>{item.tag}</span>
                                        </div>
                                        <h3 className="text-sm font-semibold text-foreground mb-1">{item.name}</h3>
                                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* ── Type 0 Detailed Guide ── */}
                            <div className="mt-10 pt-10 border-t border-border/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xs font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">TYPE 0</span>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Live</span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">In-App Toast Notification</h3>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Simple, lightweight in-page notifications with slide/fade/zoom animations. Supports icon (emoji/base64), logo (URL), rich media, action buttons, and dark mode.
                                </p>
                                <div className="space-y-6">
                                    <CodeBlock code={`POST /api/v1/notifications/send\n\n{\n  "projectId": "your-project-id",\n  "type": "0",\n  "body": {\n    "title": "New Message",\n    "description": "You have 3 unread messages",\n    "icon": "🔔",\n    "logo": "https://cdn.example.com/logo.png",\n    "url": "https://example.com/inbox",\n    "media": { "type": "image", "src": "https://cdn.example.com/banner.jpg" },\n    "buttons": [\n      { "text": "View", "action": "redirect", "src": "https://..." },\n      { "text": "Dismiss", "action": "close" }\n    ]\n  }\n}`} lang="json" />

                                    <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                        <h4 className="text-sm font-semibold text-foreground mb-3">Body Fields</h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-xs">
                                                <thead><tr className="border-b border-border/50 text-left"><th className="pb-2 pr-4 font-medium text-foreground">Field</th><th className="pb-2 pr-4 font-medium text-foreground">Required</th><th className="pb-2 font-medium text-foreground">Notes</th></tr></thead>
                                                <tbody className="divide-y divide-border/30">
                                                    {[["title","Yes","Min 3 chars"],["description","No","Body text"],["icon","No","Emoji, SVG, or base64. NOT a URL."],["logo","No","URL to an image. Used as card logo."],["url","No","Click-through URL (must be valid)"],["media","No","{type, src} — type: image|video|audio|iframe"],["buttons","No","Array, max 3 buttons"]].map(([f,r,n],i)=>(
                                                        <tr key={i}><td className="py-2 pr-4"><code className="font-mono text-primary">{f}</code></td><td className="py-2 pr-4"><span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${r==="Yes"?"bg-red-500/10 text-red-500":"bg-muted text-muted-foreground"}`}>{r}</span></td><td className="py-2 text-muted-foreground">{n}</td></tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                        <h4 className="text-sm font-semibold text-foreground mb-3">What Happens</h4>
                                        <ol className="space-y-1.5 text-xs text-muted-foreground list-decimal list-inside">
                                            <li>SSE delivers to all connected clients for this projectId</li>
                                            <li>SDK calls <code className="text-primary">createVariant(body, globalConfig)</code> → builds HTML card</li>
                                            <li><code className="text-primary">renderToast()</code> slides it into the toast container</li>
                                            <li>Auto-dismisses after config.duration (default 5000ms)</li>
                                        </ol>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-foreground mb-3">Examples</h4>
                                        <CodeBlock code={`// Minimal\n{ "projectId": "...", "type": "0", "body": { "title": "Hello!" } }\n\n// With icon + description\n{\n  "projectId": "...", "type": "0",\n  "body": { "title": "Order #123", "description": "Ready for pickup", "icon": "📦" }\n}\n\n// With image media\n{\n  "projectId": "...", "type": "0",\n  "body": { "title": "Sale!", "media": { "type": "image", "src": "https://..." } }\n}`} lang="json" />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── Type 2 — Glassmorphism HTML ── */}
                        <section data-section="type-2" className="scroll-mt-24">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">TYPE 2</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Live</span>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Glassmorphism HTML Notification</h2>
                            <p className="text-muted-foreground mb-6">
                                Rich, premium-looking notifications with glassmorphism blur effect. Stacking queue (max 3 visible), branding footer, progress bar, 4-corner positioning, tag dedup, pause-on-hover, and dark mode.
                            </p>
                            <div className="space-y-6">
                                <CodeBlock code={`POST /api/v1/notifications/send\n\n{\n  "projectId": "your-project-id",\n  "type": "2",\n  "body": {\n    "title": "Flash Sale 🔥",\n    "description": "50% off all items.",\n    "icon": "https://cdn.example.com/icon.png",\n    "url": "https://example.com/sale",\n    "media": { "type": "image", "src": "https://cdn.example.com/hero.jpg" },\n    "buttons": [\n      { "text": "Shop", "action": "redirect", "src": "https://..." },\n      { "text": "Track", "action": "event", "event": "sale:click", "data": {} },\n      { "text": "Close", "action": "close" }\n    ]\n  }\n}`} lang="json" />

                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Body Fields</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead><tr className="border-b border-border/50 text-left"><th className="pb-2 pr-4 font-medium text-foreground">Field</th><th className="pb-2 pr-4 font-medium text-foreground">Required</th><th className="pb-2 font-medium text-foreground">Notes</th></tr></thead>
                                            <tbody className="divide-y divide-border/30">
                                                {[["title","Yes","Min 3 chars"],["description","No","Body text"],["icon","No","URL allowed for type 2 (unlike type 0)"],["url","No","Click-through URL"],["media","No","{type, src} — image, video, audio, or iframe"],["buttons","No","Array, max 3 buttons"]].map(([f,r,n],i)=>(
                                                    <tr key={i}><td className="py-2 pr-4"><code className="font-mono text-primary">{f}</code></td><td className="py-2 pr-4"><span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${r==="Yes"?"bg-red-500/10 text-red-500":"bg-muted text-muted-foreground"}`}>{r}</span></td><td className="py-2 text-muted-foreground">{n}</td></tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Key Differences from Type 0</h4>
                                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                                        <li className="flex gap-2"><span className="text-blue-500 shrink-0">•</span><code className="text-primary">icon</code> allows URLs (type 0 icon is emoji/SVG/base64 only)</li>
                                        <li className="flex gap-2"><span className="text-blue-500 shrink-0">•</span>No <code className="text-primary">logo</code> field — use <code className="text-primary">icon</code> for the image</li>
                                        <li className="flex gap-2"><span className="text-blue-500 shrink-0">•</span>No <code className="text-primary">variant</code> field allowed</li>
                                        <li className="flex gap-2"><span className="text-blue-500 shrink-0">•</span>Glassmorphism blur UI with border-radius 16px</li>
                                        <li className="flex gap-2"><span className="text-blue-500 shrink-0">•</span>Built-in stacking queue + branding footer + progress bar</li>
                                        <li className="flex gap-2"><span className="text-blue-500 shrink-0">•</span>4-corner positioning + tag dedup (same tag replaces existing)</li>
                                    </ul>
                                </div>

                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">What Happens</h4>
                                    <ol className="space-y-1.5 text-xs text-muted-foreground list-decimal list-inside">
                                        <li>SSE delivers the payload</li>
                                        <li>SDK calls <code className="text-primary">showHtmlNotification({'{'}...{'}'})</code></li>
                                        <li>Card rendered with glassmorphism CSS</li>
                                        <li>If &gt; maxVisible (default 3), queued and shown when a slot opens</li>
                                        <li>Branding footer from globalConfig.config.branding</li>
                                        <li>Auto-closes with progress bar (unless requireInteraction)</li>
                                    </ol>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Examples</h4>
                                    <CodeBlock code={`// Minimal\n{ "projectId": "...", "type": "2", "body": { "title": "Welcome!" } }\n\n// Full\n{\n  "projectId": "...", "type": "2",\n  "body": {\n    "title": "Payment Received",\n    "description": "$99.00 from user@example.com",\n    "icon": "https://cdn.example.com/avatar.png",\n    "buttons": [\n      { "text": "View", "action": "redirect", "src": "https://..." },\n      { "text": "Close", "action": "close" }\n    ]\n  }\n}`} lang="json" />
                                </div>
                            </div>
                        </section>

                        {/* ── Type -1 — Browser Push ── */}
                        <section data-section="type--1" className="scroll-mt-24">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">TYPE -1</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">Upcoming</span>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Browser Push Notification</h2>
                            <p className="text-muted-foreground mb-4">
                                Notifications delivered via Web Push API → Service Worker → native OS notification. Reaches users even when the tab is closed. Requires user&apos;s push permission grant.
                            </p>
                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 mb-6">
                                <p className="text-xs text-muted-foreground"><strong className="text-foreground">Important:</strong> Uses <code className="text-primary">data</code> field (NOT <code className="text-primary">body</code>). Follows browser Notification API spec. Max 2 action buttons (browser limitation). Queued via BullMQ on backend (not SSE).</p>
                            </div>
                            <div className="space-y-6">
                                <CodeBlock code={`POST /api/v1/notifications/send\n\n{\n  "projectId": "your-project-id",\n  "type": "-1",\n  "data": {\n    "title": "Order Shipped",\n    "body": "Your package is on the way.",\n    "icon": "https://cdn.example.com/icon.png",\n    "badge": "https://cdn.example.com/badge.png",\n    "image": "https://cdn.example.com/hero.jpg",\n    "tag": "order-123",\n    "requireInteraction": true,\n    "silent": false,\n    "renotify": false,\n    "dir": "ltr",\n    "timestamp": 1711000000000,\n    "vibrate": [200, 100, 200],\n    "data": {\n      "url": "https://example.com/track/123",\n      "duration": 5000\n    },\n    "actions": [\n      { "action": "view", "title": "View Order", "icon": "..." },\n      { "action": "dismiss", "title": "Dismiss" }\n    ]\n  }\n}`} lang="json" />

                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Data Fields</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead><tr className="border-b border-border/50 text-left"><th className="pb-2 pr-4 font-medium text-foreground">Field</th><th className="pb-2 pr-4 font-medium text-foreground">Required</th><th className="pb-2 font-medium text-foreground">Notes</th></tr></thead>
                                            <tbody className="divide-y divide-border/30">
                                                {[["title","Yes","1-100 chars"],["body","No","Max 500 chars"],["icon","No","URL — notification icon"],["badge","No","URL — small overlay (Android)"],["image","No","URL — large hero image"],["tag","No","Dedup — same tag replaces previous"],["requireInteraction","No","true = stays until user clicks"],["silent","No","true = no sound/vibration"],["renotify","No","true = re-alert even if same tag"],["dir","No","\"auto\" | \"ltr\" | \"rtl\""],["timestamp","No","Unix ms — shown as time"],["vibrate","No","Array of vibration durations"],["data.url","No","URL opened on click"],["actions","No","Max 2 action buttons (browser limit)"]].map(([f,r,n],i)=>(
                                                    <tr key={i}><td className="py-2 pr-4"><code className="font-mono text-primary">{f}</code></td><td className="py-2 pr-4"><span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${r==="Yes"?"bg-red-500/10 text-red-500":"bg-muted text-muted-foreground"}`}>{r}</span></td><td className="py-2 text-muted-foreground">{n}</td></tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Prerequisite</h4>
                                    <p className="text-xs text-muted-foreground">
                                        The browser must have push subscription registered. The SDK does this automatically via <code className="text-primary">askNotificationPermission()</code> on load. If the user denied permission, push won&apos;t work.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* ── Type 1 — Custom Template ── */}
                        <section data-section="type-1" className="scroll-mt-24">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">TYPE 1</span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">Upcoming</span>
                            </div>
                            <h2 className="text-2xl font-bold text-foreground mb-2">Custom Template Notification</h2>
                            <p className="text-muted-foreground mb-4">
                                Server-stored templates created in the dashboard. Pass data to fill template placeholders. Useful for consistent, reusable notification formats.
                            </p>
                            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 mb-6">
                                <p className="text-xs text-muted-foreground"><strong className="text-foreground">Important:</strong> Requires <code className="text-primary">template_id</code> AND <code className="text-primary">custom_template</code>. Must NOT include <code className="text-primary">body</code> or <code className="text-primary">data</code>. Template must be pre-loaded (via <code className="text-primary">data-templates=&quot;1,42&quot;</code> or loadAllTemplates).</p>
                            </div>
                            <div className="space-y-6">
                                <CodeBlock code={`POST /api/v1/notifications/send\n\n{\n  "projectId": "your-project-id",\n  "type": "1",\n  "template_id": "42",\n  "custom_template": {\n    "user_name": "John Doe",\n    "order_total": "$49.99",\n    "action_url": "https://example.com/orders/123",\n    "product_image": "https://cdn.example.com/product.jpg"\n  }\n}`} lang="json" />

                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Rules</h4>
                                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                                        <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span><code className="text-primary">template_id</code> must be a string matching an existing template</li>
                                        <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span><code className="text-primary">custom_template</code> is a key-value object — any shape, depends on template</li>
                                        <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span><code className="text-primary">body</code> must NOT be present when type is &quot;1&quot;</li>
                                        <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span><code className="text-primary">data</code> must NOT be present when type is &quot;1&quot;</li>
                                        <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span><code className="text-primary">variant</code> must NOT be present when type is &quot;1&quot;</li>
                                    </ul>
                                </div>

                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">What Happens</h4>
                                    <ol className="space-y-1.5 text-xs text-muted-foreground list-decimal list-inside">
                                        <li>SSE delivers {'{'} type: &quot;1&quot;, template_id, custom_template {'}'}</li>
                                        <li>SDK looks up template from <code className="text-primary">globalConfig.templates[template_id]</code></li>
                                        <li>Executes compiled_text as a function(data, config, globalConfig)</li>
                                        <li>Wraps result in <code className="text-primary">createWrapper()</code> for slide animation</li>
                                    </ol>
                                </div>
                            </div>
                        </section>

                        {/* ── API Reference ── */}
                        <section data-section="api-ref" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-2">API Reference</h2>
                            <p className="text-muted-foreground mb-6">Send notifications via the Pinglet REST API. Rate limit: 30 requests/minute.</p>

                            <div className="rounded-xl border border-border/50 bg-card/80 p-6 mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">POST</span>
                                    <code className="text-sm font-mono text-foreground">https://pinglet.enjoys.in/api/v1/notifications/send</code>
                                </div>
                                <h3 className="text-sm font-semibold mb-3">Headers</h3>
                                <CodeBlock code={`{\n  "Content-Type": "application/json",\n  "X-Project-ID": "your-project-id",\n  "X-Pinglet-Version": "1.0.5"\n}`} lang="json" />
                            </div>
                        </section>

                        {/* ── Payload Schemas (Tabs) ── */}
                        <section data-section="api-schemas" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-2">Payload Schemas</h2>
                            <p className="text-muted-foreground mb-6">Request body schemas for each notification type.</p>

                            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ExampleKey | "events")} className="w-full">
                                <TabsList className="bg-muted/50 border border-border/50 p-1 rounded-xl flex-wrap">
                                    {(Object.entries(examples) as [ExampleKey, typeof examples[ExampleKey]][]).map(([key, val]) => (
                                        <TabsTrigger key={key} value={key} className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm gap-2">
                                            {val.label}
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${val.tag === "Live" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>{val.tag}</span>
                                        </TabsTrigger>
                                    ))}
                                    <TabsTrigger value="events" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm gap-2">
                                        Custom Events
                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400">Guide</span>
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
                        </section>

                        {/* ── Custom Events Guide ── */}
                        <section data-section="custom-events" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Custom Events</h2>
                            <p className="text-muted-foreground mb-6">
                                Trigger real DOM CustomEvents on the user&apos;s browser when they click a notification button.
                                Your frontend JavaScript listens for the event and executes any logic — add to cart, open modal, track conversion, and more.
                            </p>

                            <div className="rounded-xl border border-border/50 bg-card/80 p-6 mb-6">
                                <h3 className="text-sm font-semibold text-foreground mb-3">How It Works</h3>
                                <div className="bg-muted/50 rounded-lg p-4 border border-border/50 text-xs font-mono leading-relaxed text-muted-foreground">
                                    1. Backend sends notification with button → action: &quot;event&quot;<br />
                                    2. SDK renders notification → User clicks button<br />
                                    3. SDK fires: <code className="text-primary">window.dispatchEvent(new CustomEvent(&quot;name&quot;, {'{'}detail: payload{'}'}))</code><br />
                                    4. SDK auto-dismisses notification + tracks click<br />
                                    5. Your JS listener catches the event and runs your logic
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <div className="rounded-xl border border-border/50 bg-card/80 p-6">
                                        <h3 className="text-sm font-semibold text-foreground mb-4">Event Button Schema</h3>
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
                                                        {field.required && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 font-medium">required</span>}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground">{field.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="rounded-xl border border-border/50 bg-card/80 p-6 space-y-4">
                                        <h3 className="text-sm font-semibold text-foreground">Example Payload</h3>
                                        <CodeBlock code={JSON.stringify({
                                            type: "2",
                                            projectId: "your-project-id",
                                            body: {
                                                title: "Flash Sale!",
                                                description: "50% off — limited time only",
                                                buttons: [
                                                    { text: "Add to Cart", action: "event", event: "pinglet:addToCart", data: { productId: "SKU-123", quantity: 1 } },
                                                    { text: "Maybe Later", action: "close" }
                                                ]
                                            }
                                        }, null, 2)} lang="json" />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="rounded-xl border border-border/50 bg-card/80 p-6 space-y-4">
                                        <h3 className="text-sm font-semibold text-foreground">Frontend Listener (HTML)</h3>
                                        <CodeBlock code={`<script>\n  window.addEventListener("pinglet:addToCart", function (e) {\n    console.log("Payload:", e.detail);\n    addItemToCart(e.detail.productId, e.detail.quantity);\n  });\n</script>`} lang="html" />
                                    </div>

                                    <div className="rounded-xl border border-border/50 bg-card/80 p-6 space-y-4">
                                        <h3 className="text-sm font-semibold text-foreground">React / SPA Usage</h3>
                                        <CodeBlock code={`useEffect(() => {\n  const handler = (e: CustomEvent) => {\n    console.log("Event data:", e.detail);\n  };\n  window.addEventListener("pinglet:addToCart", handler);\n  return () => window.removeEventListener("pinglet:addToCart", handler);\n}, []);`} lang="tsx" />
                                    </div>

                                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
                                        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                                            <span className="text-amber-500">&#9888;</span> Important Notes
                                        </h3>
                                        <ul className="space-y-2 text-xs text-muted-foreground">
                                            <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span>Register your listener — the SDK only fires the event</li>
                                            <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span>Works with Type 0, Type 1, and Type 2</li>
                                            <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span>Max 3 buttons per notification</li>
                                            <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span>Use namespaced names like &quot;app:action&quot; to avoid collisions</li>
                                            <li className="flex gap-2"><span className="text-amber-500 shrink-0">•</span>Don&apos;t put sensitive data in the payload</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── Button Actions ── */}
                        <section data-section="button-actions" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Button Actions Reference</h2>
                            <div className="rounded-xl border border-border/50 bg-card/80 p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border/50 text-left">
                                                <th className="pb-3 pr-4 font-medium text-foreground">Action</th>
                                                <th className="pb-3 pr-4 font-medium text-foreground">Required Fields</th>
                                                <th className="pb-3 font-medium text-foreground">Behavior</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/30 text-xs">
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
                                                    <td className="py-2.5 pr-4"><code className="text-xs font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary">{action}</code></td>
                                                    <td className="py-2.5 pr-4 text-muted-foreground">{required}</td>
                                                    <td className="py-2.5 text-foreground">{behavior}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        {/* ── Overrides ── */}
                        <section data-section="overrides" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Overrides & Config</h2>
                            <p className="text-muted-foreground mb-6">
                                Customize notification appearance and behavior per-request using the <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">overrides</code> object.
                            </p>
                            <div className="rounded-xl border border-border/50 bg-card/80 p-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border/50 text-left">
                                                <th className="pb-3 pr-4 font-medium text-foreground">Property</th>
                                                <th className="pb-3 pr-4 font-medium text-foreground">Type</th>
                                                <th className="pb-3 font-medium text-foreground">Description</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border/30 text-xs">
                                            {[
                                                ["position", "string", '"top-right" | "top-left" | "bottom-right" | "bottom-left"'],
                                                ["duration", "number", "Auto-dismiss timer in milliseconds"],
                                                ["auto_dismiss", "boolean", "If false, stays until manually closed"],
                                                ["transition", "string", '"fade" | "slide" | "zoom"'],
                                                ["maxVisible", "number", "Max visible notifications at once"],
                                                ["stacking", "boolean", "Stack multiple notifications"],
                                                ["dismissible", "boolean", "Allow manual dismiss"],
                                                ["pauseOnHover", "boolean", "Pause timer on hover"],
                                                ["sound.play", "boolean", "Play notification sound"],
                                                ["sound.src", "string", "Custom sound URL"],
                                                ["sound.volume", "number", "Volume 0 to 1"],
                                                ["theme.mode", "string", '"light" | "dark" | "auto"'],
                                                ["theme.rounded", "boolean", "Rounded corners"],
                                                ["theme.shadow", "boolean", "Drop shadow"],
                                                ["progressBar.show", "boolean", "Show progress bar"],
                                                ["progressBar.color", "string", "Hex/RGB color"],
                                                ["branding.show", "boolean", "Show branding"],
                                            ].map(([prop, type, desc], i) => (
                                                <tr key={i}>
                                                    <td className="py-2.5 pr-4"><code className="font-mono text-primary text-xs">{prop}</code></td>
                                                    <td className="py-2.5 pr-4"><span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">{type}</span></td>
                                                    <td className="py-2.5 text-muted-foreground">{desc}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>

                        {/* ── Full API Schema ── */}
                        <section data-section="full-schema" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Full API Schema Reference</h2>
                            <p className="text-muted-foreground mb-6">
                                Top-level schema for <code className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">POST /api/v1/notifications/send</code>. Rate limit: 30 req/min.
                            </p>
                            <CodeBlock code={`{\n  "projectId":       "string (exactly 24 chars)",   // REQUIRED\n  "type":            "\"-1\" | \"0\" | \"1\" | \"2\"",       // REQUIRED\n  "variant":         "string",                      // optional (type 0 only)\n  "tag":             "string",                      // optional\n  "overrides":       "OverridesObject",              // optional (premium only)\n  "body":            "BodyObject",                   // required for type 0 & 2\n  "data":            "BrowserPushObject",             // required for type -1\n  "custom_template": "Record<string, any>",          // required for type 1\n  "template_id":     "string"                        // required for type 1\n}`} lang="json" />
                            <div className="rounded-xl border border-border/50 bg-card/80 p-5 mt-6">
                                <h4 className="text-sm font-semibold text-foreground mb-3">Validation Rules</h4>
                                <ul className="space-y-1.5 text-xs text-muted-foreground">
                                    <li className="flex gap-2"><span className="text-primary shrink-0">•</span>type &quot;0&quot; → body required, no template_id/custom_template</li>
                                    <li className="flex gap-2"><span className="text-primary shrink-0">•</span>type &quot;2&quot; → body required, no template_id/custom_template/variant</li>
                                    <li className="flex gap-2"><span className="text-primary shrink-0">•</span>type &quot;1&quot; → template_id + custom_template required, no body/data</li>
                                    <li className="flex gap-2"><span className="text-primary shrink-0">•</span>type &quot;-1&quot; → data required, no template_id/custom_template</li>
                                </ul>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Body Object (type 0 &amp; 2)</h4>
                                    <CodeBlock code={`{\n  "title":       "string (min 3 chars)",  // REQUIRED\n  "description": "string",\n  "icon":        "string",               // emoji/base64 (type 0), URL (type 2)\n  "logo":        "string",               // type 0 only\n  "url":         "string (valid URL)",\n  "media":       { "type": "image|video|audio|iframe", "src": "url" },\n  "buttons":     "ButtonSchema[] (max 3)"\n}`} lang="json" />
                                </div>
                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Button Schema (discriminated union)</h4>
                                    <CodeBlock code={`// redirect / link\n{ "text": "View", "action": "redirect", "src": "https://..." }\n\n// reload / close\n{ "text": "Refresh", "action": "reload" }\n{ "text": "Dismiss", "action": "close" }\n\n// alert\n{ "text": "Alert", "action": "alert", "src": "Message text" }\n\n// event\n{ "text": "Track", "action": "event", "event": "my-event", "data": {} }\n\n// onClick (advanced)\n{ "text": "Run", "action": "onClick", "onClick": "() => ..." }`} lang="json" />
                                </div>
                            </div>
                        </section>

                        {/* ── Global Config ── */}
                        <section data-section="global-config" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Global Config</h2>
                            <p className="text-muted-foreground mb-6">
                                When the SDK initializes, it fetches project config from the server. These settings are merged with SDK defaults. Premium overrides are applied per-notification.
                            </p>
                            <CodeBlock code={`GET {endpoint}/load/projects?projectId=xxx&domain=yyy\n\nResponse:\n{\n  "success": true,\n  "result": {\n    "is_premium": false,\n    "config": {\n      "position": "bottom-left",\n      "transition": "fade",\n      "duration": 5000,\n      "maxVisible": 3,\n      "stacking": true,\n      "auto_dismiss": true,\n      "dismissible": true,\n      "website": true,\n      "favicon": true,\n      "time": true,\n      "sound": { "play": false, "src": "", "volume": 0.5 },\n      "theme": { "mode": "auto" },\n      "branding": { "show": true, "once": true, "html": "" },\n      "progressBar": { "show": true, "color": "" }\n    },\n    "template": { "config": { ... } }\n  }\n}`} lang="json" />
                        </section>

                        {/* ── SSE Lifecycle ── */}
                        <section data-section="sse-lifecycle" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">SSE Connection &amp; Lifecycle</h2>
                            <p className="text-muted-foreground mb-6">The SDK uses Server-Sent Events for real-time notification delivery.</p>
                            <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                                    <li>SDK calls: <code className="text-primary text-xs">new EventSource({`\`\${endpoint}/sse?projectId=\${projectId}&pingletId=\${pingletId}\``})</code></li>
                                    <li>Server keeps connection alive with <code className="text-primary text-xs">:heartbeat\n\n</code> every 30s</li>
                                    <li>On message: SDK parses JSON, checks <code className="text-primary text-xs">parsed.type</code>, dispatches to handler</li>
                                    <li>On error: EventSource auto-reconnects (browser built-in)</li>
                                    <li>On server shutdown: clients reconnect when server comes back</li>
                                </ol>
                            </div>
                            <div className="mt-4">
                                <CodeBlock code={`// SSE endpoint\nGET /api/v1/notifications/sse?projectId=xxx&pingletId=yyy`} lang="bash" />
                            </div>
                        </section>

                        {/* ── Stacking & Queue ── */}
                        <section data-section="stacking" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Stacking &amp; Queue Behavior</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Type 0 (Toast)</h4>
                                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                                        <li>• Renders into a fixed container at globalConfig.config.position</li>
                                        <li>• Multiple toasts stack vertically</li>
                                        <li>• Auto-dismiss removes each independently</li>
                                        <li>• Branding element appears once at the bottom of the container</li>
                                    </ul>
                                </div>
                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Type 2 (Glassmorphism)</h4>
                                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                                        <li>• maxVisible = 3 (default, configurable via config or overrides)</li>
                                        <li>• When &gt; maxVisible, notifications are QUEUED</li>
                                        <li>• When a visible notification is dismissed, the next queued one appears</li>
                                        <li>• Queue is per-position (top-right queue is separate from bottom-left)</li>
                                        <li>• Tag dedup: same tag replaces the existing notification</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="rounded-xl border border-border/50 bg-card/80 p-5 mt-6">
                                <h4 className="text-sm font-semibold text-foreground mb-3">Example — Fire 6 type 2 notifications rapidly</h4>
                                <p className="text-xs text-muted-foreground">
                                    → 1, 2, 3 appear immediately (maxVisible = 3) → 4, 5, 6 go into queue → User dismisses #1 → #4 appears → User dismisses #2 → #5 appears → etc.
                                </p>
                            </div>
                        </section>

                        {/* ── Branding ── */}
                        <section data-section="branding" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Branding</h2>
                            <p className="text-muted-foreground mb-6">Branding appears as a footer on notifications.</p>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Type 0 (Toast)</h4>
                                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                                        <li>• <code className="text-primary">createBrandingElement()</code> renders once</li>
                                        <li>• Placed at the bottom of the toast container</li>
                                        <li>• Controlled by <code className="text-primary">branding.show</code> and <code className="text-primary">branding.once</code></li>
                                    </ul>
                                </div>
                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Type 2 (Glassmorphism)</h4>
                                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                                        <li>• Each card has its own branding footer</li>
                                        <li>• Default: &quot;Notifications by Pinglet&quot; (with link)</li>
                                        <li>• Override via <code className="text-primary">branding.html</code></li>
                                        <li>• Set <code className="text-primary">branding.show = false</code> to hide</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="mt-4">
                                <CodeBlock code={`// Custom branding (via overrides or dashboard config)\n{\n  "branding": {\n    "show": true,\n    "html": "Powered by <b>Enjoys</b> 🚀"\n  }\n}`} lang="json" />
                            </div>
                        </section>

                        {/* ── Dark Mode ── */}
                        <section data-section="dark-mode" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Dark Mode</h2>
                            <p className="text-muted-foreground mb-6">The SDK supports 3 theme modes.</p>
                            <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead><tr className="border-b border-border/50 text-left"><th className="pb-3 pr-4 font-medium text-foreground">Mode</th><th className="pb-3 font-medium text-foreground">Behavior</th></tr></thead>
                                        <tbody className="divide-y divide-border/30 text-xs">
                                            {[["\"auto\"","Follows system prefers-color-scheme"],["\"dark\"","Always dark"],["\"light\"","Always light"]].map(([mode,desc],i)=>(
                                                <tr key={i}><td className="py-2.5 pr-4"><code className="font-mono text-primary">{mode}</code></td><td className="py-2.5 text-muted-foreground">{desc}</td></tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="rounded-xl border border-border/50 bg-card/80 p-5 mt-4">
                                <h4 className="text-sm font-semibold text-foreground mb-3">How It Works</h4>
                                <ul className="space-y-1.5 text-xs text-muted-foreground">
                                    <li>• <strong>Type 0:</strong> Detected via <code className="text-primary">isDarkMode(globalConfig.theme.mode)</code> — card background, text, borders adapt</li>
                                    <li>• <strong>Type 2:</strong> <code className="text-primary">.pn-dark</code> class added when dark = true — all sub-elements restyle including branding footer</li>
                                    <li>• <strong>Set via:</strong> Dashboard config → <code className="text-primary">theme.mode = &quot;auto&quot;</code> or per-notification → <code className="text-primary">overrides.theme.mode</code></li>
                                </ul>
                            </div>
                        </section>

                        {/* ── Font & Image Caching ── */}
                        <section data-section="font-caching" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Font &amp; Image Caching</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Font</h4>
                                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                                        <li>• SDK injects Google Fonts Manrope (wght 200..800) via link rel=&quot;stylesheet&quot;</li>
                                        <li>• Uses <code className="text-primary">display=swap</code> for fast first paint</li>
                                        <li>• Browser caches font files automatically (Google Fonts CDN headers)</li>
                                        <li>• All SDK elements use <code className="text-primary">font-family: &apos;Manrope&apos;, sans-serif</code></li>
                                    </ul>
                                </div>
                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Image Caching</h4>
                                    <ul className="space-y-1.5 text-xs text-muted-foreground">
                                        <li>• Type 2 icon URLs are prefetched via <code className="text-primary">link rel=&quot;prefetch&quot;</code></li>
                                        <li>• Each unique icon URL is prefetched only once (deduped)</li>
                                        <li>• All <code className="text-primary">&lt;img&gt;</code> elements use <code className="text-primary">decoding=&quot;async&quot;</code></li>
                                        <li>• Media images use <code className="text-primary">loading=&quot;lazy&quot;</code></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5 mt-4">
                                <h4 className="text-sm font-semibold text-foreground mb-3">Tips for Icon Caching</h4>
                                <ul className="space-y-1.5 text-xs text-muted-foreground">
                                    <li>1. Serve from a CDN with <code className="text-primary">Cache-Control: public, max-age=31536000</code></li>
                                    <li>2. Use versioned URLs: <code className="text-primary">icon.png?v=2</code></li>
                                    <li>3. Use a consistent icon URL across notifications (same URL = same cache)</li>
                                </ul>
                            </div>
                        </section>

                        {/* ── Error Handling ── */}
                        <section data-section="error-handling" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Error Handling</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">SDK System Popups</h4>
                                    <p className="text-xs text-muted-foreground mb-3">The SDK shows system popups (via <code className="text-primary">showPopup()</code>) for:</p>
                                    <ul className="space-y-1 text-xs text-muted-foreground">
                                        <li>• Missing pingletId</li>
                                        <li>• Missing endpoint</li>
                                        <li>• Version mismatch</li>
                                        <li>• Missing checksum</li>
                                        <li>• Failed config load</li>
                                        <li>• Failed template load</li>
                                    </ul>
                                    <p className="text-xs text-muted-foreground mt-3">These are red/amber toast-style popups with retry/docs buttons.</p>
                                </div>
                                <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">API Error Responses</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead><tr className="border-b border-border/50 text-left"><th className="pb-2 pr-4 font-medium text-foreground">Code</th><th className="pb-2 font-medium text-foreground">Meaning</th></tr></thead>
                                            <tbody className="divide-y divide-border/30">
                                                {[["401","Invalid or missing project credentials"],["422","Zod validation error (malformed payload)"],["429","Rate limited (30 req/min exceeded)"],["500","Server error"]].map(([code,desc],i)=>(
                                                    <tr key={i}><td className="py-2 pr-4"><code className="font-mono text-red-500">{code}</code></td><td className="py-2 text-muted-foreground">{desc}</td></tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* ── Notes & Gotchas ── */}
                        <section data-section="notes" className="scroll-mt-24">
                            <h2 className="text-2xl font-bold text-foreground mb-4">Notes &amp; Gotchas</h2>
                            <div className="rounded-xl border border-border/50 bg-card/80 p-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {[
                                        "projectId MUST be exactly 24 characters.",
                                        "Type 0 icon does NOT allow URLs — use emoji, SVG, or base64. Type 2 icon DOES allow URLs.",
                                        "Type -1 uses \"data\" (not \"body\"). Type 0/2 use \"body\" (not \"data\").",
                                        "Type 1 requires BOTH template_id AND custom_template. Neither body nor data should be present.",
                                        "Max buttons: 3 for types 0/2, 2 for type -1 (browser limitation).",
                                        "Button action \"event\" requires the \"event\" field (event name string). The \"data\" field is optional.",
                                        "Overrides only apply for premium projects (is_tff = true). Free tier uses dashboard config only.",
                                        "SSE auto-reconnects on disconnect. No manual retry needed.",
                                        "Push permission (type -1) must be granted by the user. The SDK asks automatically on load.",
                                        "Tag dedup (type 2): sending same tag replaces the existing notification.",
                                        "Stacking (type 2): maxVisible defaults to 3. Excess goes to queue. Queue drains on dismiss.",
                                        "Branding footer is ALWAYS shown unless config.branding.show = false.",
                                        "Font: Manrope is loaded from Google Fonts with display=swap.",
                                        "Images with the same URL are prefetched only once (deduped by SDK).",
                                        "Rate limit: 30 notifications/minute per project. 429 = throttled.",
                                    ].map((note, i) => (
                                        <div key={i} className="flex gap-2 text-xs">
                                            <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                                            <p className="text-muted-foreground">{note}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default PingletDocs;
