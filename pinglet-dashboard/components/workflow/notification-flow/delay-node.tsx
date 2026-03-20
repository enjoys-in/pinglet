"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Clock } from "lucide-react"
import type { DelayData } from "./types"

export const DelayNode = memo(({ data, selected }: NodeProps<DelayData>) => (
  <div className={`min-w-[160px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? "border-violet-500 shadow-violet-500/20" : "border-violet-500/30"}`}>
    <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-violet-500 !border-2 !border-background" />
    <div className="flex items-center gap-2 rounded-t-[10px] bg-violet-500/10 px-3 py-2">
      <div className="flex size-6 items-center justify-center rounded-md bg-violet-500 text-white">
        <Clock className="size-3.5" />
      </div>
      <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">Delay</span>
    </div>
    <div className="px-3 py-2.5">
      <p className="text-sm font-medium truncate">{data.label || "Wait"}</p>
      {data.duration > 0 && (
        <p className="mt-0.5 text-xs text-muted-foreground">
          Wait {data.duration} {data.unit}
        </p>
      )}
    </div>
    <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-violet-500 !border-2 !border-background" />
  </div>
))
DelayNode.displayName = "DelayNode"
