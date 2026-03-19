import React from 'react'
import { DeliveryOverviewChart } from './_components/DeliveryOverviewChart'
import { EngagementRatesChart } from './_components/EngagementRatesChart'
import { NotificationTypesChart } from './_components/NotificationTypesChart'
import { ProjectSubscriberTrendsChart } from './_components/ProjectSubscriberTrendsChart'
import { RequestsOverviewChart } from './_components/RequestsOverviewChart'
import { SubscriberGrowthChart } from './_components/SubscriberGrowthChart'
import { Construction } from 'lucide-react'

const page = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
        <Construction className="h-4 w-4 shrink-0" />
        <p>
          <span className="font-semibold">Analytics is under development.</span>{" "}
          Charts below show sample data for preview purposes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DeliveryOverviewChart />
        <EngagementRatesChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <NotificationTypesChart />
        <SubscriberGrowthChart />
      </div>

      <RequestsOverviewChart />
      <ProjectSubscriberTrendsChart />
    </div>
  )
}

export default page