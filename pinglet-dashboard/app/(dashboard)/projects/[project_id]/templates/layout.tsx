"use client"


import { TemplateTabs } from "./_components/templateTabs"
import { VerticalSidebar, SidebarTrigger } from "./_components/verticalSidebar"
import { db } from "@/lib/db"
import { useCallback, useLayoutEffect, useState } from "react"
import { TemplateCategoryResponse } from "@/lib/interfaces/template-category.interface"
import { API } from "@/lib/api/handler"
import { TabHeader } from "./_components/tabHeader"




export default function TemplateManagementSystem() {
    const [templateGroup, setTemplateGroup] = useState<TemplateCategoryResponse[]>([])
    const loadTemplateGroups = useCallback(() => {
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
    }, [])
    useLayoutEffect(() => {
        loadTemplateGroups()
    }, [])
    return (
        <div className="h-screen flex bg-gray-50">
            <VerticalSidebar templateGroups={templateGroup} />
            <div className="flex-1 flex flex-col min-w-0">

                <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
                    <SidebarTrigger />
                    <h1 className="text-lg font-semibold text-gray-900">Templates</h1>
                    <div className="w-8" />
                </div>


                <TabHeader />

                {/* Template Content */}
                <TemplateTabs templateGroups={templateGroup} />
            </div>
        </div>
    )
}
