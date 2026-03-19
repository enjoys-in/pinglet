const companies = [
  "Vercel", "Stripe", "Linear", "Notion", "Figma",
  "Slack", "Discord", "Shopify", "Supabase", "Railway",
]

export default function LogosSection() {
  return (
    <section className="w-full border-y border-border/40 py-8">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-6 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
          Trusted by teams at
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-12">
            {[...companies, ...companies].map((company, i) => (
              <span
                key={`${company}-${i}`}
                className="whitespace-nowrap text-base font-semibold text-muted-foreground/40 transition-colors hover:text-muted-foreground/70"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
