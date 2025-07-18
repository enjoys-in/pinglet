"use client"


import { TabType } from "@/lib/interfaces/templates.interface";
import { cn } from "@/lib/utils"
import { useTemplateStore } from "@/store/template.store";

const tabs: { id: TabType; label: string; description: string }[] = [
    { id: "default", label: "Default", description: "View template details" },
    { id: "variants", label: "Variants ++", description: "Explore variations" },
    { id: "custom", label: "Custom Code", description: "View source code" },
]

export function TabHeader() {
    const { activeTab, setTab, selectedCategorySlug } = useTemplateStore()

    if (!selectedCategorySlug) {
        return null
    }

    return (
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex overflow-x-auto scrollbar-hide">
                <div className="flex space-x-1 p-1 min-w-max">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setTab(tab.id)}
                            className={cn(
                                "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                                "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                                activeTab === tab.id ? "bg-blue-100 text-blue-700 shadow-sm" : "text-gray-600 hover:text-gray-900",
                            )}
                            title={tab.description}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
