import Features from "./_components/features"
import HeroSection from "./_components/heroSection"
import { Pricing } from "./_components/pricing"
import FAQs from "./_components/faqs"

import HowItWorks from "./_components/howItWorks"
import CTASection from "./_components/ctaSection"
import MainLayout from "./(extra)/layout"

export default function Page() {

  return (
    <MainLayout>
      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Logos Section */}

        {/* Features Section */}
        <Features />


        {/* How It Works Section */}
        <HowItWorks />

        {/* Testimonials Section */}


        {/* Pricing Section */}
        <Pricing />

        {/* FAQ Section */}
        {/* <FAQs /> */}

        {/* CTA Section */}
        <CTASection />
      </main>
    </MainLayout>

  )
}
