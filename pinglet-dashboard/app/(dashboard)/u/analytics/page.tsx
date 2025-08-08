import React from 'react'
import { DeliveryOverviewChart } from './_components/DeliveryOverviewChart'
import { EngagementRatesChart } from './_components/EngagementRatesChart'
import { Card } from '@/components/ui/card'
import { NotificationTypesChart } from './_components/NotificationTypesChart'
import { ProjectSubscriberTrendsChart } from './_components/ProjectSubscriberTrendsChart'
import { RequestsOverviewChart } from './_components/RequestsOverviewChart'
import { SubscriberGrowthChart } from './_components/SubscriberGrowthChart'

const page = () => {
  return (
    <Card className='space-y-6'>
      Under Development
      <DeliveryOverviewChart />
      <EngagementRatesChart />
      <NotificationTypesChart />
      <ProjectSubscriberTrendsChart />
      <RequestsOverviewChart />
      <SubscriberGrowthChart />
    </Card>
  )
}

export default page