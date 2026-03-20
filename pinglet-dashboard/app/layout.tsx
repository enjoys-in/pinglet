import "./globals.css"
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

import NextTopLoader from 'nextjs-toploader';
const inter = Inter({ subsets: ["latin"] })

const SITE_URL = process.env.NEXT_PUBLIC_APP_ENV === "DEV"
  ? "http://localhost:3000"
  : "https://pinglet.enjoys.in"

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark light",
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  // ─── Core ────────────────────────────────────────────────
  title: {
    default: "Pinglet — Web Push Notification Service",
    template: "%s | Pinglet",
  },
  description:
    "Send real-time in-app toast, glassmorphism overlays, browser push & custom template notifications to your users. Lightweight SDK, visual flow builder, and powerful API.",
  applicationName: "Pinglet",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  creator: "ENJOYS",
  publisher: "ENJOYS",
  category: "Developer Tools",

  // ─── Keywords ────────────────────────────────────────────
  keywords: [
    "web push notifications",
    "push notification service",
    "in-app notifications",
    "real-time notifications",
    "notification SDK",
    "javascript notification library",
    "browser push notifications",
    "toast notifications",
    "glassmorphism notifications",
    "notification API",
    "pinglet",
    "pinglet SDK",
    "notification flow builder",
    "event-driven notifications",
    "user engagement",
    "SaaS notifications",
    "notification templates",
    "custom notifications",
    "notification workflow",
    "web notification service",
    "lightweight push SDK",
    "developer notification tool",
    "notification automation",
    "server-sent events notifications",
    "SSE notifications",
    "real-time messaging",
    "user retention notifications",
    "transactional notifications",
    "marketing notifications",
    "onboarding notifications",
  ],

  // ─── Open Graph ──────────────────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Pinglet",
    title: "Pinglet — Web Push Notification Service",
    description:
      "Send real-time in-app toast, glassmorphism overlays, browser push & template notifications. Lightweight SDK, visual flow builder, powerful API.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pinglet — Web Push Notification Service",
        type: "image/png",
      },
    ],
  },

  // ─── Twitter / X Card ────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "Pinglet — Web Push Notification Service",
    description:
      "Real-time toast, push, glassmorphism & template notifications. Lightweight SDK + visual flow builder.",
    images: ["/og-image.png"],
    creator: "@enjoys_in",
  },

  // ─── Robots ──────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ─── Icons ───────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },

  // ─── Alternate & Canonical ───────────────────────────────
  alternates: {
    canonical: SITE_URL,
  },

  // ─── Verification (add IDs when available) ───────────────
  // verification: {
  //   google: "your-google-verification-code",
  //   yandex: "your-yandex-verification-code",
  //   yahoo: "your-yahoo-verification-code",
  // },

  // ─── Other meta tags ─────────────────────────────────────
  other: {
    "msapplication-TileColor": "#7c3aed",
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "Pinglet",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Pinglet",
              applicationCategory: "DeveloperApplication",
              operatingSystem: "Web",
              description:
                "Modern web push notification service. Send real-time toast, glassmorphism, browser push & template notifications with a lightweight SDK.",
              url: SITE_URL,
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "INR",
                description: "Free tier available",
              },
              author: {
                "@type": "Organization",
                name: "ENJOYS",
                url: "https://enjoys.in",
              },
            }),
          }}
        />
        <NextTopLoader color="hsl(262, 83%, 58%)" />
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
