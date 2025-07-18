"use client"


import { useTemplateStore } from "@/store/template.store"
import { TemplateCard } from "./templateCard"
import { CustomCodeRenderer } from "./customCodeRenderer"
import { TemplateCategoryResponse } from "@/lib/interfaces/template-category.interface"
import { useLayoutEffect, useState } from 'react';
import { db } from "@/lib/db"
import { TemplateResponse } from "@/lib/interfaces/templates.interface"


interface TemplateTabsProps {
  templateGroups: TemplateCategoryResponse[]
}

export function TemplateTabs({ templateGroups }: TemplateTabsProps) {
  const { selectedCategorySlug, activeTab, selectedTemplateId } = useTemplateStore()
  if (!selectedCategorySlug) {
    return null
  }
  const [templates, setTemplates] = useState<Record<string, TemplateResponse[]>>({})
  const selectedCategory = templateGroups.find((group) => group.slug === selectedCategorySlug)

  const selectedTemplate = templates[selectedCategorySlug].find((template) => template.id === Number(selectedTemplateId))
  const fetchTemplates = async () => {
    const templates = db.getItemsByIndex("templates", "slug", selectedCategorySlug)
    setTemplates((prev) => {
      return {
        ...prev,
        [selectedCategorySlug]: templates as any
      }
    })
  }
  if (!selectedCategory) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📁</span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Category</h3>
          <p className="text-gray-500">Choose a template category from the sidebar to get started.</p>
        </div>
      </div>
    )
  }
  useLayoutEffect(() => {
    fetchTemplates()
  }, [selectedCategorySlug])
  const renderTabContent = () => {
    switch (activeTab) {
      case "default":
        return (
          <div className="space-y-6">
            {/* Category Header */}
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
                {selectedCategory.icon}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedCategory.name}</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">{selectedCategory.description}</p>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCategory.templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )

      case "variants":
        if (!selectedTemplate) {
          return (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Template</h3>
                <p className="text-gray-500">Choose a template to view its variants.</p>
              </div>
            </div>
          )
        }

        return (
          <div className="space-y-6">
            <div className="text-center py-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedTemplate.name} Variants</h2>
              <p className="text-gray-600">Explore different variations of this template</p>
            </div>

            {selectedTemplate.variants && selectedTemplate.variants.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedTemplate.variants.map((variant) => (
                  <div key={variant.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">{variant.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{variant.description}</p>
                    {variant.preview && (
                      <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={variant.preview || "/placeholder.svg"}
                          alt={variant.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Variants Available</h3>
                <p className="text-gray-500">This template doesn't have any variants yet.</p>
              </div>
            )}
          </div>
        )

      case "custom":
        if (!selectedTemplate) {
          return (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl">💻</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Template</h3>
                <p className="text-gray-500">Choose a template to view its custom code.</p>
              </div>
            </div>
          )
        }

        return <CustomCodeRenderer template={selectedTemplate} />

      default:
        return null
    }
  }

  return <div className="flex-1 p-6 overflow-y-auto">{renderTabContent()}</div>
}
