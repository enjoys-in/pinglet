import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  badge: string
  title: string
  description: string
  align?: "center" | "left"
}

export function SectionHeader({ badge, title, description, align = "center" }: SectionHeaderProps) {
  const isCenter = align === "center"
  return (
    <div className={cn("mb-16 flex max-w-2xl flex-col", isCenter ? "mx-auto items-center text-center" : "items-start text-left")}>
      <Badge className="mb-4 rounded-full border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary hover:bg-primary/10">
        {badge}
      </Badge>
      <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.2]">
        {title}
      </h2>
      <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  )
}
