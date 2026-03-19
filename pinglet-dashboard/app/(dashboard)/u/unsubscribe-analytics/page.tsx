import serverAxios from "@/lib/api/server.instance"
import { UnsubscribeClient } from "./_components/unsubscribe-client"

async function fetchUnsubscribeData() {
  const [projectsRes, summaryRes] = await Promise.allSettled([
    serverAxios.get('/api/v1/projects'),
    serverAxios.get('/api/v1/unsubscribe-analytics/summary'),
  ])

  return {
    projects: projectsRes.status === 'fulfilled' ? projectsRes.value.data?.result : [],
    summary: summaryRes.status === 'fulfilled' ? summaryRes.value.data?.result : null,
  }
}

export default async function UnsubscribeAnalyticsPage() {
  const data = await fetchUnsubscribeData()
  return <UnsubscribeClient projects={data.projects} summary={data.summary} />
}
