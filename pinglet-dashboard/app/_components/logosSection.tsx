const companies = [
  "Vercel", "Stripe", "Linear", "Notion", "Figma",
  "Slack", "Discord", "Shopify", "Supabase", "Railway",
]

export default function LogosSection() {
  return (
    <section className="w-full py-12">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-8 text-center text-[13px] font-medium text-muted-foreground">
          Trusted by engineering teams at
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-16">
            {[...companies, ...companies].map((company, i) => (
              <span
                key={`${company}-${i}`}
                className="whitespace-nowrap text-lg font-semibold text-foreground/20 transition-colors duration-300 hover:text-foreground/50"
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
