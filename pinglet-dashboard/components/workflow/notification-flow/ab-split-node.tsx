"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Split } from "lucide-react"
import type { ABSplitData } from "./types"

export const ABSplitNode = memo(({ data, selected }: NodeProps<ABSplitData>) => (
  <div className={`min-w-[180px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? "border-pink-500 shadow-pink-500/20" : "border-pink-500/30"}`}>
    <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-pink-500 !border-2 !border-background" />
    <div className="flex items-center gap-2 rounded-t-[10px] bg-pink-500/10 px-3 py-2">
      <div className="flex size-6 items-center justify-center rounded-md bg-pink-500 text-white">
        <Split className="size-3.5" />
      </div>
      <span className="text-xs font-semibold text-pink-700 dark:text-pink-300">A/B Split</span>
    </div>
    <div className="px-3 py-2.5">
      <p className="text-sm font-medium truncate">{data.label || "A/B Test"}</p>
      <div className="mt-1 flex gap-2 text-[11px]">
        <span className="rounded bg-blue-500/10 px-1.5 py-0.5 text-blue-600 font-medium">{data.splitALabel || "A"}: {data.splitA}%</span>
        <span className="rounded bg-orange-500/10 px-1.5 py-0.5 text-orange-600 font-medium">{data.splitBLabel || "B"}: {data.splitB}%</span>
      </div>
    </div>
    <div className="flex justify-between px-3 pb-2">
      <span className="text-[10px] text-blue-600 font-medium">{data.splitALabel || "A"}</span>
      <span className="text-[10px] text-orange-600 font-medium">{data.splitBLabel || "B"}</span>
    </div>
    <Handle type="source" id="a" position={Position.Bottom} style={{ left: "30%" }} className="!w-3 !h-3 !bg-blue-500 !border-2 !border-background" />
    <Handle type="source" id="b" position={Position.Bottom} style={{ left: "70%" }} className="!w-3 !h-3 !bg-orange-500 !border-2 !border-background" />
  </div>
))
ABSplitNode.displayName = "ABSplitNode"
