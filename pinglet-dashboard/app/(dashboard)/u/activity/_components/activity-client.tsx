"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Users, Clock, FileText, ChevronLeft, ChevronRight, Loader2, Eye } from "lucide-react"
import { API } from "@/lib/api/handler"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts"

interface Project {
  id: number
  unique_id: string
  name: string
}

export function ActivityClient({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [stats, setStats] = useState<any>(null)
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const [selectedVisitor, setSelectedVisitor] = useState<string | null>(null)
  const [visitorEvents, setVisitorEvents] = useState<any[]>([])
  const [visitorLoading, setVisitorLoading] = useState(false)
  const limit = 50

  const fetchData = useCallback(async (projectId: string, page: number) => {
    if (!projectId) return
    setLoading(true)
    try {
      const [statsRes, eventsRes] = await Promise.allSettled([
        API.getActivityStats(projectId),
        API.getActivityEvents(projectId, limit, page),
      ])
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data?.result)
      if (eventsRes.status === "fulfilled") setEvents(eventsRes.value.data?.result ?? [])
    } catch {
      setStats(null)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedProject) {
      setOffset(0)
      fetchData(selectedProject, 0)
    }
  }, [selectedProject, fetchData])

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset)
    fetchData(selectedProject, newOffset)
  }

  const handleVisitorClick = async (visitorId: string) => {
    setSelectedVisitor(visitorId)
    setVisitorLoading(true)
    try {
      const res = await API.getVisitorEvents(selectedProject, visitorId)
      setVisitorEvents(res.data?.result ?? [])
    } catch {
      setVisitorEvents([])
    } finally {
      setVisitorLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activity Tracking</h1>
          <p className="text-sm text-muted-foreground">Monitor visitor activity across your projects</p>
        </div>
        <Select value={selectedProject} onValueChange={setSelectedProject}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.unique_id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedProject ? (
        <Card>
          <CardContent className="py-16 text-center text-muted-foreground">
            <Activity className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>Select a project to view activity data</p>
          </CardContent>
        </Card>
      ) : loading && !stats ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Total Events</CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.stats?.totalEvents?.toLocaleString() ?? 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Unique Visitors (7d)</CardTitle>
                <Users className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.uniqueVisitors?.toLocaleString() ?? 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Avg Session Duration</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.avgDuration ? `${Math.round(stats.avgDuration / 1000)}s` : "—"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs font-medium text-muted-foreground">Top Pages</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.topPages?.length ?? 0}</div>
              </CardContent>
            </Card>
          </div>

          {/* Top Pages Chart */}
          {stats?.topPages?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold">Top Pages</CardTitle>
                <CardDescription className="text-xs">Most visited pages by event count</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={stats.topPages.slice(0, 10)} layout="vertical" margin={{ left: 120 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" />
                    <YAxis dataKey="page" type="category" tick={{ fontSize: 11 }} width={120} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(262, 83%, 58%)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Visitor Detail Panel */}
          {selectedVisitor && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-semibold">Visitor: {selectedVisitor}</CardTitle>
                    <CardDescription className="text-xs">Event timeline for this visitor</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedVisitor(null)}>Close</Button>
                </div>
              </CardHeader>
              <CardContent>
                {visitorLoading ? (
                  <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
                ) : visitorEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No events found</p>
                ) : (
                  <div className="space-y-3">
                    {visitorEvents.map((e: any, i: number) => (
                      <div key={e.id || i} className="flex items-start gap-3 p-3 rounded-lg border">
                        <div className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px]">{e.event_type}</Badge>
                            <span className="text-xs text-muted-foreground">{e.duration_ms ? `${Math.round(e.duration_ms / 1000)}s` : ""}</span>
                          </div>
                          <p className="text-xs font-medium truncate mt-1">{e.page_title || e.page_url}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{e.page_url}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {e.created_at ? new Date(e.created_at).toLocaleTimeString() : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Events Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold">Recent Events</CardTitle>
                  <CardDescription className="text-xs">Activity event feed</CardDescription>
                </div>
                <Badge variant="secondary" className="text-xs">{events.length} events</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {events.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">Type</TableHead>
                        <TableHead className="text-xs">Visitor ID</TableHead>
                        <TableHead className="text-xs">Page URL</TableHead>
                        <TableHead className="text-xs">Title</TableHead>
                        <TableHead className="text-xs text-right">Duration</TableHead>
                        <TableHead className="text-xs">Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((event: any, i: number) => (
                        <TableRow key={event.id || i}>
                          <TableCell><Badge variant="outline" className="text-[10px]">{event.event_type}</Badge></TableCell>
                          <TableCell>
                            <button
                              onClick={() => handleVisitorClick(event.visitor_id)}
                              className="text-xs font-mono text-primary hover:underline"
                            >
                              {event.visitor_id?.slice(0, 8)}…
                            </button>
                          </TableCell>
                          <TableCell className="text-xs max-w-[200px] truncate">{event.page_url}</TableCell>
                          <TableCell className="text-xs max-w-[150px] truncate">{event.page_title || "—"}</TableCell>
                          <TableCell className="text-xs text-right">{event.duration_ms ? `${Math.round(event.duration_ms / 1000)}s` : "—"}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">{event.created_at ? new Date(event.created_at).toLocaleString() : "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => handlePageChange(Math.max(0, offset - limit))}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-xs text-muted-foreground">Page {Math.floor(offset / limit) + 1}</span>
                    <Button variant="outline" size="sm" disabled={events.length < limit} onClick={() => handlePageChange(offset + limit)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center text-sm text-muted-foreground">No activity events yet</div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
