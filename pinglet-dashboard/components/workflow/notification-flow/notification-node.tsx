"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Bell, Monitor, Code2, Layers, Smartphone } from "lucide-react"
import type { NotificationData } from "./types"

const TYPE_META: Record<string, { label: string; icon: typeof Bell; color: string }> = {
  "0":  { label: "Toast",          icon: Monitor,    color: "purple" },
  "1":  { label: "Template",       icon: Code2,      color: "orange" },
  "2":  { label: "Glassmorphism",  icon: Layers,     color: "emerald" },
  "-1": { label: "Browser Push",   icon: Smartphone,  color: "cyan" },
}

export const NotificationNode = memo(({ data, selected }: NodeProps<NotificationData>) => {
  const meta = TYPE_META[data.notificationType] || TYPE_META["0"]
  const Icon = meta.icon
  const c = meta.color

  return (
    <div className={`min-w-[180px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? `border-${c}-500 shadow-${c}-500/20` : `border-${c}-500/30`}`}
      style={{ borderColor: selected ? undefined : undefined }}
    >
      <Handle type="target" position={Position.Top} className={`!w-3 !h-3 !bg-emerald-500 !border-2 !border-background`} />
      <div className={`flex items-center gap-2 rounded-t-[10px] px-3 py-2`} style={{ background: `hsl(var(--primary) / 0.08)` }}>
        <div className="flex size-6 items-center justify-center rounded-md bg-emerald-500 text-white">
          <Icon className="size-3.5" />
        </div>
        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">Send: {meta.label}</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-sm font-medium truncate">{data.title || data.label || "Notification"}</p>
        {data.description && (
          <p className="mt-0.5 text-xs text-muted-foreground truncate">{data.description}</p>
        )}
      </div>
    </div>
  )
})
NotificationNode.displayName = "NotificationNode"
