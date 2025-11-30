"use client"

import { useState, useMemo } from "react"
import { Search, X, Menu, Sparkles, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/useDebounce"
import { useTemplateStore } from "@/store/template.store"
import { TemplateCategoryResponse } from "@/lib/interfaces/template-category.interface"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

interface SidebarProps {
  templateGroups: TemplateCategoryResponse[]
}

export function VerticalSidebar({ templateGroups }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedQuery = useDebounce(searchQuery, 200)

  const { selectedCategoryId, setCategory, sidebarOpen, setSidebarOpen } = useTemplateStore()

  const filteredGroups = useMemo(() => {
    const q = debouncedQuery.toLowerCase()
    return templateGroups.filter(
      (group) =>
        group.name.toLowerCase().includes(q) || group.description.toLowerCase().includes(q),
    )
  }, [debouncedQuery, templateGroups])

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-muted/20 border-r border-border/50 backdrop-blur-xl">
      {/* Header with gradient accent */}
      <div className="relative p-6 border-b border-border/50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-transparent pointer-events-none" />

        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Templates
            </h2>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden h-8 w-8 rounded-full hover:bg-primary/10 transition-all duration-200"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Modern Search with glass effect */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary pointer-events-none" />
          <Input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 h-11 bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 placeholder:text-muted-foreground/60"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full hover:bg-muted transition-all duration-200"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Categories with modern cards */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-2">
          {filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <Search className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">No categories found</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Try adjusting your search</p>
            </div>
          ) : (
            filteredGroups.map((group) => {
              const isSelected = selectedCategoryId === group.id

              return (
                <button
                  key={group.slug}
                  onClick={() => {
                    setCategory(group.id)
                    setSidebarOpen(false)
                  }}
                  className={cn(
                    "w-full group relative overflow-hidden rounded-xl transition-all duration-300",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
                    isSelected
                      ? "bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 shadow-lg shadow-primary/10 scale-[1.02]"
                      : "bg-card/50 hover:bg-card hover:shadow-md hover:scale-[1.01] border border-border/50"
                  )}
                >
                  {/* Animated gradient border for selected */}
                  {isSelected && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/30 via-primary/20 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm -z-10" />
                  )}

                  <div className="relative p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3
                            className={cn(
                              "font-semibold text-sm truncate transition-colors duration-200",
                              isSelected
                                ? "text-primary"
                                : "text-foreground group-hover:text-primary"
                            )}
                          >
                            {group.name}
                          </h3>
                          <ChevronRight
                            className={cn(
                              "w-4 h-4 transition-all duration-300",
                              isSelected
                                ? "text-primary translate-x-0 opacity-100"
                                : "text-muted-foreground -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                            )}
                          />
                        </div>

                        {group.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 transition-colors duration-200 group-hover:text-muted-foreground/80">
                            {group.description}
                          </p>
                        )}
                      </div>

                      <Badge
                        variant={isSelected ? "default" : "secondary"}
                        className={cn(
                          "shrink-0 font-semibold transition-all duration-200 min-w-[2rem] justify-center",
                          isSelected
                            ? "bg-primary/20 text-primary hover:bg-primary/30 shadow-sm"
                            : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        )}
                      >
                        {group.template_count}
                      </Badge>
                    </div>
                  </div>

                  {/* Hover effect line */}
                  <div
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transition-all duration-300",
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"
                    )}
                  />
                </button>
              )
            })
          )}
        </div>
      </ScrollArea>

      {/* Footer with subtle branding */}
      <div className="p-4 border-t border-border/50 bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">
            {filteredGroups.length} {filteredGroups.length === 1 ? 'category' : 'categories'}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay with blur */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 h-full">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar with smooth slide animation */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 transform transition-all duration-300 ease-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </div>
    </>
  )
}

export function SidebarTrigger() {
  const { setSidebarOpen } = useTemplateStore()

  return (
    <Button
      onClick={() => setSidebarOpen(true)}
      variant="outline"
      size="icon"
      className="lg:hidden h-10 w-10 rounded-xl border-border/50 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md"
      aria-label="Open sidebar"
    >
      <Menu className="w-5 h-5" />
    </Button>
  )
}
