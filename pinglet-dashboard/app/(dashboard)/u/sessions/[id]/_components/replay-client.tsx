"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Clock, User, Globe, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"

interface SessionData {
  id: string
  visitor_id: string
  page_url: string
  duration_ms: number
  events: any[]
  created_at: string
}

export function ReplayClient({ session }: { session: SessionData }) {
  const router = useRouter()
  const playerRef = useRef<HTMLDivElement>(null)
  const playerInstanceRef = useRef<any>(null)

  useEffect(() => {
    if (!session.events?.length || !playerRef.current) return

    let mounted = true

    const initPlayer = async () => {
      try {
        const rrwebPlayer = await import("rrweb-player")
        await import("rrweb-player/dist/style.css")

        if (!mounted || !playerRef.current) return

        // Clear previous player
        playerRef.current.innerHTML = ""

        playerInstanceRef.current = new rrwebPlayer.default({
          target: playerRef.current,
          props: {
            events: session.events,
            width: playerRef.current.clientWidth,
            height: 500,
            autoPlay: false,
            showController: true,
            speedOption: [1, 2, 4, 8],
          },
        })
      } catch (e) {
        console.error("Failed to load rrweb-player:", e)
        if (playerRef.current) {
          playerRef.current.innerHTML = '<p class="text-center text-muted-foreground py-8">Failed to load replay player. Make sure rrweb-player is installed.</p>'
        }
      }
    }

    initPlayer()

    return () => {
      mounted = false
      if (playerInstanceRef.current?.$destroy) {
        playerInstanceRef.current.$destroy()
      }
    }
  }, [session.events])

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.push("/u/sessions")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Session Replay</h1>
          <p className="text-sm text-muted-foreground">Watching recorded session</p>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <User className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">Visitor</p>
              <p className="text-xs font-mono font-medium">{session.visitor_id?.slice(0, 16)}…</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">Page</p>
              <p className="text-xs font-medium truncate max-w-[180px]">{session.page_url}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">Duration</p>
              <p className="text-xs font-medium">{session.duration_ms ? `${Math.round(session.duration_ms / 1000)}s` : "—"}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-[10px] text-muted-foreground">Recorded</p>
              <p className="text-xs font-medium">{session.created_at ? new Date(session.created_at).toLocaleString() : "—"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Player */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold">Replay</CardTitle>
              <CardDescription className="text-xs">{session.events?.length ?? 0} events recorded</CardDescription>
            </div>
            <Badge variant="secondary" className="text-xs">{session.events?.length ?? 0} events</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div ref={playerRef} className="rounded-lg overflow-hidden border bg-muted/30" />
        </CardContent>
      </Card>
    </div>
  )
}
