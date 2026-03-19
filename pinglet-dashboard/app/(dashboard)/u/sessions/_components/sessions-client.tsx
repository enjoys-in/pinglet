"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Video, Loader2, Trash2, Play, ChevronLeft, ChevronRight } from "lucide-react"
import { API } from "@/lib/api/handler"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Project {
  id: number
  unique_id: string
  name: string
}

export function SessionsClient({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [recordings, setRecordings] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const limit = 20
  const router = useRouter()

  const fetchRecordings = useCallback(async (projectId: string, page: number) => {
    if (!projectId) return
    setLoading(true)
    try {
      const res = await API.getSessionRecordings(projectId, limit, page)
      const result = res.data?.result
      setRecordings(result?.recordings ?? [])
      setTotal(result?.total ?? 0)
    } catch {
      setRecordings([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedProject) {
      setOffset(0)
      fetchRecordings(selectedProject, 0)
    }
  }, [selectedProject, fetchRecordings])

  const handleDelete = async (id: string) => {
    try {
      await API.deleteSession(id)
      setRecordings(prev => prev.filter(r => r.id !== id))
      setTotal(prev => prev - 1)
    } catch { /* ignore */ }
  }

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset)
    fetchRecordings(selectedProject, newOffset)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Session Recordings</h1>
          <p className="text-sm text-muted-foreground">Replay user sessions to understand behavior</p>
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
            <Video className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p>Select a project to view session recordings</p>
          </CardContent>
        </Card>
      ) : loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold">Recordings</CardTitle>
                <CardDescription className="text-xs">{total} total recordings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {recordings.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Visitor ID</TableHead>
                      <TableHead className="text-xs">Page URL</TableHead>
                      <TableHead className="text-xs text-right">Duration</TableHead>
                      <TableHead className="text-xs text-right">Events</TableHead>
                      <TableHead className="text-xs">Created</TableHead>
                      <TableHead className="text-xs text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recordings.map((rec: any) => (
                      <TableRow key={rec.id}>
                        <TableCell className="text-xs font-mono">{rec.visitor_id?.slice(0, 12)}…</TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate">{rec.page_url}</TableCell>
                        <TableCell className="text-xs text-right">{rec.duration_ms ? `${Math.round(rec.duration_ms / 1000)}s` : "—"}</TableCell>
                        <TableCell className="text-xs text-right">
                          <Badge variant="secondary" className="text-[10px]">{rec.event_count ?? "—"}</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{rec.created_at ? new Date(rec.created_at).toLocaleString() : "—"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => router.push(`/u/sessions/${rec.id}`)}>
                              <Play className="h-3.5 w-3.5" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete recording?</AlertDialogTitle>
                                  <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(rec.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-end gap-2 mt-4">
                  <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => handlePageChange(Math.max(0, offset - limit))}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">Page {Math.floor(offset / limit) + 1} of {Math.ceil(total / limit)}</span>
                  <Button variant="outline" size="sm" disabled={offset + limit >= total} onClick={() => handlePageChange(offset + limit)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">No recordings found for this project</div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
