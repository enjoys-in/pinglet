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
      "User limits depend on your plan. Starter allows up to 5, Professional up to 20, and Enterprise has unlimited team members.",
  },
  {
    question: "Do you offer discounts for nonprofits?",
    answer:
      "Yes, we offer special pricing for nonprofits, educational institutions, and open-source projects. Contact our sales team for details.",
  },
  {
    question: "How secure is my data?",
    answer:
      "All data is encrypted in transit and at rest. We follow industry-standard security practices and are compliant with GDPR and CCPA.",
  },
  {
    question: "What kind of support do you offer?",
    answer:
      "All plans include email support. Professional includes priority support, and Enterprise includes 24/7 phone and email support plus a dedicated account manager.",
  },
]
