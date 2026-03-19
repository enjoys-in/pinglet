export interface Testimonial {
  quote: string
  author: string
  role: string
  rating: number
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Pinglet has transformed how we engage our users. The targeting features alone increased our click-through rates by 250%.",
    author: "Sarah Johnson",
    role: "Product Manager, TechCorp",
    rating: 5,
  },
  {
    quote:
      "The analytics dashboard provides insights we never had before. Data-driven decisions have significantly improved our ROI.",
    author: "Michael Chen",
    role: "Marketing Director, GrowthLabs",
    rating: 5,
  },
  {
    quote:
      "Implementation was seamless and the ROI was almost immediate. We reduced operational costs by 30% since switching.",
    author: "Emily Rodriguez",
    role: "Operations Lead, StartupX",
    rating: 5,
  },
  {
    quote:
      "Best notification platform we've used. The API is clean, the docs are great, and the delivery speed is unmatched.",
    author: "David Kim",
    role: "CTO, InnovateNow",
    rating: 5,
  },
  {
    quote:
      "Our team was up and running in under 10 minutes. The customization options are exactly what we needed for our app.",
    author: "Lisa Patel",
    role: "Engineering Lead, RemoteFirst",
    rating: 5,
  },
  {
    quote:
      "Switched from a legacy provider and immediately saw 3x better delivery rates. The free tier is incredibly generous.",
    author: "James Wilson",
    role: "Founder, ScaleUp",
    rating: 5,
  },
]
