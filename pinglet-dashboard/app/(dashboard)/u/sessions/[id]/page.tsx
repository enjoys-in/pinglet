import serverAxios from "@/lib/api/server.instance"
import { ReplayClient } from "./_components/replay-client"

async function fetchSession(id: string) {
  try {
    const { data } = await serverAxios.get('/api/v1/sessions/' + id)
    return data?.result ?? null
  } catch {
    return null
  }
}

export default async function SessionReplayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await fetchSession(id)

  if (!session) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Session not found</p>
      </div>
    )
  }

  return <ReplayClient session={session} />
}
