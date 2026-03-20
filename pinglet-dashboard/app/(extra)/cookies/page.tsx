export default function CookiesPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Cookie Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: June 2025</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">What Are Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Cookies are small text files stored on your device when you visit a website. They help us provide a better experience
              by remembering your preferences and keeping you signed in.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Cookies We Use</h2>
            <div className="space-y-4">
              {[
                { name: "Essential Cookies", desc: "Required for authentication, security, and basic functionality. Cannot be disabled." },
                { name: "Analytics Cookies", desc: "Help us understand usage patterns and improve our services. Can be opted out." },
                { name: "Preference Cookies", desc: "Remember your settings like theme preference (light/dark mode)." },
              ].map((cookie) => (
                <div key={cookie.name} className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <h3 className="text-sm font-medium text-foreground mb-1">{cookie.name}</h3>
                  <p className="text-xs text-muted-foreground">{cookie.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Managing Cookies</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You can manage or delete cookies through your browser settings. Disabling essential cookies may affect the functionality of our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">Contact</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For questions about our cookie usage, contact us at support@pinglet.enjoys.in.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
