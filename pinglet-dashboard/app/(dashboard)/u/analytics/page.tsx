import { DeliveryOverviewChart } from './_components/DeliveryOverviewChart'
import { EngagementRatesChart } from './_components/EngagementRatesChart'
import { NotificationTypesChart } from './_components/NotificationTypesChart'
import { ProjectSubscriberTrendsChart } from './_components/ProjectSubscriberTrendsChart'
import { RequestsOverviewChart } from './_components/RequestsOverviewChart'
import { SubscriberGrowthChart } from './_components/SubscriberGrowthChart'
import { Construction } from 'lucide-react'
import serverAxios from '@/lib/api/server.instance'

async function fetchAnalyticsData() {
  const [delivery, engagement, types, growth, requests, trends] = await Promise.allSettled([
    serverAxios.get('/api/v1/analytics/delivery-overview?filter=daily'),
    serverAxios.get('/api/v1/analytics/engagement-rates?filter=daily'),
    serverAxios.get('/api/v1/analytics/notification-types?filter=daily'),
    serverAxios.get('/api/v1/analytics/subscriber-growth?filter=monthly'),
    serverAxios.get('/api/v1/analytics/requests-overview?filter=daily'),
    serverAxios.get('/api/v1/analytics/project-subscriber-trends?filter=daily'),
  ])

  return {
    delivery: delivery.status === 'fulfilled' ? delivery.value.data?.result : null,
    engagement: engagement.status === 'fulfilled' ? engagement.value.data?.result : null,
    types: types.status === 'fulfilled' ? types.value.data?.result : null,
    growth: growth.status === 'fulfilled' ? growth.value.data?.result : null,
    requests: requests.status === 'fulfilled' ? requests.value.data?.result : null,
    trends: trends.status === 'fulfilled' ? trends.value.data?.result : null,
  }
}

export default async function AnalyticsPage() {
  const data = await fetchAnalyticsData()
  const hasNoData = Object.values(data).every(v => v === null)

  return (
    <div className="space-y-6">
      {hasNoData && (
        <div className="flex items-center gap-3 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          <Construction className="h-4 w-4 shrink-0" />
          <p>
            <span className="font-semibold">Analytics is under development.</span>{" "}
            Charts below will populate once the backend APIs are live.
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <DeliveryOverviewChart initialData={data.delivery} />
        <EngagementRatesChart initialData={data.engagement} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <NotificationTypesChart initialData={data.types} />
        <SubscriberGrowthChart initialData={data.growth} />
      </div>

      <RequestsOverviewChart initialData={data.requests} />
      <ProjectSubscriberTrendsChart initialData={data.trends} />
    </div>
  )
}