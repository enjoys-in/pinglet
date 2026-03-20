import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_ENV === "DEV"
    ? "http://localhost:3000"
    : "https://pinglet.enjoys.in"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/u/", "/api/", "/auth/", "/reset-password/", "/forgot-password/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
