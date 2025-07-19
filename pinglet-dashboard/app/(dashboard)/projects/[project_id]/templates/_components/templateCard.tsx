"use client"

import { useTemplateStore } from "@/store/template.store"
import { cn } from "@/lib/utils"
import { TemplateResponse } from "@/lib/interfaces/templates.interface"

interface TemplateCardProps {
  template: TemplateResponse
  variant?: "default" | "compact"
}

export function TemplateCard({ template, variant = "default" }: TemplateCardProps) {
  const { selectedTemplateId, setSelectedTemplate } = useTemplateStore()
  const isSelected = selectedTemplateId === String(template.id)

  return (
    <div
      className={cn(
        "border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
        isSelected ? "border-blue-300 bg-blue-50 shadow-sm" : "border-gray-200 hover:border-gray-300",
        variant === "compact" && "p-3",
      )}
      onClick={() => setSelectedTemplate(isSelected ? null : String(template.id))}
    >
      <div className="space-y-3">
        <div>
          <h3 className={cn("font-semibold text-gray-900", variant === "compact" ? "text-sm" : "text-base")}>
            {template.name}
          </h3>
          <p className={cn("text-gray-600 mt-1", variant === "compact" ? "text-xs" : "text-sm")}>
            {template.description}
          </p>
        </div>

        {template?.config?.media && variant === "default" && (
          <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
            {template?.config?.media?.image ? (
              <img
                src={template?.config?.media?.image.src || "/placeholder.svg"}
                alt={template?.config?.media?.image.alt || template.name}
                className="w-full h-full object-cover"
              />
            ) : template?.config?.media?.icon ? (
              <div className="w-full h-full flex items-center justify-center text-4xl">{template?.config?.media?.icon.src || "/placeholder.svg"}</div>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span className="text-sm">Video Preview</span>
              </div>
            )}
          </div>
        )}


        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex space-x-4">
            {template.variants && <span>{template.variants.length} variants</span>}
          </div>
          <span>ID: {template.id}</span>
        </div>
      </div>
    </div>
  )
}
