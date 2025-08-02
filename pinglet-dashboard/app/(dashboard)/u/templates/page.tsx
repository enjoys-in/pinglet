"use client"
import { TemplateTabs } from "./_components/templateTabs"
import { VerticalSidebar, SidebarTrigger } from "./_components/verticalSidebar"
import { db } from "@/lib/db"
import { useEffect, useState } from "react"
import { TemplateCategoryResponse } from "@/lib/interfaces/template-category.interface"
import { API } from "@/lib/api/handler"
import { TabHeader } from "./_components/tabHeader"




export default function TemplateManagementSystem() {
    const [templateGroup, setTemplateGroup] = useState<TemplateCategoryResponse[]>([])
    const refreshTemplateGroups = async () => {
        const { data } = await API.getTemplateCategories()
        if (data.success) {
            setTemplateGroup(data.result)
            db.bulkPutItems("template_categories", data.result as any)
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
        <div className="h-screen flex overflow-hidden ">
            {/* Sidebar */}
            <VerticalSidebar templateGroups={templateGroup} />

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Topbar */}
                <div className="lg:hidden flex items-center justify-between p-4  ">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold text-gray-900">Templates</h1>
                    <div className="w-8" /> {/* Placeholder for spacing symmetry */}
                </div>

                {/* Tab Header (persistent on top) */}
                <div className="sticky top-0 z-10  ">
                    <TabHeader />
                </div>

                {/* Main tab content area */}
                <div className="flex-1 overflow-y-auto">
                    <TemplateTabs templateGroups={templateGroup} />
                </div>
            </div>
        </div>

    )
}
