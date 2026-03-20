"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft, Megaphone, Bell, Star, Gift, MessageSquare, ShieldCheck,
  Sparkles, Tag, Users, Zap, Eye, Copy, Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { API } from "@/lib/api/handler"
import { toast } from "sonner"
import { db } from "@/lib/db"

interface PrebuiltWidget {
  id: string
  name: string
  description: string
  category: string
  icon: React.ElementType
  iconColor: string
  preview: {
    text: string
    description: string
    buttonText: string
    link: string
    imageUrl: string
  }
}

const prebuiltWidgets: PrebuiltWidget[] = [
  {
    id: "announcement-banner",
    name: "Announcement Banner",
    description: "Display important announcements, updates, or news to your website visitors.",
    category: "Announcements",
    icon: Megaphone,
    iconColor: "text-blue-600",
    preview: {
      text: "🎉 New Feature Released!",
      description: "We just launched our new dashboard with real-time analytics. Check it out!",
      buttonText: "Learn More",
      link: "https://example.com/announcement",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=200&fit=crop",
    },
  },
  {
    id: "promo-popup",
    name: "Promotional Offer",
    description: "Highlight special offers, discounts, or limited-time deals to boost conversions.",
    category: "Marketing",
    icon: Tag,
    iconColor: "text-orange-600",
    preview: {
      text: "🔥 Limited Time Offer!",
      description: "Get 30% off on all premium plans. Use code SAVE30 at checkout.",
      buttonText: "Claim Offer",
      link: "https://example.com/pricing",
      imageUrl: "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=400&h=200&fit=crop",
    },
  },
  {
    id: "new-feature",
    name: "New Feature Spotlight",
    description: "Showcase new features or product updates to keep users engaged.",
    category: "Product",
    icon: Sparkles,
    iconColor: "text-purple-600",
    preview: {
      text: "✨ Try Our New Flow Builder",
      description: "Build complex notification workflows visually with drag-and-drop. No coding required.",
      buttonText: "Try Now",
      link: "https://example.com/features",
      imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
    },
  },
  {
    id: "feedback-request",
    name: "Feedback Request",
    description: "Collect user feedback, ratings, or suggestions with a simple prompt.",
    category: "Engagement",
    icon: MessageSquare,
    iconColor: "text-green-600",
    preview: {
      text: "💬 We'd Love Your Feedback",
      description: "Help us improve! Share your experience and let us know what you think.",
      buttonText: "Give Feedback",
      link: "https://example.com/feedback",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
    },
  },
  {
    id: "social-proof",
    name: "Social Proof",
    description: "Show recent signups, purchases, or activity to build trust and urgency.",
    category: "Marketing",
    icon: Users,
    iconColor: "text-indigo-600",
    preview: {
      text: "🚀 Join 10,000+ Happy Users",
      description: "Teams at top companies trust Pinglet for their notification workflows.",
      buttonText: "Get Started",
      link: "https://example.com/signup",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=200&fit=crop",
    },
  },
  {
    id: "welcome-message",
    name: "Welcome Message",
    description: "Greet new visitors or returning users with a personalized welcome widget.",
    category: "Engagement",
    icon: Bell,
    iconColor: "text-yellow-600",
    preview: {
      text: "👋 Welcome to Pinglet!",
      description: "Get started with our quick setup guide and send your first notification in minutes.",
      buttonText: "Quick Start",
      link: "https://example.com/getting-started",
      imageUrl: "https://images.unsplash.com/photo-1531498860502-7c67cf02f657?w=400&h=200&fit=crop",
    },
  },
  {
    id: "review-request",
    name: "Review Request",
    description: "Ask satisfied users to leave a review or rating for your product.",
    category: "Engagement",
    icon: Star,
    iconColor: "text-amber-500",
    preview: {
      text: "⭐ Enjoying Pinglet?",
      description: "If you're having a great experience, we'd appreciate a quick review!",
      buttonText: "Leave a Review",
      link: "https://example.com/review",
      imageUrl: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=200&fit=crop",
    },
  },
  {
    id: "flash-sale",
    name: "Flash Sale Alert",
    description: "Create urgency with time-limited flash sale notifications.",
    category: "Marketing",
    icon: Zap,
    iconColor: "text-red-600",
    preview: {
      text: "⚡ Flash Sale — Ends Tonight!",
      description: "Save up to 50% on selected items. Don't miss out on these incredible deals.",
      buttonText: "Shop Now",
      link: "https://example.com/sale",
      imageUrl: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400&h=200&fit=crop",
    },
  },
  {
    id: "security-alert",
    name: "Security Notice",
    description: "Inform users about security updates, password changes, or compliance notices.",
    category: "Announcements",
    icon: ShieldCheck,
    iconColor: "text-emerald-600",
    preview: {
      text: "🔒 Security Update",
      description: "We've enhanced our security protocols. Please review the changes and update your settings.",
      buttonText: "Review Changes",
      link: "https://example.com/security",
      imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=200&fit=crop",
    },
  },
  {
    id: "referral-program",
    name: "Referral Program",
    description: "Promote your referral program and encourage users to invite friends.",
    category: "Marketing",
    icon: Gift,
    iconColor: "text-pink-600",
    preview: {
      text: "🎁 Refer & Earn Rewards",
      description: "Invite your friends and earn free credits for every successful referral!",
      buttonText: "Invite Friends",
      link: "https://example.com/referral",
      imageUrl: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&h=200&fit=crop",
    },
  },
]

const categories = ["All", ...Array.from(new Set(prebuiltWidgets.map((w) => w.category)))]

export default function PrebuiltWidgetsPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [previewWidget, setPreviewWidget] = useState<PrebuiltWidget | null>(null)
  const [creating, setCreating] = useState<string | null>(null)
  const router = useRouter()

  const filteredWidgets =
    activeCategory === "All"
      ? prebuiltWidgets
      : prebuiltWidgets.filter((w) => w.category === activeCategory)

  const handleUseTemplate = async (widget: PrebuiltWidget) => {
    try {
      setCreating(widget.id)
      const payload = {
        text: widget.preview.text,
        description: widget.preview.description,
        buttonText: widget.preview.buttonText,
        link: widget.preview.link,
        mediaType: "image" as const,
        imageSource: "url" as const,
        imageUrl: widget.preview.imageUrl,
      }
      const { data } = await API.createWidget(payload)
      if (!data.success) {
        throw new Error(data.message || "Failed to create widget")
      }
      if (data.result) {
        db.putItem("widgets", data.result as any)
      }
      toast.success(`"${widget.name}" widget created!`)
      router.push("/u/widgets")
    } catch (error) {
      toast.error((error as Error).message || "Something went wrong")
    } finally {
      setCreating(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/u/widgets">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Widgets
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Prebuilt Widgets</h1>
        <p className="text-muted-foreground mt-1">
          Choose a template to get started quickly. Customize it after creation.
        </p>
      </div>

      {/* Category Filter */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat}>
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredWidgets.map((widget) => {
          const Icon = widget.icon
          return (
            <Card key={widget.id} className="group hover:shadow-md transition-shadow flex flex-col">
              {/* Preview Image */}
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={widget.preview.imageUrl}
                  alt={widget.name}
                  className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <Badge className="absolute top-3 left-3 bg-background/80 text-foreground backdrop-blur-sm">
                  {widget.category}
                </Badge>
              </div>

              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <div className={`rounded-md bg-muted p-1.5 ${widget.iconColor}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <CardTitle className="text-base">{widget.name}</CardTitle>
                </div>
                <CardDescription className="text-sm line-clamp-2">
                  {widget.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0 mt-auto">
                {/* Mini Preview */}
                <div className="rounded-md border bg-muted/30 p-3 mb-4 space-y-1">
                  <p className="text-sm font-medium truncate">{widget.preview.text}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {widget.preview.description}
                  </p>
                  <span className="inline-block text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded mt-1">
                    {widget.preview.buttonText}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setPreviewWidget(previewWidget?.id === widget.id ? null : widget)}
                  >
                    <Eye className="mr-1.5 h-3.5 w-3.5" />
                    Preview
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    disabled={creating === widget.id}
                    onClick={() => handleUseTemplate(widget)}
                  >
                    {creating === widget.id ? (
                      "Creating..."
                    ) : (
                      <>
                        <Copy className="mr-1.5 h-3.5 w-3.5" />
                        Use Template
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Live Widget Preview (floating) */}
      {previewWidget && (
        <div
          className="fixed bottom-5 right-5 z-50 w-[220px] rounded-xl border bg-white shadow-xl overflow-hidden"
          style={{ fontFamily: "system-ui, sans-serif" }}
        >
          <button
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-sm hover:bg-gray-200 transition-colors z-10"
            onClick={() => setPreviewWidget(null)}
          >
            ×
          </button>
          <img
            src={previewWidget.preview.imageUrl}
            alt=""
            className="w-full h-[100px] object-cover"
          />
          <div className="p-3 space-y-2">
            <p className="text-sm font-semibold text-gray-800 leading-tight">
              {previewWidget.preview.text}
            </p>
            <p className="text-xs text-gray-600 leading-snug line-clamp-3">
              {previewWidget.preview.description}
            </p>
            <span className="inline-block text-xs bg-black text-white px-3 py-1.5 rounded-md font-medium">
              {previewWidget.preview.buttonText}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}