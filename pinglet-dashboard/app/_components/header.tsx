"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Bell, ChevronRight, Menu, Moon, Sun, X } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQ" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { setTheme, resolvedTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const closeMobile = useCallback(() => setMobileMenuOpen(false), [])
  const toggleTheme = useCallback(
    () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
    [resolvedTheme, setTheme],
  )

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex size-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-purple-500 text-white shadow-md shadow-primary/20 transition-shadow group-hover:shadow-lg group-hover:shadow-primary/30">
            <Bell className="size-3.5" />
          </div>
          <span className="text-base font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">Pinglet</span>
        </Link>

        {/* Desktop Nav - Pill */}
        <nav className="hidden items-center rounded-full border border-border/40 bg-card/50 backdrop-blur-sm p-1 shadow-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-[13px] font-medium text-muted-foreground transition-all duration-200 hover:text-foreground hover:bg-muted/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={toggleTheme}
            className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
          >
            <Sun className="size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </button>
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="h-8 text-[13px] font-medium">
              Sign in
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="sm" className="h-8 rounded-full px-4 text-[13px] font-medium bg-gradient-to-r from-primary to-purple-500 hover:shadow-md hover:shadow-primary/20 transition-all duration-300 border-0">
              Get Started
              <ChevronRight className="ml-0.5 size-3.5" />
            </Button>
          </Link>
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            onClick={toggleTheme}
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground"
          >
            <Sun className="size-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
          </button>
          <button
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground"
            onClick={() => setMobileMenuOpen((p) => !p)}
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute inset-x-0 top-16 border-b bg-background/95 backdrop-blur-lg md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={closeMobile}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-2 border-t pt-4">
              <Link href="/auth/login" onClick={closeMobile}>
                <Button variant="outline" className="w-full rounded-full text-sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/auth/login" onClick={closeMobile}>
                <Button className="w-full rounded-full text-sm">
                  Get Started
                  <ChevronRight className="ml-1 size-3.5" />
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
