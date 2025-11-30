"use client"

import { useTemplateStore } from "@/store/template.store"
import { cn } from "@/lib/utils"
import { TemplateResponse } from "@/lib/interfaces/templates.interface"
import { Check, Image as ImageIcon, Sparkles, Layers } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TemplateCardProps {
  template: TemplateResponse
  variant?: "default" | "compact"
}

export function TemplateCard({ template, variant = "default" }: TemplateCardProps) {
  const { selectedTemplateId, setSelectedTemplate } = useTemplateStore()
  const isSelected = selectedTemplateId === String(template.id)

  const handleClick = () => {
    setSelectedTemplate(isSelected ? null : String(template.id))
  }

  const media = template?.config?.media
  const hasImage = !!media?.image?.src
  const hasIcon = !!media?.icon?.src

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer",
        "border-2 bg-card hover:shadow-xl hover:shadow-primary/5",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background",
        isSelected
          ? "border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-lg shadow-primary/20 scale-[1.02]"
          : "border-border/50 hover:border-primary/30 hover:scale-[1.01]",
        variant === "compact" && "p-4"
      )}
      onClick={handleClick}
    >
      {/* Animated gradient border for selected */}
      {isSelected && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/40 via-primary/30 to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-md -z-10" />
      )}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30">
            <Check className="w-4 h-4" />
          </div>
        </div>
      )}

      <div className={cn("space-y-4", variant === "default" ? "p-5" : "p-0")}>
        {/* Preview Image/Icon */}
        {variant === "default" && (
          <div className="relative w-full h-48 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl overflow-hidden group-hover:shadow-md transition-shadow duration-300">
            {hasImage ? (
              <>
                <img
                  src={media.image.src || "/placeholder.png"}
                  alt={media.image.alt || template.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : hasIcon ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-6xl opacity-80 group-hover:scale-110 transition-transform duration-300">
                  {media.icon.src}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                <span className="text-sm font-medium">Preview</span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3
              className={cn(
                "font-bold transition-colors duration-200 line-clamp-1",
                variant === "compact" ? "text-sm" : "text-lg",
                isSelected ? "text-primary" : "text-foreground group-hover:text-primary"
              )}
            >
              {template.name}
            </h3>
            <p
              className={cn(
                "text-muted-foreground mt-1.5 line-clamp-2 transition-colors duration-200",
                variant === "compact" ? "text-xs" : "text-sm",
                "group-hover:text-muted-foreground/80"
              )}
            >
              {template.description}
            </p>
          </div>

          {/* Footer with metadata */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-2">
              {template.variants?.length > 0 && (
                <Badge
                  variant={isSelected ? "default" : "secondary"}
                  className={cn(
                    "text-xs font-medium transition-all duration-200",
                    isSelected
                      ? "bg-primary/20 text-primary hover:bg-primary/30"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}
                >
                  <Layers className="w-3 h-3 mr-1" />
                  {template.variants.length} variant{template.variants.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            <span className="text-xs text-muted-foreground font-mono">
              #{template.id}
            </span>
          </div>
        </div>
      </div>

      {/* Hover effect line */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 transition-all duration-300",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-50"
        )}
      />
    </div>
  )
}
