import serverAxios from "@/lib/api/server.instance"
import { SessionsClient } from "./_components/sessions-client"

async function fetchProjects() {
  const [projectsRes] = await Promise.allSettled([
    serverAxios.get('/api/v1/projects'),
  ])
  return {
    projects: projectsRes.status === 'fulfilled' ? projectsRes.value.data?.result : [],
  }
}

export default async function SessionsPage() {
  const data = await fetchProjects()
  return <SessionsClient projects={data.projects} />
}
