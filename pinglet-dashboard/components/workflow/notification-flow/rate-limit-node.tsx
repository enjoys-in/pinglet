"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Gauge } from "lucide-react"
import type { RateLimitData } from "./types"

export const RateLimitNode = memo(({ data, selected }: NodeProps<RateLimitData>) => (
  <div className={`min-w-[180px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? "border-orange-500 shadow-orange-500/20" : "border-orange-500/30"}`}>
    <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-orange-500 !border-2 !border-background" />
    <div className="flex items-center gap-2 rounded-t-[10px] bg-orange-500/10 px-3 py-2">
      <div className="flex size-6 items-center justify-center rounded-md bg-orange-500 text-white">
        <Gauge className="size-3.5" />
      </div>
      <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">Rate Limit</span>
    </div>
    <div className="px-3 py-2.5">
      <p className="text-sm font-medium truncate">{data.label || "Rate Limit"}</p>
      {data.maxCount > 0 && (
        <code className="mt-1 block rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-mono truncate">
          Max {data.maxCount} / {data.window} {data.windowUnit}
        </code>
      )}
    </div>
    <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-orange-500 !border-2 !border-background" />
  </div>
))
RateLimitNode.displayName = "RateLimitNode"
