"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Globe } from "lucide-react"
import type { WebhookData } from "./types"

export const WebhookNode = memo(({ data, selected }: NodeProps<WebhookData>) => (
  <div className={`min-w-[180px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? "border-rose-500 shadow-rose-500/20" : "border-rose-500/30"}`}>
    <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-rose-500 !border-2 !border-background" />
    <div className="flex items-center gap-2 rounded-t-[10px] bg-rose-500/10 px-3 py-2">
      <div className="flex size-6 items-center justify-center rounded-md bg-rose-500 text-white">
        <Globe className="size-3.5" />
      </div>
      <span className="text-xs font-semibold text-rose-700 dark:text-rose-300">Webhook</span>
    </div>
    <div className="px-3 py-2.5">
      <p className="text-sm font-medium truncate">{data.label || "Webhook"}</p>
      {data.url && (
        <code className="mt-1 block rounded bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground font-mono truncate">
          {data.method} {data.url}
        </code>
      )}
    </div>
    <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-rose-500 !border-2 !border-background" />
  </div>
))
WebhookNode.displayName = "WebhookNode"
