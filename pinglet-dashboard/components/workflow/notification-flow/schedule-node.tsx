"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { CalendarClock } from "lucide-react"
import type { ScheduleData } from "./types"

export const ScheduleNode = memo(({ data, selected }: NodeProps<ScheduleData>) => (
  <div className={`min-w-[180px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? "border-indigo-500 shadow-indigo-500/20" : "border-indigo-500/30"}`}>
    <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-background" />
    <div className="flex items-center gap-2 rounded-t-[10px] bg-indigo-500/10 px-3 py-2">
      <div className="flex size-6 items-center justify-center rounded-md bg-indigo-500 text-white">
        <CalendarClock className="size-3.5" />
      </div>
      <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">Schedule</span>
    </div>
    <div className="px-3 py-2.5">
      <p className="text-sm font-medium truncate">{data.label || "Schedule"}</p>
      {data.days && data.days.length > 0 && (
        <code className="mt-1 block rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-mono truncate">
          {data.days.join(", ")} · {data.startHour}:00–{data.endHour}:00
        </code>
      )}
    </div>
    <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-indigo-500 !border-2 !border-background" />
  </div>
))
ScheduleNode.displayName = "ScheduleNode"
