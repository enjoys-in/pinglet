"use client"
import { useLayoutEffect, useState } from "react"

import { Plus, Edit, Trash2, MoreHorizontal, RefreshCcw, CopyCheck, LayoutGrid, Clock, Blocks } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { API } from "@/lib/api/handler"

import moment from 'moment';
import { useLoadingStore } from "@/store/loading.store"
import { signal } from "@/lib/requestController"
import { isCancel } from "axios"
import { db } from "@/lib/db"
import Link from "next/link"
import { __config } from "@/constants/config"
import { AllWidgetResponse, Widget } from "@/lib/interfaces/widget.interface"



export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<Widget[]>([])

  const [deleteWidgetId, setDeleteWidgeteId] = useState<number | null>(null)
  const { startLoading, stopLoading, isLoading } = useLoadingStore()
  const { toast } = useToast()



  const handleDelete = async (id: number) => {
    try {
      startLoading()
      const { data } = await API.deleteWidget(id.toString())
      if (!data.success) {
        throw new Error(data.message)
      }
      setWidgets((prev) => prev.filter((w) => w.id !== id))
      setDeleteWidgeteId(null)
      db.deleteItem("widgets", id)
      toast({
        title: "Widget deleted",
        description: "Widget has been deleted successfully.",
      })
    } catch (error: any) {
      if (isCancel(error)) {
        return toast({
          title: "User cancelled request",
          description: "Request cancelled. Please try again.",
          variant: "destructive",
        })
      }
      toast({
        title: "Error",
        description: error.message,
      })
    } finally {
      stopLoading()
    }
  }


  const refreshWidgets = () => {
    API.getWidgets().then((response) => {
      if (response.data.success) {
        setWidgets(response.data.result)
        db.bulkPutItems("widgets", response.data.result as any)
      }
    })
  }
  const fetchWidgets = async () => {
    const items = await db.getAllItems("widgets")
    if (items.length > 0) {
      setWidgets(items as AllWidgetResponse)
      return
    }
    refreshWidgets()
  }

  const handleCopyScript = (widgetId: string) => {
    navigator.clipboard.writeText(`<script src="${__config.APP.BASE_URL}/api/v1/load-widget/${widgetId}"></script>`)
    toast({
      title: "Script copied",
      description: "Widget embed script has been copied to clipboard.",
    })
  }
  useLayoutEffect(() => {
    fetchWidgets()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Widgets</h1>
          <p className="text-muted-foreground mt-1">Manage your notification widgets and embed them on your site</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="widgets/prebuilt">
            <Button variant="outline">
              <Blocks className="mr-2 h-4 w-4" />
              Prebuilt Widgets
            </Button>
          </Link>
          <Link href="widgets/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Widget
            </Button>
          </Link>
          <Button variant="outline" size="icon" className="cursor-pointer" onClick={refreshWidgets} disabled={isLoading}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="rounded-lg bg-primary/10 p-2.5">
              <LayoutGrid className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Widgets</p>
              <p className="text-2xl font-bold">{widgets.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="rounded-lg bg-emerald-500/10 p-2.5">
              <Blocks className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Widgets</p>
              <p className="text-2xl font-bold">{widgets.filter(w => w.is_active).length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="rounded-lg bg-blue-500/10 p-2.5">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Created</p>
              <p className="text-sm font-medium">
                {widgets.length > 0 ? moment(widgets[widgets.length - 1].created_at).fromNow() : "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Widget Cards Grid */}
      {widgets.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <LayoutGrid className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No widgets yet</h3>
            <p className="text-muted-foreground mb-4 max-w-sm">
              Create your first widget to start displaying notifications on your website.
            </p>
            <div className="flex gap-2">
              <Link href="widgets/prebuilt">
                <Button variant="outline">
                  <Blocks className="mr-2 h-4 w-4" />
                  Browse Prebuilt
                </Button>
              </Link>
              <Link href="widgets/create">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Widget
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {widgets.map((widget) => (
            <Card key={widget.id} className="group relative hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 min-w-0 flex-1">
                    <CardTitle className="text-base truncate">
                      {widget.data?.text || "Untitled Widget"}
                    </CardTitle>
                    <CardDescription className="text-xs font-mono truncate">
                      {widget.widget_id}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <Badge variant={widget.is_active ? "default" : "secondary"} className="text-xs shrink-0">
                      {widget.is_active ? "Active" : "Inactive"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleCopyScript(widget.widget_id)}>
                          <CopyCheck className="mr-2 h-4 w-4" />
                          Copy Script URL
                        </DropdownMenuItem>
                        <Link href={`/u/widgets/${widget.widget_id}`}>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={() => setDeleteWidgeteId(widget.id as number)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {widget.data?.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {widget.data.description}
                  </p>
                )}
                {widget.data?.imageUrl && (
                  <div className="rounded-md overflow-hidden border mb-3">
                    <img
                      src={widget.data.imageUrl}
                      alt=""
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
                {/* Config badges */}
                {widget.config && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {widget.config.position}
                    </Badge>
                    {widget.config.autoDismiss && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        dismiss: {widget.config.autoDismissSeconds}s
                      </Badge>
                    )}
                    {widget.config.autoShow && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {widget.config.autoShowDelaySeconds > 0
                          ? `show: ${widget.config.autoShowDelaySeconds}s delay`
                          : "auto show"}
                      </Badge>
                    )}
                    {widget.config.animation !== 'none' && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {widget.config.animation}
                      </Badge>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                  <span>Created {moment(widget.created_at).fromNow()}</span>
                  <span>Updated {moment(widget.updated_at).fromNow()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteWidgetId !== null}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Widget</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the widget and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteWidgeteId(null)
              signal("/api/v1/widget", "DELETE")
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteWidgetId && handleDelete(deleteWidgetId)}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
              autoFocus
              disabled={deleteWidgetId === null || isLoading}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
