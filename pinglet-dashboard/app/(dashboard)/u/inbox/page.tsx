import serverAxios from "@/lib/api/server.instance"
import { InboxClient } from "./_components/inbox-client"

async function fetchInboxData() {
  const [projectsRes] = await Promise.allSettled([
    serverAxios.get('/api/v1/projects'),
  ])

  return {
    projects: projectsRes.status === 'fulfilled' ? projectsRes.value.data?.result : [],
  }
}

export default async function InboxPage() {
  const data = await fetchInboxData()
  return <InboxClient projects={data.projects} />
}
