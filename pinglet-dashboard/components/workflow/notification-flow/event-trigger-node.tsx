"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Zap } from "lucide-react"
import type { EventTriggerData } from "./types"

export const EventTriggerNode = memo(({ data, selected }: NodeProps<EventTriggerData>) => (
  <div className={`min-w-[180px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? "border-blue-500 shadow-blue-500/20" : "border-blue-500/30"}`}>
    <div className="flex items-center gap-2 rounded-t-[10px] bg-blue-500/10 px-3 py-2">
      <div className="flex size-6 items-center justify-center rounded-md bg-blue-500 text-white">
        <Zap className="size-3.5" />
      </div>
      <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">Event Trigger</span>
    </div>
    <div className="px-3 py-2.5">
      <p className="text-sm font-medium truncate">{data.label || "Untitled Event"}</p>
      {data.eventName && (
        <code className="mt-1 block rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-mono truncate">
          {data.eventName}
        </code>
      )}
    </div>
    <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-blue-500 !border-2 !border-background" />
  </div>
))
EventTriggerNode.displayName = "EventTriggerNode"
