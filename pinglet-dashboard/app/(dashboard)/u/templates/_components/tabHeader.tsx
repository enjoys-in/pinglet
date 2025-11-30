"use client"

import { Button } from "@/components/ui/button";
import { TabType } from "@/lib/interfaces/templates.interface";
import { cn } from "@/lib/utils"
import { useTemplateStore } from "@/store/template.store";
import { Eye, Code2, Sparkles } from "lucide-react";

const tabs: { id: TabType; label: string; description: string; icon: any }[] = [
    { id: "default", label: "Gallery", description: "View template details", icon: Eye },
    { id: "variants", label: "Variants", description: "Explore variations", icon: Sparkles },
    { id: "custom", label: "Code", description: "View source code", icon: Code2 },
]

export function TabHeader() {
    const { activeTab, setTab, selectedCategoryId } = useTemplateStore()

    if (!selectedCategoryId) {
        return null
    }

    return (
        <div className="px-6 py-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-2 min-w-max">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id

                        return (
                            <Button
                                key={tab.id}
                                onClick={() => setTab(tab.id)}
                                variant="ghost"
                                className={cn(
                                    "relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 group",
                                    "hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
                                    isActive
                                        ? "bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 text-primary shadow-lg shadow-primary/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                                title={tab.description}
                            >
                                {/* Animated gradient border for active tab */}
                                {isActive && (
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
                                )}

                                <div className="flex items-center gap-2">
                                    <Icon className={cn(
                                        "w-4 h-4 transition-all duration-300",
                                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    )} />
                                    <span className="text-sm whitespace-nowrap">{tab.label}</span>
                                </div>

                                {/* Active indicator */}
                                {isActive && (
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
                                )}
                            </Button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
