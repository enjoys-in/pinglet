export interface Testimonial {
  quote: string
  author: string
  role: string
  rating: number
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "Pinglet made push notifications super easy to set up. We had it running in our SaaS app within 15 minutes — no complex configs needed.",
    author: "Arjun Mehta",
    role: "Indie Hacker, ShipFast",
    rating: 5,
  },
  {
    quote:
      "The free tier is perfect for our MVP. We're sending notifications to our first 200 users without paying a dime. Will definitely upgrade as we grow.",
    author: "Priya Sharma",
    role: "Co-founder, DevPulse",
    rating: 5,
  },
  {
    quote:
      "Clean API, simple dashboard, and it just works. Exactly what a small team needs — no bloated enterprise features getting in the way.",
    author: "Rahul Verma",
    role: "Full-stack Dev, BuildCraft",
    rating: 4,
  },
  {
    quote:
      "We switched from Firebase Cloud Messaging and the developer experience is night and day. Pinglet's widget builder saved us hours.",
    author: "Sneha Kapoor",
    role: "Frontend Lead, PixelForge",
    rating: 5,
  },
  {
    quote:
      "Love the analytics — finally I can see which notifications my users actually engage with. Super helpful for a bootstrapped product.",
    author: "Vikram Joshi",
    role: "Solo Founder, TaskLoop",
    rating: 4,
  },
  {
    quote:
      "Still early but very promising. The team ships fast and the support was quick to respond when I had integration questions.",
    author: "Ananya Reddy",
    role: "CTO, NoteStack",
    rating: 4,
  },
]
