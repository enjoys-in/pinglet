export interface FAQ {
  question: string
  answer: string
}

export const faqs: FAQ[] = [
  {
    question: "How does the free plan work?",
    answer:
      "Our free plan gives you up to 10,000 notifications per month with basic analytics. No credit card required to get started.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "Yes, you can upgrade or downgrade at any time. Upgrades are prorated, and downgrades take effect at your next billing cycle.",
  },
  {
    question: "Is there a limit to how many users I can add?",
    answer:
      "The free plan supports 1 team member. Starter allows up to 3, Professional up to 10, and Enterprise has unlimited team members.",
  },
  {
    question: "Do you offer discounts for indie hackers or open-source?",
    answer:
      "Yes! We have special discounts for open-source projects and indie hackers. Just reach out to us and we'll sort it out.",
  },
  {
    question: "How secure is my data?",
    answer:
      "All data is encrypted in transit and at rest. We follow industry-standard security practices and are compliant with GDPR and CCPA.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "All plans include email support. Professional includes priority responses, and Enterprise gets dedicated Slack or Discord support.",
  },
]
