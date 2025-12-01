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
import { Folder, Palette, Code, Sparkles, Loader2, Plus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface TemplateTabsProps {
  templateGroups: TemplateCategoryResponse[]
}

export function TemplateTabs({ templateGroups }: TemplateTabsProps) {
  const { selectedCategoryId, activeTab, selectedTemplateId } = useTemplateStore()
  const [templates, setTemplates] = useState<Record<string, TemplateResponse[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const refreshTemplates = () => API.getTemplatesByCategory(String(selectedCategoryId))

  useEffect(() => {
    if (!selectedCategoryId) return

    const fetchTemplates = async (is_refetch = false) => {
      try {
        setIsLoading(true)
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
      } finally {
        setIsLoading(false)
      }
    };

    fetchTemplates()

  }, [selectedCategoryId])

  if (!selectedCategoryId) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          icon={Folder}
          title="Select a Category"
          message="Choose a template category from the sidebar to get started."
          gradient="from-blue-500/20 to-cyan-500/20"
        />
      </div>
    )
  }

  const selectedCategory = templateGroups.find(group => group.id === selectedCategoryId)
  const selectedTemplate = templates[selectedCategoryId]?.find(t => t.id === Number(selectedTemplateId))

  if (!selectedCategory) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <EmptyState
          icon={Folder}
          title="Category Not Found"
          message="The selected category could not be loaded."
          gradient="from-red-500/20 to-orange-500/20"
        />
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "default":
        return (
          <div className="space-y-8 p-8">
            {/* Category Header */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
                {selectedCategory.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {selectedCategory.description}
              </p>
            </div>

            {/* Templates Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Loading templates...</p>
                </div>
              </div>
            ) : templates[selectedCategoryId]?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {templates[selectedCategoryId]?.map(template => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-20">
                <EmptyState
                  icon={Palette}
                  title={`No templates in ${selectedCategory.name}`}
                  message="Check back later for new templates."
                  gradient="from-purple-500/20 to-pink-500/20"
                />
              </div>
            )}
          </div>
        )

      case "variants":
        return selectedTemplate ? (
          <div className="space-y-8 p-8">
            {/* Variants Header */}
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 mb-4">
                <Palette className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-3">
                {selectedTemplate.name} Variants
              </h2>
              <p className="text-lg text-muted-foreground">
                Explore different variations of this template
              </p>
            </div>

            {/* Variants Grid */}
            {selectedTemplate.variants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {selectedTemplate.variants.map(variant => (
                  <TemplateCard key={variant.id} template={variant as any} variant="compact" />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-20">
                <EmptyState
                  icon={Palette}
                  title={`No variants for ${selectedTemplate.name}`}
                  message="This template doesn't have any variations yet."
                  gradient="from-purple-500/20 to-pink-500/20"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <EmptyState
              icon={Palette}
              title="Select a Template"
              message="Choose a template from the gallery to view its variants."
              gradient="from-purple-500/20 to-pink-500/20"
            />
          </div>
        )

      case "custom":
        return selectedTemplate ? (
          <CustomCodeRenderer template={selectedTemplate} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8">
            <EmptyState
              icon={Code}
              title="Select a Template"
              message="Choose a template from the gallery to view its custom code."
              gradient="from-green-500/20 to-emerald-500/20"
            />
          </div>
        )

      default:
        return <div>Invalid tab</div>
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {renderTabContent()}
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  message,
  gradient = "from-primary/20 to-primary/10"
}: {
  icon: any;
  title: string;
  message?: string;
  gradient?: string;
}) {
  return (
    <div className="text-center max-w-md mx-auto">
      <div className={cn(
        "inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br mb-6 shadow-lg",
        gradient
      )}>
        <Icon className="w-10 h-10 text-foreground/70" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-3">{title}</h3>
      {message && (
        <p className="text-muted-foreground text-lg leading-relaxed">{message}</p>
      )}

      <Link href="/u/templates/create">
        <Button
          variant="default"
          size="sm"

          className="gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          Create Template
        </Button>
      </Link>
    </div>
  )
}

