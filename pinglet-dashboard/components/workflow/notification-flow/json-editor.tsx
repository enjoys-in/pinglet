"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Check, Copy, WandSparkles, AlertCircle } from "lucide-react"

interface JsonEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  height?: string
  readOnly?: boolean
}

function highlightJson(json: string): string {
  // Escape HTML first
  const escaped = json
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")

  return escaped.replace(
    /("(?:\\.|[^"\\])*")\s*:/g, // keys
    '<span class="text-purple-400">$1</span>:'
  ).replace(
    /:\s*("(?:\\.|[^"\\])*")/g, // string values
    ': <span class="text-emerald-400">$1</span>'
  ).replace(
    /:\s*(\d+\.?\d*)/g, // numbers
    ': <span class="text-amber-400">$1</span>'
  ).replace(
    /:\s*(true|false)/g, // booleans
    ': <span class="text-sky-400">$1</span>'
  ).replace(
    /:\s*(null)/g, // null
    ': <span class="text-red-400">$1</span>'
  )
}

function validateJson(str: string): { valid: boolean; error?: string } {
  if (!str.trim()) return { valid: true }
  // Replace template placeholders like {{var}} with valid JSON strings before parsing
  const sanitized = str.replace(/\{\{[^}]*\}\}/g, '"__tpl__"')
  try {
    JSON.parse(sanitized)
    return { valid: true }
  } catch (e: any) {
    return { valid: false, error: e.message?.replace(/^JSON\.parse:\s*/, "") || "Invalid JSON" }
  }
}

export default function JsonEditor({ value, onChange, placeholder, className, height = "h-32", readOnly = false }: JsonEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const [error, setError] = useState<string>()
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!isEditing) setEditValue(value)
  }, [value, isEditing])

  const handleFocus = useCallback(() => {
    setIsEditing(true)
    setEditValue(value)
  }, [value])

  const handleBlur = useCallback(() => {
    setIsEditing(false)
    const result = validateJson(editValue)
    if (result.valid) {
      setError(undefined)
      onChange(editValue)
    } else {
      setError(result.error)
    }
  }, [editValue, onChange])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setEditValue(val)
    const result = validateJson(val)
    setError(result.valid ? undefined : result.error)
    onChange(val)
  }, [onChange])

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(editValue || "{}")
      const formatted = JSON.stringify(parsed, null, 2)
      setEditValue(formatted)
      onChange(formatted)
      setError(undefined)
    } catch {
      // already invalid, do nothing
    }
  }, [editValue, onChange])

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(editValue || value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [editValue, value])

  const displayValue = isEditing ? editValue : value

  return (
    <div className={cn("relative group rounded-lg border bg-zinc-950/80 overflow-hidden max-w-full", error ? "border-red-500/50" : "border-border/50", className)}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-2 py-1 bg-zinc-900/60 border-b border-border/30">
        <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wider">json</span>
        <div className="flex items-center gap-0.5">
          {!readOnly && (
            <Button
              variant="ghost"
              size="icon"
              className="size-5 text-muted-foreground hover:text-foreground"
              onClick={handleFormat}
              title="Format JSON"
            >
              <WandSparkles className="size-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="size-5 text-muted-foreground hover:text-foreground"
            onClick={handleCopy}
            title="Copy"
          >
            {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
          </Button>
        </div>
      </div>

      {/* Editor area */}
      <div className={cn("relative overflow-auto", height)}>
        {isEditing || readOnly ? null : (
          <pre
            className={cn(
              "absolute inset-0 p-2.5 text-xs font-mono leading-relaxed overflow-auto whitespace-pre-wrap break-all pointer-events-none",
              "text-zinc-300"
            )}
            dangerouslySetInnerHTML={{ __html: highlightJson(displayValue || placeholder || "{}") }}
          />
        )}

        {!readOnly && (
          <textarea
            ref={textareaRef}
            value={editValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            spellCheck={false}
            placeholder={placeholder}
            className={cn(
              "absolute inset-0 w-full h-full p-2.5 text-xs font-mono leading-relaxed resize-none",
              "bg-transparent outline-none whitespace-pre-wrap break-all",
              isEditing ? "text-zinc-200 caret-primary" : "text-transparent caret-transparent",
              "placeholder:text-zinc-600"
            )}
          />
        )}

        {readOnly && (
          <pre
            className="p-2.5 text-xs font-mono leading-relaxed overflow-auto whitespace-pre-wrap break-all text-zinc-300 h-full"
            dangerouslySetInnerHTML={{ __html: highlightJson(displayValue || "{}") }}
          />
        )}
      </div>

      {/* Error bar */}
      {error && (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border-t border-red-500/30">
          <AlertCircle className="size-3 text-red-400 shrink-0" />
          <span className="text-[10px] text-red-400 truncate">{error}</span>
        </div>
      )}
    </div>
  )
}
