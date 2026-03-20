"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { GitBranch } from "lucide-react"
import type { ConditionData } from "./types"

export const ConditionNode = memo(({ data, selected }: NodeProps<ConditionData>) => (
  <div className={`min-w-[180px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? "border-amber-500 shadow-amber-500/20" : "border-amber-500/30"}`}>
    <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-amber-500 !border-2 !border-background" />
    <div className="flex items-center gap-2 rounded-t-[10px] bg-amber-500/10 px-3 py-2">
      <div className="flex size-6 items-center justify-center rounded-md bg-amber-500 text-white">
        <GitBranch className="size-3.5" />
      </div>
      <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">Condition</span>
    </div>
    <div className="px-3 py-2.5">
      <p className="text-sm font-medium truncate">{data.label || "If / Else"}</p>
      {data.field && (
        <code className="mt-1 block rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-mono truncate">
          {data.field} {data.operator} {data.value}
        </code>
      )}
    </div>
    <div className="flex justify-between px-3 pb-2">
      <span className="text-[10px] text-emerald-600 font-medium">{data.trueLabel || "Yes"}</span>
      <span className="text-[10px] text-red-500 font-medium">{data.falseLabel || "No"}</span>
    </div>
    <Handle type="source" id="true" position={Position.Bottom} style={{ left: "30%" }} className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-background" />
    <Handle type="source" id="false" position={Position.Bottom} style={{ left: "70%" }} className="!w-3 !h-3 !bg-red-500 !border-2 !border-background" />
  </div>
))
ConditionNode.displayName = "ConditionNode"
