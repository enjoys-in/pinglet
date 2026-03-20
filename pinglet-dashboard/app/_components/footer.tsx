import Link from "next/link"
import { Bell, Heart, Github } from "lucide-react"

const footerSections = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Integrations", href: "/integrations" },
    { label: "Changelog", href: "/changelog" },
  ],
  Developers: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/docs" },
    { label: "Payload Creator", href: "/payload-creator" },
    { label: "Guides", href: "/guides" },
    { label: "Status", href: "/status" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
    { label: "Cookies", href: "/cookies" },
  ],
}

export default function Footer() {
  return (
    <footer className="w-full border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-purple-500 text-white shadow-sm shadow-primary/20 transition-shadow group-hover:shadow-md group-hover:shadow-primary/30">
                <Bell className="size-3.5" />
              </div>
              <span className="text-base font-bold tracking-tight">Pinglet</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The modern push notification platform for developers.
              Simple to integrate, powerful to use.
            </p>
            <Link
              href="https://github.com/enjoys-in/pinglet"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="size-4" />
              GitHub
            </Link>
          </div>

          {/* Link columns */}
          {Object.entries(footerSections).map(([category, links]) => (
            <div key={category}>
              <p className="mb-3 text-sm font-medium">{category}</p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />
        <div className="pt-6">
          <p className="flex items-center justify-center gap-1 text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Pinglet &mdash; Made with <Heart className="size-3 fill-red-500 text-red-500" /> by ENJOYS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
