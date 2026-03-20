export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: June 2025</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By accessing or using Pinglet, you agree to be bound by these Terms of Service. If you do not agree, do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Service Description</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pinglet provides a notification delivery platform including APIs, SDKs, and a dashboard for managing push notifications,
              in-app notifications, and related services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Acceptable Use</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You agree not to use Pinglet for spam, malware distribution, phishing, or any illegal purpose.
              Notifications must comply with applicable laws and respect user consent.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Rate Limits & Fair Use</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              API usage is subject to rate limits (currently 30 requests/minute). Exceeding limits may result in temporary throttling.
              Enterprise plans have custom limits.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Account Responsibility</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You are responsible for maintaining the security of your account credentials, API keys, and project tokens.
              Notify us immediately of any unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Limitation of Liability</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pinglet is provided &quot;as is&quot; without warranties. We are not liable for any indirect, incidental, or consequential damages
              arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Contact</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For questions about these terms, contact us at support@pinglet.enjoys.in.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
