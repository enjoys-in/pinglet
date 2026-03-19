import HeroSection from "./_components/heroSection"
import LogosSection from "./_components/logosSection"
import FeaturesSection from "./_components/features"
import HowItWorksSection from "./_components/howItWorks"
import TestimonialsSection from "./_components/testimonials"
import PricingSection from "./_components/pricing"
import FAQSection from "./_components/faqs"
import CTASection from "./_components/ctaSection"
import MainLayout from "./(extra)/layout"

export default function Page() {
  return (
    <MainLayout>
      <main className="flex-1">
        <HeroSection />
        <LogosSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
    </MainLayout>
  )
}
