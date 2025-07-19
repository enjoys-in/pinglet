"use client"

import { useTemplateStore } from "@/store/template.store"
import { TemplateCard } from "./templateCard"
import { CustomCodeRenderer } from "./customCodeRenderer"
import { TemplateCategoryResponse } from "@/lib/interfaces/template-category.interface"
import { useEffect, useState } from 'react';
import { db } from "@/lib/db"
import { TemplateResponse } from "@/lib/interfaces/templates.interface"
import { API } from "@/lib/api/handler"
import { toast } from "@/hooks/use-toast"

interface TemplateTabsProps {
  templateGroups: TemplateCategoryResponse[]
}

export function TemplateTabs({ templateGroups }: TemplateTabsProps) {
  const { selectedCategoryId, activeTab, selectedTemplateId } = useTemplateStore()
  const [templates, setTemplates] = useState<Record<string, TemplateResponse[]>>({})
  const refreshTemplates = () => API.getTemplatesByCategory(String(selectedCategoryId))

  useEffect(() => {
    if (!selectedCategoryId) return

    const fetchTemplates = async () => {
      try {
        const selectedId = String(selectedCategoryId);

        const stored = await db.getRawDb().templates
          .where("catgory_id")
          .equals(selectedId)
          .first() as unknown as {
            templates: TemplateResponse[];
            catgory_id: string;
          };

        const fromDb = stored?.templates || [];

        // Show from DB if available
        if (fromDb.length > 0) {
          setTemplates(prev => ({
            ...prev,
            [selectedId]: fromDb,
          }));
        }

        // Always fetch fresh templates from server
        const res = await refreshTemplates();

        if (!res.data.success) {
          toast({
            title: "Error",
            description: "Something went wrong",
            variant: "destructive",
          });
          return;
        }

        const fetchedTemplates = res.data.result.templates;

        const isFirstTime = fromDb.length === 0;

        // Compare templates only if it's not the first time
        const isChanged = !isFirstTime && (
          fromDb.length !== fetchedTemplates.length ||
          !fromDb.every((dbTpl, i) => {
            const apiTpl = fetchedTemplates[i];
            return dbTpl?.id === apiTpl?.id
          })
        );

        if (isFirstTime || isChanged) {
          await db.putItem("templates", {
            catgory_id: selectedId,
            templates: fetchedTemplates,
          } as any);

          setTemplates(prev => ({
            ...prev,
            [selectedId]: fetchedTemplates,
          }));
        }

      } catch (error) {
        console.error("Template fetch error:", error);
      }
    };


    fetchTemplates()
  }, [selectedCategoryId])

  if (!selectedCategoryId) {
    return null
  }

  const selectedCategory = templateGroups.find(group => group.id === selectedCategoryId)
  const selectedTemplate = templates[selectedCategoryId]?.find(t => t.id === Number(selectedTemplateId))

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "default":
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedCategory.name}</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">{selectedCategory.description}</p>
            </div>

            {templates[selectedCategoryId]?.length > 0 ? templates[selectedCategoryId]?.map(template => (
              <div key={template.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TemplateCard key={template.id} template={template} />
              </div>))
              :
              <div className="flex-1 flex items-center justify-center">
                <EmptyState icon="🥲" title={`${selectedCategory.name} has no templates`} />
              </div>
            }
          </div>
        )

      case "variants":
        return selectedTemplate ? (
          <div className="space-y-6">
            <div className="text-center py-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedTemplate.name} Variants</h2>
              <p className="text-gray-600">Explore different variations of this template</p>
            </div>
            {selectedTemplate.variants.length > 0 ? selectedTemplate.variants.map(variant => (
              <div key={variant.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <TemplateCard template={variant} variant="compact" />
              </div>
            )) :
              <div className="flex-1 flex items-center justify-center">
                <EmptyState icon="🥲" title={`${selectedTemplate.name} has no variants`} />
              </div>
            }
          </div>
        ) : (
          <EmptyState icon="🎨" title="Select a Template" message="Choose a template to view its variants." />
        )

      case "custom":
        return selectedTemplate ? (
          <CustomCodeRenderer template={selectedTemplate} />
        ) : (
          <EmptyState icon="💻" title="Select a Template" message="Choose a template to view its custom code." />
        )

      default:
        return <div>Invalid tab</div>
    }
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {renderTabContent()}
    </div>
  )
}

function EmptyState({ icon, title, message }: { icon: string; title: string; message?: string }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl">{icon}</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        {message && <p className="text-gray-500">{message}</p>}

      </div>
    </div>
  )
}
