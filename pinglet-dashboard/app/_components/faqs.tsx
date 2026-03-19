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
    <section id="faq" className="relative w-full bg-muted/30 py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        <FadeIn>
          <SectionHeader
            badge="FAQ"
            title="Frequently asked questions"
            description="Everything you need to know. Can't find what you're looking for? Reach out to our support team."
          />
        </FadeIn>

        <FadeIn delay={0.1} className="mx-auto max-w-2xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-b border-border/30"
              >
                <AccordionTrigger className="py-5 text-left text-[15px] font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  )
}
