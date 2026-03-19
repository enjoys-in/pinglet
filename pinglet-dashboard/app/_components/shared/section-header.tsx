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
    <div className={cn("mb-16 flex max-w-2xl flex-col gap-4", isCenter ? "mx-auto items-center text-center" : "items-start text-left")}>
      <span className="inline-flex w-fit rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-medium text-primary">
        {badge}
      </span>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
        {title}
      </h2>
      <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
        {description}
      </p>
    </div>
  )
}
