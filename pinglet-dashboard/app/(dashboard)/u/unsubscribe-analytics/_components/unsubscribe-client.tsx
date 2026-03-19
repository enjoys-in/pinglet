"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserMinus, ChevronLeft, ChevronRight, Loader2, TrendingDown, PieChart as PieChartIcon, Calendar } from "lucide-react"
import { API } from "@/lib/api/handler"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts"

const COLORS = ["hsl(262, 83%, 58%)", "hsl(220, 70%, 55%)", "hsl(150, 60%, 45%)", "hsl(40, 90%, 55%)", "hsl(0, 70%, 55%)", "hsl(280, 60%, 50%)", "hsl(180, 50%, 45%)"]

interface Project {
  id: number
  unique_id: string
  name: string
}

interface UnsubReason {
  reason: string
  count: number
}

interface UnsubLog {
  id: string
  subscriber_id: string
  reason: string
  created_at: string
}

export function UnsubscribeClient({ projects, summary }: { projects: Project[]; summary: any }) {
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [reasons, setReasons] = useState<UnsubReason[]>([])
  const [trend, setTrend] = useState<any[]>([])
  const [logs, setLogs] = useState<UnsubLog[]>([])
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const limit = 50

  const fetchData = useCallback(async (projectId: string, page: number) => {
    if (!projectId) return
    setLoading(true)
    try {
      const [reasonsRes, trendRes, logsRes] = await Promise.allSettled([
        API.getUnsubscribeReasons(projectId),
        API.getUnsubscribeTrend(projectId, 30),
        API.getUnsubscribeLogs(projectId, limit, page),
      ])
      if (reasonsRes.status === "fulfilled") setReasons(reasonsRes.value.data?.result ?? [])
      if (trendRes.status === "fulfilled") setTrend(trendRes.value.data?.result ?? [])
      if (logsRes.status === "fulfilled") setLogs(logsRes.value.data?.result ?? [])
    } catch {
      setReasons([])
      setTrend([])
      setLogs([])
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

  const totalUnsubscribes = reasons.reduce((acc, r) => acc + r.count, 0)

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Unsubscribe Analytics</h1>
        <p className="text-sm text-muted-foreground">Track why subscribers opt out of your notifications</p>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {(Array.isArray(summary) ? summary : [summary]).map((s: any, i: number) => (
            <Card key={i}>
              <CardContent className="flex items-center gap-3 py-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/10">
                  <UserMinus className="h-4 w-4 text-rose-500" />
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground">{s.project_name ?? `Project ${i + 1}`}</p>
                  <p className="text-lg font-bold">{s.total_unsubscribes ?? 0}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Project selector */}
      <Card>
        <CardContent className="pt-6">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.unique_id} value={p.unique_id}>{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : selectedProject ? (
        <>
          {/* Charts */}
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {/* Reason breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4 text-primary" />
                  Reason Breakdown
                </CardTitle>
                <CardDescription className="text-xs">{totalUnsubscribes} total unsubscribes</CardDescription>
              </CardHeader>
              <CardContent>
                {reasons.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
                ) : (
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width="50%" height={200}>
                      <PieChart>
                        <Pie data={reasons} dataKey="count" nameKey="reason" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                          {reasons.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [value, "Count"]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2">
                      {reasons.map((r, i) => (
                        <div key={r.reason} className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-muted-foreground capitalize">{r.reason || "Not specified"}</span>
                          </div>
                          <Badge variant="secondary" className="text-[10px]">{r.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-primary" />
                  30-Day Trend
                </CardTitle>
                <CardDescription className="text-xs">Daily unsubscribe count</CardDescription>
              </CardHeader>
              <CardContent>
                {trend.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No data yet</p>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trend}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" allowDecimals={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey="count" stroke="hsl(262, 83%, 58%)" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Logs table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Unsubscribe Logs
              </CardTitle>
              <CardDescription className="text-xs">Individual unsubscribe events</CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <UserMinus className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-sm">No unsubscribe logs found</p>
                </div>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subscriber ID</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-xs">{log.subscriber_id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs capitalize">{log.reason || "Not specified"}</Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(log.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  <div className="flex items-center justify-between pt-4">
                    <p className="text-xs text-muted-foreground">Showing {offset + 1}–{offset + logs.length}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => handlePageChange(Math.max(0, offset - limit))}>
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="sm" disabled={logs.length < limit} onClick={() => handlePageChange(offset + limit)}>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <UserMinus className="h-8 w-8 mb-2 opacity-40" />
            <p className="text-sm">Select a project to view unsubscribe analytics</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
