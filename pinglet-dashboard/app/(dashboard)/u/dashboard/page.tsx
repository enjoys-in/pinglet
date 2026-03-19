import serverAxios from "@/lib/api/server.instance"
import DashboardClient from "./_components/dashboard-client"

async function fetchDashboardData() {
  const [statsRes, notifChartRes, ratesChartRes, subscribersRes] = await Promise.allSettled([
    serverAxios.get('/api/v1/dashboard/stats'),
    serverAxios.get('/api/v1/dashboard/notifications-chart?period=weekly'),
    serverAxios.get('/api/v1/dashboard/rates-chart?period=weekly'),
    serverAxios.get('/api/v1/dashboard/subscribers?limit=10'),
  ])

  return {
    stats: statsRes.status === 'fulfilled' ? statsRes.value.data?.result : null,
    notificationChart: notifChartRes.status === 'fulfilled' ? notifChartRes.value.data?.result : [],
    ratesChart: ratesChartRes.status === 'fulfilled' ? ratesChartRes.value.data?.result : [],
    subscribers: subscribersRes.status === 'fulfilled' ? subscribersRes.value.data?.result : [],
  }
}

export default async function DashboardPage() {
  const data = await fetchDashboardData()

  return <DashboardClient initialData={data} />
}
