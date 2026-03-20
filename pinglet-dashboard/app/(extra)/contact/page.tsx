"use client"
import { useState } from "react"
import { Mail, MessageSquare, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Contact Us</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question or need help? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="rounded-xl border border-border/50 bg-card/80 p-6">
              <Mail className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Email</h3>
              <p className="text-sm text-muted-foreground">support@pinglet.enjoys.in</p>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/80 p-6">
              <MessageSquare className="w-5 h-5 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Community</h3>
              <p className="text-sm text-muted-foreground">Join our Discord or GitHub Discussions for community support.</p>
            </div>
          </div>

          <div className="rounded-xl border border-border/50 bg-card/80 p-6">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-5 h-5 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Message Sent!</h3>
                <p className="text-sm text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
                  <Input placeholder="Your name" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                  <Input type="email" placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                  <Textarea placeholder="How can we help?" rows={4} required />
                </div>
                <Button type="submit" className="w-full rounded-full">Send Message</Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
