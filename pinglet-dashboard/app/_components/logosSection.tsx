const companies = [
  "IndieHackers", "SideProject", "DevTools", "LaunchPad", "BuildShip",
  "CodeCraft", "StartupKit", "ShipFast", "NextStack", "PixelForge",
]

export default function LogosSection() {
  return (
    <section className="w-full py-14">
      <div className="mx-auto max-w-6xl px-6">
        <p className="mb-8 text-center text-[13px] font-medium text-muted-foreground/70">
          Built for indie hackers & growing startups
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-marquee flex w-max items-center gap-16">
            {[...companies, ...companies].map((company, i) => (
              <span
                key={`${company}-${i}`}
                className="whitespace-nowrap text-lg font-bold text-foreground/15 transition-all duration-500 hover:text-primary/40"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
        {/* Subtle divider */}
        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-border/60 to-transparent" />
      </div>
    </section>
  )
}
