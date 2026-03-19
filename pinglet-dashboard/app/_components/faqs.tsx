"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { SectionHeader } from "./shared/section-header"
import { FadeIn } from "./shared/fade-in"
import { faqs } from "./_data/faqs"

export default function FAQSection() {
  return (
    <section id="faq" className="w-full py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          {/* Left heading */}
          <FadeIn>
            <div className="lg:sticky lg:top-24">
              <SectionHeader
                badge="FAQ"
                title="Frequently asked questions"
                description="Can't find what you're looking for? Reach out to our support team."
                align="left"
              />
            </div>
          </FadeIn>

          {/* Right accordion */}
          <FadeIn delay={0.1}>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border-b border-border/40 py-0.5"
                >
                  <AccordionTrigger className="py-4 text-left text-[15px] font-medium hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}
