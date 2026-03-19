"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Inbox, ChevronLeft, ChevronRight, Loader2, Mail, MailOpen, Trash2, CheckCheck } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { API } from "@/lib/api/handler"

interface Project {
  id: number
  unique_id: string
  name: string
}

interface InboxItem {
  id: string
  title: string
  body: string
  is_read: boolean
  created_at: string
  notification_id?: string
}

export function InboxClient({ projects }: { projects: Project[] }) {
  const [selectedProject, setSelectedProject] = useState<string>("")
  const [subscriberId, setSubscriberId] = useState<string>("")
  const [items, setItems] = useState<InboxItem[]>([])
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0)
  const limit = 30

  const fetchInbox = useCallback(async (projectId: string, subId: string, page: number) => {
    if (!projectId || !subId) return
    setLoading(true)
    try {
      const res = await API.getInbox(projectId, subId, limit, page)
      setItems(res.data?.result ?? [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearch = () => {
    if (selectedProject && subscriberId.trim()) {
      setOffset(0)
      fetchInbox(selectedProject, subscriberId.trim(), 0)
    }
  }

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset)
    fetchInbox(selectedProject, subscriberId.trim(), newOffset)
  }

  const handleMarkRead = async (id: string) => {
    try {
      await API.markInboxRead(id)
      setItems(prev => prev.map(item => item.id === id ? { ...item, is_read: true } : item))
    } catch {}
  }

  const handleMarkAllRead = async () => {
    if (!selectedProject || !subscriberId.trim()) return
    try {
      await API.markAllInboxRead(selectedProject, subscriberId.trim())
      setItems(prev => prev.map(item => ({ ...item, is_read: true })))
    } catch {}
  }

  const handleDelete = async (id: string) => {
    try {
      await API.deleteInboxItem(id)
      setItems(prev => prev.filter(item => item.id !== id))
    } catch {}
  }

  const unreadCount = items.filter(i => !i.is_read).length

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notification Inbox</h1>
        <p className="text-sm text-muted-foreground">View in-app notifications delivered to subscribers</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
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
            <Input
              placeholder="Subscriber ID"
              value={subscriberId}
              onChange={(e) => setSubscriberId(e.target.value)}
              className="w-full sm:w-[260px]"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={!selectedProject || !subscriberId.trim()}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inbox Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Inbox className="h-4 w-4 text-primary" />
                Inbox
                {unreadCount > 0 && (
                  <Badge variant="default" className="text-[10px] px-1.5 py-0">{unreadCount} unread</Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs">{items.length} items loaded</CardDescription>
            </div>
            {items.length > 0 && unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
                <CheckCheck className="h-3.5 w-3.5 mr-1.5" />
                Mark all read
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Inbox className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">{selectedProject && subscriberId ? "No inbox items found" : "Select a project and enter a subscriber ID"}</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8"></TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Body</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id} className={!item.is_read ? "bg-primary/5" : ""}>
                      <TableCell>
                        {item.is_read ? (
                          <MailOpen className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <Mail className="h-3.5 w-3.5 text-primary" />
                        )}
                      </TableCell>
                      <TableCell className="font-medium text-sm">{item.title}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[300px] truncate">{item.body}</TableCell>
                      <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(item.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!item.is_read && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleMarkRead(item.id)}>
                              <MailOpen className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete inbox item?</AlertDialogTitle>
                                <AlertDialogDescription>This will permanently remove this notification from the subscriber&apos;s inbox.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between pt-4">
                <p className="text-xs text-muted-foreground">Showing {offset + 1}–{offset + items.length}</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={offset === 0} onClick={() => handlePageChange(Math.max(0, offset - limit))}>
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={items.length < limit} onClick={() => handlePageChange(offset + limit)}>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
