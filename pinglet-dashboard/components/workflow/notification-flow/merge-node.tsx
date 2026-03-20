"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Merge } from "lucide-react"
import type { MergeData } from "./types"

export const MergeNode = memo(({ data, selected }: NodeProps<MergeData>) => (
  <div className={`min-w-[180px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? "border-lime-500 shadow-lime-500/20" : "border-lime-500/30"}`}>
    <Handle type="target" id="in-1" position={Position.Top} style={{ left: "30%" }} className="!w-3 !h-3 !bg-lime-500 !border-2 !border-background" />
    <Handle type="target" id="in-2" position={Position.Top} style={{ left: "70%" }} className="!w-3 !h-3 !bg-lime-500 !border-2 !border-background" />
    <div className="flex items-center gap-2 rounded-t-[10px] bg-lime-500/10 px-3 py-2">
      <div className="flex size-6 items-center justify-center rounded-md bg-lime-500 text-white">
        <Merge className="size-3.5" />
      </div>
      <span className="text-xs font-semibold text-lime-700 dark:text-lime-300">Merge</span>
    </div>
    <div className="px-3 py-2.5">
      <p className="text-sm font-medium truncate">{data.label || "Merge"}</p>
      <span className="mt-1 block text-[11px] text-muted-foreground capitalize">
        Wait for {data.mergeMode || "all"} inputs
      </span>
    </div>
    <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-lime-500 !border-2 !border-background" />
  </div>
))
MergeNode.displayName = "MergeNode"
