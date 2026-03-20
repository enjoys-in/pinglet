"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Shuffle } from "lucide-react"
import type { TransformData } from "./types"

export const TransformNode = memo(({ data, selected }: NodeProps<TransformData>) => (
  <div className={`min-w-[180px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? "border-fuchsia-500 shadow-fuchsia-500/20" : "border-fuchsia-500/30"}`}>
    <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-fuchsia-500 !border-2 !border-background" />
    <div className="flex items-center gap-2 rounded-t-[10px] bg-fuchsia-500/10 px-3 py-2">
      <div className="flex size-6 items-center justify-center rounded-md bg-fuchsia-500 text-white">
        <Shuffle className="size-3.5" />
      </div>
      <span className="text-xs font-semibold text-fuchsia-700 dark:text-fuchsia-300">Transform</span>
    </div>
    <div className="px-3 py-2.5">
      <p className="text-sm font-medium truncate">{data.label || "Transform"}</p>
      {data.mappings && (
        <code className="mt-1 block rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-mono truncate">
          {(() => { try { return Object.keys(JSON.parse(data.mappings)).length + " mappings" } catch { return "JSON mappings" } })()}
        </code>
      )}
    </div>
    <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-fuchsia-500 !border-2 !border-background" />
  </div>
))
TransformNode.displayName = "TransformNode"
