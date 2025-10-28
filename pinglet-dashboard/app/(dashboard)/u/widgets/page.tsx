"use client"
import { useLayoutEffect, useState } from "react"

import { Plus, Edit, Trash2, MoreHorizontal, RefreshCcw, CopyCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
import { AllWidgetResponse } from "@/lib/interfaces/widget.interface"



export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<any[]>([])

  const [deleteWidgetId, setDeleteWidgeteId] = useState<number | null>(null)
  const { startLoading, stopLoading, isLoading } = useLoadingStore()
  const { toast } = useToast()



  const handleDelete = async (id: number) => {
    try {
      startLoading()
      const { data } = await API.deleteWebsite(id.toString())
      if (!data.success) {
        throw new Error(data.message)
      }
      setWidgets((prev) => prev.filter((w) => w.id !== id))
      setDeleteWidgeteId(null)
      db.deleteItem("websites", id)
      toast({
        title: "Website deleted",
        description: "Website has been deleted successfully.",
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
    // fecth from IDB
    const items = await db.getAllItems("widgets")
    if (items.length > 0) {
      setWidgets(items as AllWidgetResponse)
      return
    }
    refreshWidgets()
  }

  const handleCopyScript = (id: string) => {
    navigator.clipboard.writeText(`${__config.APP.API_URL}/load-widget/${id}`)
    toast({
      title: "Script copied",
      description: "Script has been copied to clipboard.",
    })
  }
  useLayoutEffect(() => {
    fetchWidgets()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Widgets</h1>
            <p className="text-muted-foreground">Manage your widgets and their settings</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="widgets/prebuilt">
              <Button>
                Prebuilt Widgets
              </Button>
            </Link>
            <Link href="widgets/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Widget
              </Button>
            </Link>

            <Button variant="outline" className="cursor-pointer" onClick={refreshWidgets} disabled={isLoading}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
          </div>

        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Widget ID</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {widgets.length === 0 ?
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">
                    No widgets found. Click on "Add New Widget" to create one.
                  </TableCell>
                </TableRow>
                : widgets.map((widget) => (
                  <TableRow key={widget.id}>
                    <TableCell className="font-mono text-sm">{widget.widget_id}</TableCell>
                    {/* <TableCell>{website.totalSent.toLocaleString()}</TableCell>
                  <TableCell>{website.subscribersCount.toLocaleString()}</TableCell> */}
                    <TableCell>{moment(widget.created_at).fromNow()}</TableCell>
                    <TableCell>{moment(widget.updated_at).fromNow()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem

                            onClick={() => handleCopyScript(widget.id.toString())}
                          >
                            <CopyCheck className="mr-2 h-4 w-4" />
                            Copy Script
                          </DropdownMenuItem>
                          <Link href={`/u/widgets/${widget.widget_id}`} className="flex items-center">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          </Link>

                          <DropdownMenuItem onClick={() => setDeleteWidgeteId(widget.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={deleteWidgetId !== null}  >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the website and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteWidgeteId(null)
              signal("/api/v1/websites", "DELETE")
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
