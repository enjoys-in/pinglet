"use client"

import { memo } from "react"
import { type NodeProps } from "reactflow"
import { StickyNote } from "lucide-react"
import type { NoteData } from "./types"

export const NoteNode = memo(({ data, selected }: NodeProps<NoteData>) => (
  <div className={`min-w-[160px] max-w-[240px] rounded-xl border-2 bg-card shadow-md transition-all ${selected ? "border-yellow-500 shadow-yellow-500/20" : "border-yellow-500/30"}`}>
    <div className="flex items-center gap-2 rounded-t-[10px] bg-yellow-500/10 px-3 py-2">
      <div className="flex size-6 items-center justify-center rounded-md bg-yellow-500 text-white">
        <StickyNote className="size-3.5" />
      </div>
      <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-300">Note</span>
    </div>
    <div className="px-3 py-2.5">
      <p className="text-sm font-medium truncate">{data.label || "Note"}</p>
      {data.content && (
        <p className="mt-1 text-[11px] text-muted-foreground line-clamp-3 whitespace-pre-wrap">
          {data.content}
        </p>
      )}
    </div>
  </div>
))
NoteNode.displayName = "NoteNode"
