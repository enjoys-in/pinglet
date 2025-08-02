"use client"

import { useLayoutEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Edit, Trash2, MoreHorizontal, RefreshCcw, CopyCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
import { AllWebsitesResponse } from "@/lib/interfaces/website.interface"
import moment from 'moment';
import { useLoadingStore } from "@/store/loading.store"
import { signal } from "@/lib/requestController"
import { isCancel } from "axios"
import { db } from "@/lib/db"
import Link from "next/link"
import { __config } from "@/constants/config"

const websiteSchema = z.object({
  name: z.string().min(1, "Website name is required"),
  domain: z
    .string()
    .min(1, "Domain is required")
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/, "Please enter a valid domain format"),
  tags: z.string().optional(),
})

type WebsiteForm = z.infer<typeof websiteSchema>


export default function WidgetsPage() {
  const [websites, setWebsites] = useState<AllWebsitesResponse[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingWebsite, setEditingWebsite] = useState<AllWebsitesResponse | null>(null)
  const [deleteWebsiteId, setDeleteWebsiteId] = useState<number | null>(null)
  const { startLoading, stopLoading, isLoading } = useLoadingStore()
  const { toast } = useToast()

  const form = useForm<WebsiteForm>({
    resolver: zodResolver(websiteSchema),
    defaultValues: {
      name: "",
      domain: "",
      tags: "",
    },
  })

  const onSubmit = async (data: WebsiteForm) => {
    try {
      if (isLoading) {
        return
      }
      startLoading()
      if (editingWebsite) {

        const { data: response } = await API.updateWebsite(editingWebsite.id.toString(), editingWebsite)
        if (!response.success) {
          throw new Error(response.message)
        }
        setWebsites((prev) =>
          prev.map((w) =>
            w.id === editingWebsite.id
              ? { ...w, name: data.name, domain: data.domain, tags: data.tags?.split(",").map((t) => t.trim()) || [] }
              : w,
          ),
        )
        toast({
          title: "Website updated",
          description: "Website has been updated successfully.",
        })
        setEditingWebsite(null)
      } else {

        const newWebsite = {
          name: data.name,
          domain: data.domain,
          tags: data.tags?.split(",").map((t) => t.trim()) || [],
        }
        const { data: response } = await API.addNewWebsite(newWebsite)
        setWebsites((prev) => [...prev, response])

        toast({
          title: "Website added",
          description: "Website has been added successfully.",
        })
        refreshWebsites()
        // window.location.href = "/websites/" + response.result
      }


      form.reset()
      setIsAddDialogOpen(false)
    } catch (error) {
      if (isCancel(error)) {
        return toast({
          title: "User cancelled request",
          description: "Request cancelled. Please try again.",
          variant: "destructive",
        })
      }
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      stopLoading()
    }
  }

  const handleEdit = (website: AllWebsitesResponse) => {
    setEditingWebsite(website)
    form.setValue("name", website.name)
    form.setValue("domain", website.domain)
    form.setValue("tags", website.tags.join(", "))
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    try {
      startLoading()
      const { data } = await API.deleteWebsite(id.toString())
      if (!data.success) {
        throw new Error(data.message)
      }
      setWebsites((prev) => prev.filter((w) => w.id !== id))
      setDeleteWebsiteId(null)
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

  const resetForm = () => {
    form.reset()
    setEditingWebsite(null)
  }
  const refreshWebsites = () => {
    API.getWebsites().then((response) => {
      if (response.data.success) {
        setWebsites(response.data.result)
        db.bulkPutItems("websites", response.data.result as any)
      }
    })
  }
  const fetchWebsites = async () => {
    // fecth from IDB
    const items = await db.getAllItems("websites")
    if (items.length > 0) {
      setWebsites(items as AllWebsitesResponse[])
      return
    }
    refreshWebsites()
  }

  const handleCopyScript = (id: string) => {
    navigator.clipboard.writeText(`${__config.APP.API_URL}/load-widget/${id}`)
    toast({
      title: "Script copied",
      description: "Script has been copied to clipboard.",
    })
  }
  useLayoutEffect(() => {
    fetchWebsites()
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
            <Link href="/widgets/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Widget
              </Button>
            </Link>

            <Button variant="outline" className="cursor-pointer" onClick={refreshWebsites}>
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
                <TableHead>Domain</TableHead>
                {/* <TableHead>Total Sent</TableHead>
                <TableHead>Subscribers</TableHead> */}
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {websites.map((website) => (
                <TableRow key={website.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium"><Badge variant="secondary" className="text-xs">
                        {website.id}
                      </Badge></div>

                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{website.domain}</TableCell>
                  {/* <TableCell>{website.totalSent.toLocaleString()}</TableCell>
                  <TableCell>{website.subscribersCount.toLocaleString()}</TableCell> */}
                  <TableCell>{moment(website.created_at).fromNow()}</TableCell>
                  <TableCell>{moment(website.updated_at).fromNow()}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem

                          onClick={() => handleCopyScript(website.id.toString())}
                        >
                          <CopyCheck className="mr-2 h-4 w-4" />
                          Copy Script
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(website)}>
                          <Link href={`/websites/${website.id}`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>

                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteWebsiteId(website.id)} className="text-red-600">
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

      <AlertDialog open={deleteWebsiteId !== null}  >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the website and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setDeleteWebsiteId(null)
              signal("/api/v1/websites", "DELETE")
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteWebsiteId && handleDelete(deleteWebsiteId)}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
              autoFocus
              disabled={deleteWebsiteId === null || isLoading}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
