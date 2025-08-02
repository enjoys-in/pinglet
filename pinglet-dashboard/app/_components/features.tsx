"use client"
import React from 'react'
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,

} from "@/components/ui/card"
import {

  Star,
  Zap,
  Shield,
  Users,
  BarChart,
  Layers,
} from "lucide-react"
const Features = () => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const features = [
    {
      title: "Smart Targeting",
      description: "Advanced user segmentation and behavioral targeting ensures your messages reach the right people at the perfect moment, increasing engagement rates by up to 250%.",
      icon: <Zap className="size-5" />,
    },
    {
      title: "Lightning Fast Delivery",
      description: "Our global infrastructure delivers notifications in under 5-40ms worldwide. Real-time delivery when it matters most, with 99.9% uptime guarantee.",
      icon: <BarChart className="size-5" />,
    },
    {
      title: "Deep Analytics",
      description: "Comprehensive real-time analytics and A/B testing tools help you optimize every campaign. Track opens, clicks, conversions, and user lifetime value.",
      icon: <BarChart className="size-5" />,
    },
    {
      title: "Enterprise Security",
      description: "Keep your data safe with end-to-end encryption and compliance features.Your data and your users' privacy are our top priority.",
      icon: <Shield className="size-5" />,
    },
    {
      title: "Custom Integration",
      description: "Seamlessly integrate with your existing systems. Our API supports all major platforms with SDKs for iOS, Android, Web, and custom solutions.",
      icon: <Layers className="size-5" />,
    },
    {
      title: "24/7 Support",
      description: "Get help whenever you need it with our dedicated support team.",
      icon: <Star className="size-5" />,
    },
  ]
  return (
    <section id="features" className="w-full py-20 md:py-32">
      <div className="px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
            Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Why Choose Our Custom Push Service</h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
           We don't just send notifications – we craft personalized experiences that your users actually want to receive.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature, i) => (
            <motion.div key={i} variants={item}>
              <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Features