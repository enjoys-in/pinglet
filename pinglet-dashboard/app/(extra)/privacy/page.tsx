export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-border/40 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: June 2025</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We collect information you provide directly, such as your name, email, and account details when you register.
              We also collect usage data including notification delivery metrics, API usage patterns, and browser information needed for push notification delivery.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use your information to provide and improve our services, send notifications on your behalf, provide analytics and insights,
              communicate with you about your account, and ensure the security of our platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Data Storage & Security</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your data is stored securely with encryption at rest and in transit. We implement industry-standard security measures
              including SRI checksums, domain validation, and project-scoped access tokens.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Third-Party Services</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We may use third-party services for analytics, error tracking, and infrastructure. These services have their own privacy policies
              and we ensure they meet our data protection standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have the right to access, correct, or delete your personal data. You can export your data or close your account at any time
              through your dashboard settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Contact</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              For privacy-related questions, contact us at support@pinglet.enjoys.in.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
