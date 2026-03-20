"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Filter } from "lucide-react"
import type { FilterData } from "./types"

export const FilterNode = memo(({ data, selected }: NodeProps<FilterData>) => (
  <div className={`min-w-[180px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? "border-cyan-500 shadow-cyan-500/20" : "border-cyan-500/30"}`}>
    <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-background" />
    <div className="flex items-center gap-2 rounded-t-[10px] bg-cyan-500/10 px-3 py-2">
      <div className="flex size-6 items-center justify-center rounded-md bg-cyan-500 text-white">
        <Filter className="size-3.5" />
      </div>
      <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">Filter</span>
    </div>
    <div className="px-3 py-2.5">
      <p className="text-sm font-medium truncate">{data.label || "Filter / Segment"}</p>
      {data.field && (
        <code className="mt-1 block rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-mono truncate">
          {data.field} {data.operator} {data.value}
        </code>
      )}
    </div>
    <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-background" />
  </div>
))
FilterNode.displayName = "FilterNode"
