"use client"

import { useLayoutEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Edit, Trash2, MoreHorizontal, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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

const websiteSchema = z.object({
  name: z.string().min(1, "Website name is required"),
  domain: z
    .string()
    .min(1, "Domain is required")
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/, "Please enter a valid domain format"),
  tags: z.string().optional(),
})

type WebsiteForm = z.infer<typeof websiteSchema>


export default function WebsitesPage() {
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
  useLayoutEffect(() => {
    fetchWebsites()
  }, [])

  return (
    <div className="space-y-6">


      <Card>
        <CardHeader className="flex  flex-row items-center justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Websites</h1>
              <p className="text-muted-foreground">Manage your websites and their notification settings</p>
            </div>

            <Dialog
              open={isAddDialogOpen}
              onOpenChange={(open) => {
                setIsAddDialogOpen(open)
                if (!open) resetForm()
              }}
            >

              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{editingWebsite ? "Edit Website" : "Add New Website"}</DialogTitle>
                  <DialogDescription>
                    {editingWebsite
                      ? "Update your website information below."
                      : "Add a new website to start sending notifications."}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Website Name</FormLabel>
                          <FormControl>
                            <Input placeholder="My Awesome Website" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="domain"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Domain</FormLabel>
                          <FormControl>
                            <Input placeholder="example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            You can use formats like domain.com, sub.domain.com, or domain.com/path. You can configure the
                            website further after its creation.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="blog, personal, ecommerce" {...field} />
                          </FormControl>
                          <FormDescription>Separate tags with commas to categorize your website.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => {
                          setIsAddDialogOpen(false)
                          resetForm()
                          signal("/api/v1/websites", "PUT")
                        }}
                      >
                        Cancel
                      </Button>
                      <Button disabled={isLoading} className="cursor-pointer" type="submit">{editingWebsite ? "Update Website" : "Add Website"}</Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="cursor-pointer" onClick={refreshWebsites}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button variant="default" className="cursor-pointer" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Website
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Website Name</TableHead>
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
                      <div className="font-medium">{website.name}</div>
                      <div className="flex gap-1">
                        {website.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
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
                        <DropdownMenuItem >
                          <Link href={`/u/websites/${website.id}`} className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(website)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
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
