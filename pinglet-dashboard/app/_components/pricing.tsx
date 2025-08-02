"use client"
import { Button } from '@/components/ui/button'
import { CardContent, Card } from '@/components/ui/card';
import { Check, Sparkles, Zap } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export const Pricing = () => {
  const features = [
    { text: "Up to 10K notifications/month", icon: Check },
    { text: "Basic analytics dashboard", icon: Sparkles },
    { text: "Standard delivery speed", icon: Check },
    { text: "Email support", icon: Check },
    { text: "Basic targeting options", icon: Check },
    { text: "10 Widgets", icon: Check },
    { text: "Limited integrations", icon: Check }
  ];
  return (
    <section id="pricing" className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

      <div className="px-4 md:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
        >
          <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
            Pricing
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
          <p className="max-w-[800px] text-muted-foreground md:text-lg">
            Choose the plan that's right for your business.
          </p>
        </motion.div>

        <div className="mx-auto max-w-5xl">
          <div className=" flex items-center justify-center p-4 sm:p-6 lg:p-8">


            {/* Main Card */}
            <div className="relative w-full">
              <div className="group relative bg-white/5 dark:bg-white/[0.02] backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-2">

                {/* Gradient Border Effect */}
                <div className="absolute inset-0  rounded-3xl bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                <div className="absolute inset-[1px] rounded-3xl bg-slate-900/90 dark:bg-black/90"></div>

                {/* Content Container */}
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center ">

                  {/* Plan Info Section */}
                  <div className="lg:col-span-4 text-center lg:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 mb-4">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-purple-300">For Developers</span>
                    </div>
                    {/* Background Effects */}
                    <div className="absolute inset-0 overflow-hidden">
                      <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-700"></div>
                      <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-3">
                      Free Plan
                    </h2>

                    <p className="text-slate-300 dark:text-slate-400 text-lg mb-6 leading-relaxed">
                      Perfect for small teams and startups looking to scale their notification system.
                    </p>

                    <div className="flex items-baseline justify-center lg:justify-start gap-2 mb-6">
                      <span className="text-5xl sm:text-6xl font-bold text-white">$0</span>
                      <div className="text-slate-400">
                        <div className="text-sm">/month</div>
                        <div className="text-xs">billed monthly</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 lg:hidden">
                      <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-2xl font-bold text-white">10K</div>
                        <div className="text-xs text-slate-400">Notifications</div>
                      </div>
                      <div className="text-center p-3 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-2xl font-bold text-white">10</div>
                        <div className="text-xs text-slate-400">Widgets</div>
                      </div>
                    </div>
                  </div>

                  {/* Features Section */}
                  <div className="lg:col-span-5">
                    <h3 className="text-xl font-semibold text-white mb-6 text-center lg:text-left">Everything you need to get started</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group/item"
                          >
                            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center group-hover/item:scale-110 transition-transform duration-300">
                              <IconComponent className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-slate-200 text-sm font-medium group-hover/item:text-white transition-colors duration-300">
                              {feature.text}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CTA Section */}
                  <div className="lg:col-span-3 flex flex-col items-center justify-center space-y-4">
                   

                    <div className="text-center">
                     
                      <p className="text-xs text-slate-500">No credit card required</p>
                    </div>

                    {/* Trust Indicators */}
                    <div className="hidden lg:flex flex-col items-center gap-3 pt-6 border-t border-white/10">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-sm"></div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-400 text-center">
                        Trusted by 10,000+ teams worldwide
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-6 right-6 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-75"></div>
                <div className="absolute bottom-8 left-8 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>

              {/* Mobile Trust Indicators */}
              <div className="lg:hidden flex flex-col items-center gap-3 mt-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-sm"></div>
                  ))}
                </div>
                <p className="text-xs text-slate-400 text-center">
                  Trusted by 10,000+ teams worldwide
                </p>
              </div>
            </div>
          </div>
          <Tabs defaultValue="monthly" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="rounded-full p-1">
                <TabsTrigger value="monthly" className="rounded-full px-6">
                  Monthly
                </TabsTrigger>
                <TabsTrigger value="annually" className="rounded-full px-6">
                  Annually (Save 20%)
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="monthly">
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                {[
                  {
                    name: "Starter",
                    price: "$7",
                    description: "Perfect for small teams and startups.",
                    features: ["Up to 50-100K notifications/month",
                      "Basic analytics dashboard", "Basic analytics",
                      "Standard delivery speed", "Email support",
                      "Basic targeting options",
                      "100 Widgets",
                      "Limited integrations"
                    ],
                    cta: "Start Now",
                  },
                  {
                    name: "Professional",
                    price: "$29",
                    description: "Ideal for growing businesses.",
                    features: [
                      "Up to 500K notifications/month",
                      "Advanced analytics",
                      "Upto 250 Custom Widgets",
                      "Limited Custom HTML Editor",
                      "Browser notifications",
                      "Priority email support",
                      "Advanced analytics & A/B testing",
                      "Limited Webhooks",
                    ],
                    cta: "Start Now",
                    popular: true,
                  },
                  {
                    name: "Enterprise",
                    price: "$99",
                    description: "For large organizations with complex needs.",
                    features: [
                      "Unlimited notifications",
                      "Custom analytics",
                      "AI-powered optimization",
                      "24/7 phone & email support",
                      "Advanced API access",
                      "Browser notifications",
                      "Unlimited Custom Widgets",
                      "Domain and White-label solution",
                      "Webhook integration",
                      "Custom HTML templates & editor",
                    ],
                    cta: "Contact Sales",
                  },
                ].map((plan, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card
                      className={`relative overflow-hidden h-full ${plan.popular ? "border-primary shadow-lg" : "border-border/40 shadow-md"} bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                          Most Popular
                        </div>
                      )}
                      <CardContent className="p-6 flex flex-col h-full">
                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                        <div className="flex items-baseline mt-4">
                          <span className="text-4xl font-bold">{plan.price}</span>
                          <span className="text-muted-foreground ml-1">/month</span>
                        </div>
                        <p className="text-muted-foreground mt-2">{plan.description}</p>
                        <ul className="space-y-3 my-6 flex-grow">
                          {plan.features.map((feature, j) => (
                            <li key={j} className="flex items-center">
                              <Check className="mr-2 size-4 text-primary" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={`w-full mt-auto rounded-full ${plan.popular ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/80"}`}
                          variant={plan.popular ? "default" : "outline"}
                        >
                          {plan.cta}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="annually">
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
                {[
                  {
                    name: "Starter",
                    price: "$5.6",
                    description: "Perfect for small teams and startups.",
                    features: ["Up to 10K notifications/month",
                      "Basic analytics dashboard", "Basic analytics",
                      "Standard delivery speed", "Email support",
                      "Basic targeting options",
                      "10 Widgets",
                      "Limited integrations"
                    ],
                    cta: "Start Free Trial",
                  },
                  {
                    name: "Professional",
                    price: "$24",
                    description: "Ideal for growing businesses.",
                    features: [
                      "Up to 100K notifications/month",
                      "Advanced analytics",
                      "25GB storage",
                      "Upto 250 Custom Widgets",
                      "Limited Custom HTML Editor",
                      "Browser notifications",
                      "Priority email support",
                      "Advanced analytics & A/B testing",
                      "Limited Webhooks",
                    ],
                    cta: "Start Free Trial",
                    popular: true,
                  },
                  {
                    name: "Enterprise",
                    price: "$80",
                    description: "For large organizations with complex needs.",
                    features: [
                      "Unlimited notifications",
                      "Custom analytics",
                      "AI-powered optimization",
                      "24/7 phone & email support",
                      "Advanced API access",
                      "Browser notifications",
                      "Unlimited Custom Widgets",
                      "Domain and White-label solution",
                      "Webhook integration",
                      "Custom HTML templates & editor",
                    ],
                    cta: "Contact Sales",
                  },
                ].map((plan, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card
                      className={`relative overflow-hidden h-full ${plan.popular ? "border-primary shadow-lg" : "border-border/40 shadow-md"} bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                          Most Popular
                        </div>
                      )}
                      <CardContent className="p-6 flex flex-col h-full">
                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                        <div className="flex items-baseline mt-4">
                          <span className="text-4xl font-bold">{plan.price}</span>
                          <span className="text-muted-foreground ml-1">/month</span>
                        </div>
                        <p className="text-muted-foreground mt-2">{plan.description}</p>
                        <ul className="space-y-3 my-6 flex-grow">
                          {plan.features.map((feature, j) => (
                            <li key={j} className="flex items-center">
                              <Check className="mr-2 size-4 text-primary" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={`w-full mt-auto rounded-full ${plan.popular ? "bg-primary hover:bg-primary/90" : "bg-muted hover:bg-muted/80"}`}
                          variant={plan.popular ? "default" : "outline"}
                        >
                          {plan.cta}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  )
}

