"use client"

import { useState, useEffect, useCallback } from "react"
import { X, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { EVENT_PRESETS, type FlowNode, type EventTriggerData, type ConditionData, type DelayData, type NotificationData, type WebhookData, type ABSplitData, type FilterData, type ScheduleData, type RateLimitData, type PresenceCheckData, type TransformData, type EmailData, type MergeData, type NoteData } from "./types"
import JsonEditor from "./json-editor"

interface FlowConfigPanelProps {
  node: FlowNode
  updateNodeData: (nodeId: string, data: Record<string, unknown>) => void
  onClose: () => void
}

export default function FlowConfigPanel({ node, updateNodeData, onClose }: FlowConfigPanelProps) {
  const [data, setData] = useState<Record<string, unknown>>({ ...node.data })

  useEffect(() => {
    setData({ ...node.data })
  }, [node.id, node.data])

  const update = useCallback((key: string, value: unknown) => {
    setData(prev => ({ ...prev, [key]: value }))
    updateNodeData(node.id, { [key]: value })
  }, [node.id, updateNodeData])

  const TITLES: Record<string, string> = {
    event_trigger: "Event Trigger",
    condition: "Condition",
    delay: "Delay",
    notification: "Send Notification",
    webhook: "Webhook",
    ab_split: "A/B Split",
    filter: "Filter / Segment",
    schedule: "Schedule",
    rate_limit: "Rate Limit",
    presence_check: "Presence Check",
    transform: "Transform",
    email: "Send Email",
    merge: "Merge",
    diverge: "Diverge / Fork",
    note: "Note",
  }

  return (
    <div className="w-80 min-w-0 max-w-80 border-l border-border bg-card flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold">{TITLES[node.type!] || "Configure"}</h3>
        <Button variant="ghost" size="icon" className="size-7" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-4">
          {/* Common Label */}
          <div className="space-y-1.5">
            <Label className="text-xs">Label</Label>
            <Input
              value={(data.label as string) || ""}
              onChange={e => update("label", e.target.value)}
              placeholder="Node label"
              className="h-8 text-sm"
            />
          </div>

          <Separator />

          {/* ─── Event Trigger Fields ────────────────────────────────── */}
          {node.type === "event_trigger" && (() => {
            const isCustom = !EVENT_PRESETS.some(p => p.eventName && p.eventName === (data.eventName as string))
            const categories = [...new Set(EVENT_PRESETS.map(p => p.category))]
            return (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Event Preset</Label>
                <Select
                  value={isCustom ? "__custom__" : ((data.eventName as string) || "")}
                  onValueChange={val => {
                    if (val === "__custom__") {
                      update("eventName", "")
                      update("label", "Custom Event")
                      update("payload", "{}")
                      return
                    }
                    const preset = EVENT_PRESETS.find(p => p.eventName === val)
                    if (preset) {
                      update("eventName", preset.eventName)
                      update("label", preset.name)
                      update("payload", JSON.stringify(preset.samplePayload, null, 2))
                    }
                  }}
                >
                  <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Choose an event" /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => {
                      const presets = EVENT_PRESETS.filter(p => p.category === cat)
                      return (
                        <div key={cat}>
                          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{cat}</div>
                          {presets.map(p => (
                            <SelectItem key={p.eventName || "__custom__"} value={p.eventName || "__custom__"}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </div>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Event Name {isCustom && <span className="text-amber-500 ml-1">(custom)</span>}</Label>
                <Input
                  value={(data.eventName as string) || ""}
                  onChange={e => update("eventName", e.target.value)}
                  placeholder={isCustom ? "my.custom.event" : "e.g. notification.sent"}
                  className="h-8 text-sm font-mono"
                />
                {isCustom && (data.eventName as string) === "" && (
                  <p className="text-xs text-amber-500">Enter your custom event name</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Sample Payload (JSON)</Label>
                <JsonEditor
                  value={(data.payload as string) || "{}"}
                  onChange={val => update("payload", val)}
                  height="h-32"
                  placeholder='{"userId": "{{userId}}"}'
                />
              </div>
            </>
            )
          })()}

          {/* ─── Condition Fields ─────────────────────────────────── */}
          {node.type === "condition" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Field / Path</Label>
                <Input
                  value={(data.field as string) || ""}
                  onChange={e => update("field", e.target.value)}
                  placeholder="e.g. payload.amount"
                  className="h-8 text-sm font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Operator</Label>
                <Select value={(data.operator as string) || "=="} onValueChange={val => update("operator", val)}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["==", "!=", ">", "<", ">=", "<=", "contains", "not_contains", "exists", "not_exists"].map(op => (
                      <SelectItem key={op} value={op}>{op}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Value</Label>
                <Input
                  value={(data.value as string) || ""}
                  onChange={e => update("value", e.target.value)}
                  placeholder="e.g. 100"
                  className="h-8 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">True Label</Label>
                  <Input value={(data.trueLabel as string) || "Yes"} onChange={e => update("trueLabel", e.target.value)} className="h-8 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">False Label</Label>
                  <Input value={(data.falseLabel as string) || "No"} onChange={e => update("falseLabel", e.target.value)} className="h-8 text-sm" />
                </div>
              </div>
            </>
          )}

          {/* ─── Delay Fields ────────────────────────────────────── */}
          {node.type === "delay" && (
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-xs">Duration</Label>
                <Input
                  type="number"
                  min={0}
                  value={(data.duration as number) || 0}
                  onChange={e => update("duration", Number(e.target.value))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Unit</Label>
                <Select value={(data.unit as string) || "minutes"} onValueChange={val => update("unit", val)}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["seconds", "minutes", "hours", "days"].map(u => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* ─── Notification Fields ─────────────────────────────── */}
          {node.type === "notification" && <NotificationFields data={data} update={update} />}

          {/* ─── Webhook Fields ──────────────────────────────────── */}
          {node.type === "webhook" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">URL</Label>
                <Input
                  value={(data.url as string) || ""}
                  onChange={e => update("url", e.target.value)}
                  placeholder="https://api.example.com/webhook"
                  className="h-8 text-sm font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Method</Label>
                <Select value={(data.method as string) || "POST"} onValueChange={val => update("method", val)}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["GET", "POST", "PUT", "PATCH", "DELETE"].map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Headers (JSON)</Label>
                <JsonEditor
                  value={(data.headers as string) || "{}"}
                  onChange={val => update("headers", val)}
                  height="h-20"
                  placeholder='{"Authorization": "Bearer ..."}'
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Body (JSON)</Label>
                <JsonEditor
                  value={(data.body as string) || "{}"}
                  onChange={val => update("body", val)}
                  height="h-24"
                  placeholder='{"key": "{{value}}"}'
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Retry Count</Label>
                <Input
                  type="number"
                  min={0}
                  max={5}
                  value={(data.retryCount as number) || 0}
                  onChange={e => update("retryCount", Number(e.target.value))}
                  className="h-8 text-sm"
                />
              </div>
            </>
          )}

          {/* ─── A/B Split Fields ────────────────────────────────── */}
          {node.type === "ab_split" && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Split A %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={(data.splitA as number) ?? 50}
                    onChange={e => { const v = Number(e.target.value); update("splitA", v); update("splitB", 100 - v) }}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Split B %</Label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={(data.splitB as number) ?? 50}
                    onChange={e => { const v = Number(e.target.value); update("splitB", v); update("splitA", 100 - v) }}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">A Label</Label>
                  <Input value={(data.splitALabel as string) || "A"} onChange={e => update("splitALabel", e.target.value)} className="h-8 text-sm" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">B Label</Label>
                  <Input value={(data.splitBLabel as string) || "B"} onChange={e => update("splitBLabel", e.target.value)} className="h-8 text-sm" />
                </div>
              </div>
            </>
          )}

          {/* ─── Filter Fields ───────────────────────────────────── */}
          {node.type === "filter" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Field / Path</Label>
                <Input
                  value={(data.field as string) || ""}
                  onChange={e => update("field", e.target.value)}
                  placeholder="e.g. user.plan"
                  className="h-8 text-sm font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Operator</Label>
                <Select value={(data.operator as string) || "=="} onValueChange={val => update("operator", val)}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["==", "!=", ">", "<", ">=", "<=", "contains", "not_contains", "exists", "not_exists", "in", "not_in"].map(op => (
                      <SelectItem key={op} value={op}>{op}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Value</Label>
                <Input
                  value={(data.value as string) || ""}
                  onChange={e => update("value", e.target.value)}
                  placeholder="e.g. premium"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">User Attribute (optional)</Label>
                <Input
                  value={(data.attribute as string) || ""}
                  onChange={e => update("attribute", e.target.value)}
                  placeholder="e.g. segment, country"
                  className="h-8 text-sm"
                />
              </div>
            </>
          )}

          {/* ─── Schedule Fields ──────────────────────────────────── */}
          {node.type === "schedule" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Active Days</Label>
                <div className="flex flex-wrap gap-1.5">
                  {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map(day => {
                    const days = (data.days as string[]) || []
                    const active = days.includes(day)
                    return (
                      <Button
                        key={day}
                        variant={active ? "default" : "outline"}
                        size="sm"
                        className="h-7 text-xs px-2 capitalize"
                        onClick={() => update("days", active ? days.filter(d => d !== day) : [...days, day])}
                      >
                        {day}
                      </Button>
                    )
                  })}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Start Hour (0-23)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    value={(data.startHour as number) ?? 9}
                    onChange={e => update("startHour", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">End Hour (0-23)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={23}
                    value={(data.endHour as number) ?? 17}
                    onChange={e => update("endHour", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Timezone</Label>
                <Input
                  value={(data.timezone as string) || "UTC"}
                  onChange={e => update("timezone", e.target.value)}
                  placeholder="UTC"
                  className="h-8 text-sm"
                />
              </div>
            </>
          )}

          {/* ─── Rate Limit Fields ───────────────────────────────── */}
          {node.type === "rate_limit" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Max Count</Label>
                <Input
                  type="number"
                  min={1}
                  value={(data.maxCount as number) || 1}
                  onChange={e => update("maxCount", Number(e.target.value))}
                  className="h-8 text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label className="text-xs">Window</Label>
                  <Input
                    type="number"
                    min={1}
                    value={(data.window as number) || 1}
                    onChange={e => update("window", Number(e.target.value))}
                    className="h-8 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Unit</Label>
                  <Select value={(data.windowUnit as string) || "hours"} onValueChange={val => update("windowUnit", val)}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["seconds", "minutes", "hours", "days"].map(u => (
                        <SelectItem key={u} value={u}>{u}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Grouping Key (optional)</Label>
                <Input
                  value={(data.key as string) || ""}
                  onChange={e => update("key", e.target.value)}
                  placeholder="e.g. userId"
                  className="h-8 text-sm font-mono"
                />
              </div>
            </>
          )}

          {/* ─── Presence Check Fields ───────────────────────────── */}
          {node.type === "presence_check" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Check Type</Label>
                <Select value={(data.checkType as string) || "online"} onValueChange={val => update("checkType", val)}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="offline">Offline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Fallback Action</Label>
                <Select value={(data.fallbackAction as string) || "queue"} onValueChange={val => update("fallbackAction", val)}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="queue">Queue for later</SelectItem>
                    <SelectItem value="skip">Skip</SelectItem>
                    <SelectItem value="email">Send email instead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* ─── Transform Fields ────────────────────────────────── */}
          {node.type === "transform" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Mappings (JSON)</Label>
              <JsonEditor
                value={(data.mappings as string) || "{}"}
                onChange={val => update("mappings", val)}
                height="h-36"
                placeholder='{"newField": "payload.oldField", "computed": "payload.price * payload.qty"}'
              />
            </div>
          )}

          {/* ─── Email Fields ────────────────────────────────────── */}
          {node.type === "email" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">To</Label>
                <Input
                  value={(data.to as string) || ""}
                  onChange={e => update("to", e.target.value)}
                  placeholder='{"{{email}}"} or static address'
                  className="h-8 text-sm font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Subject</Label>
                <Input
                  value={(data.subject as string) || ""}
                  onChange={e => update("subject", e.target.value)}
                  placeholder="Email subject"
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Body (HTML)</Label>
                <Textarea
                  value={(data.body as string) || ""}
                  onChange={e => update("body", e.target.value)}
                  className="h-32 text-xs font-mono"
                  placeholder="<h1>Hello {{name}}</h1>"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Template ID (optional)</Label>
                <Input
                  value={(data.templateId as string) || ""}
                  onChange={e => update("templateId", e.target.value)}
                  placeholder="template_welcome"
                  className="h-8 text-sm font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Reply-To (optional)</Label>
                <Input
                  value={(data.replyTo as string) || ""}
                  onChange={e => update("replyTo", e.target.value)}
                  placeholder="support@example.com"
                  className="h-8 text-sm"
                />
              </div>
            </>
          )}

          {/* ─── Merge Fields ────────────────────────────────────── */}
          {node.type === "merge" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Merge Mode</Label>
              <Select value={(data.mergeMode as string) || "all"} onValueChange={val => update("mergeMode", val)}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Wait for ALL inputs</SelectItem>
                  <SelectItem value="any">Continue on ANY input</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* ─── Diverge Fields ──────────────────────────────── */}
          {node.type === "diverge" && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs">Output Count (2-5)</Label>
                <Select
                  value={String((data.outputCount as number) || 3)}
                  onValueChange={val => {
                    const count = Number(val)
                    const labels = (data.outputLabels as string[]) || []
                    // Pad or trim labels array to match new count
                    const newLabels = Array.from({ length: count }, (_, i) => labels[i] || `#${i + 1}`)
                    update("outputCount", count)
                    update("outputLabels", newLabels)
                  }}
                >
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[2, 3, 4, 5].map(n => (
                      <SelectItem key={n} value={String(n)}>{n} outputs</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label className="text-xs">Output Labels</Label>
                {Array.from({ length: (data.outputCount as number) || 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded bg-purple-500/10 text-[10px] font-bold text-purple-500">{i + 1}</div>
                    <Input
                      value={((data.outputLabels as string[]) || [])[i] || ""}
                      onChange={e => {
                        const labels = [...((data.outputLabels as string[]) || [])]
                        labels[i] = e.target.value
                        update("outputLabels", labels)
                      }}
                      placeholder={`Output ${i + 1} label`}
                      className="h-7 text-xs"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ─── Note Fields ─────────────────────────────────────── */}
          {node.type === "note" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Content</Label>
              <Textarea
                value={(data.content as string) || ""}
                onChange={e => update("content", e.target.value)}
                className="h-32 text-sm"
                placeholder="Add notes, context, or documentation..."
              />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

// ─── Notification Sub-form ──────────────────────────────────────────────────────

function NotificationFields({ data, update }: { data: Record<string, unknown>; update: (k: string, v: unknown) => void }) {
  const nType = (data.notificationType as string) || "0"
  const buttons = (data.buttons as Array<{ text: string; action: string; event?: string }>) || []

  return (
    <>
      <div className="space-y-1.5">
        <Label className="text-xs">Notification Type</Label>
        <Select value={nType} onValueChange={val => update("notificationType", val)}>
          <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Type 0 — In-Tab Toast</SelectItem>
            <SelectItem value="2">Type 2 — Glassmorphism</SelectItem>
            <SelectItem value="-1">Type -1 — Browser Push</SelectItem>
            <SelectItem value="1">Type 1 — Custom Template</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs">Title</Label>
        <Input value={(data.title as string) || ""} onChange={e => update("title", e.target.value)} placeholder="Notification title" className="h-8 text-sm" />
      </div>

      {nType !== "1" && (
        <div className="space-y-1.5">
          <Label className="text-xs">Description</Label>
          <Textarea value={(data.description as string) || ""} onChange={e => update("description", e.target.value)} placeholder="Message body" className="h-16 text-sm" />
        </div>
      )}

      {/* Type 0 / 2 specific */}
      {(nType === "0" || nType === "2") && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs">Icon URL</Label>
            <Input value={(data.icon as string) || ""} onChange={e => update("icon", e.target.value)} className="h-8 text-sm" placeholder="https://..." />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">URL (on click)</Label>
            <Input value={(data.url as string) || ""} onChange={e => update("url", e.target.value)} className="h-8 text-sm" placeholder="https://..." />
          </div>
          {nType === "0" && (
            <div className="space-y-1.5">
              <Label className="text-xs">Variant</Label>
              <Select value={(data.variant as string) || "default"} onValueChange={val => update("variant", val)}>
                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["default", "success", "error", "warning", "info"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          )}
        </>
      )}

      {/* Type -1 specific */}
      {nType === "-1" && (
        <>
          <div className="space-y-1.5">
            <Label className="text-xs">Push Icon URL</Label>
            <Input value={(data.pushIcon as string) || ""} onChange={e => update("pushIcon", e.target.value)} className="h-8 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Push Image URL</Label>
            <Input value={(data.pushImage as string) || ""} onChange={e => update("pushImage", e.target.value)} className="h-8 text-sm" />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Require Interaction</Label>
            <Switch checked={!!data.requireInteraction} onCheckedChange={val => update("requireInteraction", val)} />
          </div>
        </>
      )}

      {/* Type 1 specific */}
      {nType === "1" && (
        <div className="space-y-1.5">
          <Label className="text-xs">Template ID</Label>
          <Input value={(data.templateId as string) || ""} onChange={e => update("templateId", e.target.value)} placeholder="template_welcome" className="h-8 text-sm font-mono" />
        </div>
      )}

      {/* Buttons (max 3 for toast/glass, max 2 for push) */}
      <Separator />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Buttons ({buttons.length}/{nType === "-1" ? 2 : 3})</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs px-2"
            disabled={buttons.length >= (nType === "-1" ? 2 : 3)}
            onClick={() => update("buttons", [...buttons, { text: "", action: "", event: "" }])}
          >
            <Plus className="size-3 mr-1" /> Add
          </Button>
        </div>
        {buttons.map((btn, i) => (
          <div key={i} className="space-y-1.5 rounded-lg border border-border/60 p-2">
            <div className="flex gap-2">
              <Input value={btn.text} onChange={e => { const nb = [...buttons]; nb[i] = { ...nb[i], text: e.target.value }; update("buttons", nb) }} placeholder="Label" className="h-7 text-xs flex-1" />
              <Button variant="ghost" size="icon" className="size-7 shrink-0" onClick={() => update("buttons", buttons.filter((_, j) => j !== i))}>
                <Trash2 className="size-3 text-destructive" />
              </Button>
            </div>
            <Input value={btn.action} onChange={e => { const nb = [...buttons]; nb[i] = { ...nb[i], action: e.target.value }; update("buttons", nb) }} placeholder="URL or action" className="h-7 text-xs" />
            <Input value={btn.event || ""} onChange={e => { const nb = [...buttons]; nb[i] = { ...nb[i], event: e.target.value }; update("buttons", nb) }} placeholder="Custom event (optional)" className="h-7 text-xs font-mono" />
          </div>
        ))}
      </div>
    </>
  )
}
