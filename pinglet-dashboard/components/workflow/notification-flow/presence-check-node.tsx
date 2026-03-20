"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Eye } from "lucide-react"
import type { PresenceCheckData } from "./types"

export const PresenceCheckNode = memo(({ data, selected }: NodeProps<PresenceCheckData>) => (
  <div className={`min-w-[180px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? "border-teal-500 shadow-teal-500/20" : "border-teal-500/30"}`}>
    <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-teal-500 !border-2 !border-background" />
    <div className="flex items-center gap-2 rounded-t-[10px] bg-teal-500/10 px-3 py-2">
      <div className="flex size-6 items-center justify-center rounded-md bg-teal-500 text-white">
        <Eye className="size-3.5" />
      </div>
      <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">Presence Check</span>
    </div>
    <div className="px-3 py-2.5">
      <p className="text-sm font-medium truncate">{data.label || "Presence Check"}</p>
      <div className="mt-1 flex items-center gap-1.5">
        <span className={`inline-block size-2 rounded-full ${data.checkType === "online" ? "bg-emerald-500" : "bg-gray-400"}`} />
        <span className="text-[11px] text-muted-foreground capitalize">{data.checkType || "online"}</span>
        {data.fallbackAction && (
          <span className="text-[11px] text-muted-foreground">→ {data.fallbackAction}</span>
        )}
      </div>
    </div>
    <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-teal-500 !border-2 !border-background" />
  </div>
))
PresenceCheckNode.displayName = "PresenceCheckNode"
