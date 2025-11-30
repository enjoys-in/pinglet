"use client"
import { TemplateTabs } from "./_components/templateTabs"
import { VerticalSidebar, SidebarTrigger } from "./_components/verticalSidebar"
import { db } from "@/lib/db"
import { useEffect, useState } from "react"
import { TemplateCategoryResponse } from "@/lib/interfaces/template-category.interface"
import { API } from "@/lib/api/handler"
import { TabHeader } from "./_components/tabHeader"
import { Sparkles, RefreshCw, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTemplateStore } from "@/store/template.store"
import Link from "next/link"

export default function TemplateManagementSystem() {
    const [templateGroup, setTemplateGroup] = useState<TemplateCategoryResponse[]>([])
    const [isRefreshing, setIsRefreshing] = useState(false)
    const { selectedCategoryId } = useTemplateStore()

    const refreshTemplateGroups = async () => {
        setIsRefreshing(true)
        try {
            const { data } = await API.getTemplateCategories()
            if (data.success) {
                setTemplateGroup(data.result)
                db.bulkPutItems("template_categories", data.result as any)
            }
        } finally {
            setIsRefreshing(false)
        }
    }

    const loadTemplateGroups = async () => {
        db.getAllItems("template_categories").then(async (r) => {
            if (r.length !== 0) {
                setTemplateGroup(r as TemplateCategoryResponse[])
                return
            }
            const { data } = await API.getTemplateCategories()
            if (data.success) {
                setTemplateGroup(data.result)
                db.bulkPutItems("template_categories", data.result as any)
            }
        })
    }

    useEffect(() => {
        loadTemplateGroups()
    }, [])

    return (
        <div className="h-screen flex overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
            {/* Sidebar */}
            <VerticalSidebar templateGroups={templateGroup} />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

                {/* Mobile Topbar */}
                <div className="lg:hidden relative z-20 flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                    <SidebarTrigger />
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                            <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Templates
                        </h1>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={refreshTemplateGroups}
                        disabled={isRefreshing}
                        className="h-8 w-8 rounded-full hover:bg-primary/10 transition-all duration-200"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                {/* Desktop Header - Only show when category is selected */}
                {selectedCategoryId && (
                    <div className="hidden lg:block relative z-20 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                        <div className="px-8 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 backdrop-blur-sm">
                                        <Sparkles className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                            Template Library
                                        </h1>
                                        <p className="text-sm text-muted-foreground mt-0.5">
                                            Browse and customize professional templates
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link href="/u/templates/create">
                                        <Button
                                            variant="default"
                                            size="sm"

                                            className="gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Create Template
                                        </Button></Link>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={refreshTemplateGroups}
                                        disabled={isRefreshing}
                                        className="gap-2 rounded-xl border-border/50 bg-background/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200"
                                    >
                                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Header (persistent on top) */}
                <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50">
                    <TabHeader />
                </div>

                {/* Main tab content area */}
                <div className="flex-1 overflow-y-auto relative">
                    <TemplateTabs templateGroups={templateGroup} />
                </div>
            </div>
        </div>
    )
}
