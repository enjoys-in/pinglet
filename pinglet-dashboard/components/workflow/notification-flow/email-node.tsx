"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Mail } from "lucide-react"
import type { EmailData } from "./types"

export const EmailNode = memo(({ data, selected }: NodeProps<EmailData>) => (
  <div className={`min-w-[180px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? "border-sky-500 shadow-sky-500/20" : "border-sky-500/30"}`}>
    <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-sky-500 !border-2 !border-background" />
    <div className="flex items-center gap-2 rounded-t-[10px] bg-sky-500/10 px-3 py-2">
      <div className="flex size-6 items-center justify-center rounded-md bg-sky-500 text-white">
        <Mail className="size-3.5" />
      </div>
      <span className="text-xs font-semibold text-sky-700 dark:text-sky-300">Email</span>
    </div>
    <div className="px-3 py-2.5">
      <p className="text-sm font-medium truncate">{data.label || "Send Email"}</p>
      {data.subject && (
        <code className="mt-1 block rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-mono truncate">
          {data.subject}
        </code>
      )}
      {data.to && (
        <span className="mt-0.5 block text-[11px] text-muted-foreground truncate">To: {data.to}</span>
      )}
    </div>
    <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-sky-500 !border-2 !border-background" />
  </div>
))
EmailNode.displayName = "EmailNode"
