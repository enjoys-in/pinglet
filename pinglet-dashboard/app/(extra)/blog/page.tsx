import Link from "next/link"
import { ArrowRight } from "lucide-react"

const posts = [
  {
    title: "Introducing Pinglet v0.0.3 — Glassmorphism Notifications",
    excerpt: "The latest release brings beautiful glassmorphism HTML notifications with rich media, stacking, and custom events.",
    date: "June 2025",
    tag: "Release",
    slug: "#",
  },
  {
    title: "How to Send Your First Push Notification in 2 Minutes",
    excerpt: "A step-by-step guide to getting real-time notifications running on your website with just two script tags.",
    date: "May 2025",
    tag: "Tutorial",
    slug: "#",
  },
  {
    title: "Custom Events: From Notification Clicks to Frontend Actions",
    excerpt: "Learn how to trigger add-to-cart, modal opens, and navigation from notification button clicks.",
    date: "May 2025",
    tag: "Guide",
    slug: "#",
  },
  {
    title: "Why We Built Pinglet",
    excerpt: "The story behind Pinglet and why we believe push notifications need a better developer experience.",
    date: "April 2025",
    tag: "Story",
    slug: "#",
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Updates, tutorials, and insights from the Pinglet team.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="space-y-6">
          {posts.map((post) => (
            <Link key={post.title} href={post.slug} className="block group">
              <article className="rounded-xl border border-border/50 bg-card/80 p-6 hover:shadow-md transition-all hover:border-primary/30">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-primary/10 text-primary">{post.tag}</span>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
                <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">{post.title}</h2>
                <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                  Read more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
