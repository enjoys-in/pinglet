"use client"

import { useState, useMemo } from "react"
import { Search, X, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { useDebounce } from "@/hooks/useDebounce"
import { useTemplateStore } from "@/store/template.store"
import { TemplateCategoryResponse } from "@/lib/interfaces/template-category.interface"

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
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Templates</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredGroups.map((group) => (
          <button
            key={group.slug}
            onClick={() => {
              setCategory(group.id)
              setSidebarOpen(false) // Mobile: close sidebar on select
            }}
            className={cn(
              "w-full text-left p-3 rounded-lg transition-all duration-200 group hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-200",
              selectedCategoryId === group.id
                ? "bg-blue-50 border-2 border-blue-200"
                : "border-2 border-transparent",
            )}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3
                    className={cn(
                      "font-medium truncate transition-colors",
                      selectedCategoryId === group.id ? "text-blue-900" : "text-gray-900",
                    )}
                  >
                    {group.name}
                  </h3>
                  <span
                    className={cn(
                      "ml-2 px-2 py-1 text-xs rounded-full transition-colors",
                      selectedCategoryId === group.id
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600",
                    )}
                  >
                    {group.template_count}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 h-full">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
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
    <button
      onClick={() => setSidebarOpen(true)}
      className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Open sidebar"
    >
      <Menu className="w-5 h-5" />
    </button>
  )
}
