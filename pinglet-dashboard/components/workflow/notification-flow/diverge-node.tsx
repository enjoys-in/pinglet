"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { GitFork } from "lucide-react"
import type { DivergeData } from "./types"

export const DivergeNode = memo(({ data, selected }: NodeProps<DivergeData>) => {
  const count = data.outputCount || 2
  const labels = data.outputLabels || []
  const positions = count === 2
    ? [30, 70]
    : count === 3
      ? [20, 50, 80]
      : Array.from({ length: count }, (_, i) => (100 / (count + 1)) * (i + 1))

  const hasLabels = labels.some(l => l && l.trim())

  return (
    <div className={`min-w-[180px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? "border-purple-500 shadow-purple-500/20" : "border-purple-500/30"}`}>
      <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-purple-500 !border-2 !border-background" />
      <div className="flex items-center gap-2 rounded-t-[10px] bg-purple-500/10 px-3 py-2">
        <div className="flex size-6 items-center justify-center rounded-md bg-purple-500 text-white">
          <GitFork className="size-3.5" />
        </div>
        <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">Diverge</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-sm font-medium truncate">{data.label || "Fork / Diverge"}</p>
        <span className="mt-1 block text-[11px] text-muted-foreground">
          {count} parallel output{count !== 1 ? "s" : ""}
        </span>
      </div>
      {hasLabels && (
        <div className="flex justify-around px-3 pb-2">
          {positions.map((_, i) => (
            <span key={i} className="text-[10px] text-purple-500 font-medium truncate max-w-[60px]">
              {labels[i] || ""}
            </span>
          ))}
        </div>
      )}
      {positions.map((left, i) => (
        <Handle
          key={`out-${i}`}
          type="source"
          id={`out-${i}`}
          position={Position.Bottom}
          style={{ left: `${left}%` }}
          className="!w-3 !h-3 !bg-purple-500 !border-2 !border-background"
        />
      ))}
    </div>
  )
})
DivergeNode.displayName = "DivergeNode"
