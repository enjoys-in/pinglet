import serverAxios from "@/lib/api/server.instance"
import { ActivityClient } from "./_components/activity-client"

async function fetchActivityData() {
  const [projectsRes] = await Promise.allSettled([
    serverAxios.get('/api/v1/projects'),
  ])

  return {
    projects: projectsRes.status === 'fulfilled' ? projectsRes.value.data?.result : [],
  }
}

export default async function ActivityPage() {
  const data = await fetchActivityData()
  return <ActivityClient projects={data.projects} />
}
