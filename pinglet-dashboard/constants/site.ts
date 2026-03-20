import { __config } from "./config"

export type SiteConfigType = typeof SiteConfig

export const SiteConfig = {
    name: "Pinglet",
    apiUrl: __config.APP.APP_URL,
    description:
        "Modern web push notification service. Send real-time toast, glassmorphism, browser push & template notifications with a lightweight SDK.",
    mainNav: [
        {
            title: "Home",
            href: "/",
        },
    ],
    links: {
        docs: __config.APP.APP_URL,
    },
    ServerName: "Pinglet - Powered by ENJOYS",
    Keywords: [
        // Core product
        "web push notifications",
        "push notification service",
        "in-app notifications",
        "real-time notifications",
        "notification SDK",
        "pinglet",
        "pinglet SDK",

        // Notification types
        "toast notifications",
        "browser push notifications",
        "glassmorphism notifications",
        "custom template notifications",
        "transactional notifications",

        // Developer tools
        "javascript notification library",
        "notification API",
        "lightweight push SDK",
        "server-sent events",
        "SSE notifications",
        "developer notification tool",

        // Features
        "notification flow builder",
        "event-driven notifications",
        "notification automation",
        "notification workflow",
        "notification templates",

        // Use cases
        "user engagement notifications",
        "SaaS notifications",
        "onboarding notifications",
        "marketing notifications",
        "user retention",
        "real-time messaging",
    ],
}