export interface Step {
  step: string
  title: string
  description: string
}

export const steps: Step[] = [
  {
    step: "01",
    title: "Quick Integration",
    description:
      "Add our lightweight SDK or use our REST API. Integration takes less than 5 minutes with comprehensive documentation.",
  },
  {
    step: "02",
    title: "Configure & Customize",
    description:
      "Set up notification templates, user segments, and targeting rules through our dashboard or programmatically via API.",
  },
  {
    step: "03",
    title: "Send & Optimize",
    description:
      "Launch campaigns and watch real-time analytics. AI continuously optimizes delivery times for maximum engagement.",
  },
]
