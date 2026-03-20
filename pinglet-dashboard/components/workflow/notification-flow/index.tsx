"use client"

import type React from "react"
import { useState, useCallback, useRef, useMemo, useEffect } from "react"
import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Panel,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type NodeTypes,
  type Node,
} from "reactflow"
// @ts-ignore - CSS import works at build time
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Save, Download, Trash2, Zap, GitBranch, Clock, Bell, GripVertical, Eye, ArrowLeft, Globe, Split, Filter, CalendarClock, Gauge, Shuffle, Mail, Merge, StickyNote } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { EventTriggerNode } from "./event-trigger-node"
import { ConditionNode } from "./condition-node"
import { DelayNode } from "./delay-node"
import { NotificationNode } from "./notification-node"
import { WebhookNode } from "./webhook-node"
import { ABSplitNode } from "./ab-split-node"
import { FilterNode } from "./filter-node"
import { ScheduleNode } from "./schedule-node"
import { RateLimitNode } from "./rate-limit-node"
import { PresenceCheckNode } from "./presence-check-node"
import { TransformNode } from "./transform-node"
import { EmailNode } from "./email-node"
import { MergeNode } from "./merge-node"
import { NoteNode } from "./note-node"
import FlowConfigPanel from "./flow-config-panel"
import { type FlowNode, type FlowExport, getFlowById, saveFlow, generateFlowId } from "./types"

// ─── Node Type Registry ─────────────────────────────────────────────────────────

const nodeTypes: NodeTypes = {
  event_trigger: EventTriggerNode,
  condition: ConditionNode,
  delay: DelayNode,
  notification: NotificationNode,
  webhook: WebhookNode,
  ab_split: ABSplitNode,
  filter: FilterNode,
  schedule: ScheduleNode,
  rate_limit: RateLimitNode,
  presence_check: PresenceCheckNode,
  transform: TransformNode,
  email: EmailNode,
  merge: MergeNode,
  note: NoteNode,
}

// ─── Sidebar Node Palette ───────────────────────────────────────────────────────

const PALETTE = [
  // Triggers
  { type: "event_trigger", label: "Event Trigger", desc: "user:signup, user:cart …", icon: Zap, color: "text-blue-500", group: "Triggers" },
  { type: "schedule", label: "Schedule", desc: "Time-based delivery window", icon: CalendarClock, color: "text-indigo-500", group: "Triggers" },
  // Logic
  { type: "condition", label: "Condition", desc: "If / Else branch", icon: GitBranch, color: "text-amber-500", group: "Logic" },
  { type: "ab_split", label: "A/B Split", desc: "Split traffic by %", icon: Split, color: "text-pink-500", group: "Logic" },
  { type: "filter", label: "Filter / Segment", desc: "Filter by user attribute", icon: Filter, color: "text-cyan-500", group: "Logic" },
  { type: "delay", label: "Delay", desc: "Wait before next step", icon: Clock, color: "text-violet-500", group: "Logic" },
  { type: "rate_limit", label: "Rate Limit", desc: "Throttle notifications", icon: Gauge, color: "text-orange-500", group: "Logic" },
  { type: "presence_check", label: "Presence Check", desc: "Online / offline check", icon: Eye, color: "text-teal-500", group: "Logic" },
  { type: "merge", label: "Merge", desc: "Join multiple branches", icon: Merge, color: "text-lime-500", group: "Logic" },
  // Actions
  { type: "notification", label: "Send Notification", desc: "Toast, Push, Template …", icon: Bell, color: "text-emerald-500", group: "Actions" },
  { type: "email", label: "Send Email", desc: "Email with template", icon: Mail, color: "text-sky-500", group: "Actions" },
  { type: "webhook", label: "Webhook", desc: "HTTP request to URL", icon: Globe, color: "text-rose-500", group: "Actions" },
  // Utilities
  { type: "transform", label: "Transform", desc: "Map / reshape data", icon: Shuffle, color: "text-fuchsia-500", group: "Utilities" },
  { type: "note", label: "Note", desc: "Annotation, no connection", icon: StickyNote, color: "text-yellow-500", group: "Utilities" },
] as const

let _id = 0
const nextId = (type: string) => `${type}_${++_id}`

const defaultData: Record<string, Record<string, unknown>> = {
  event_trigger: { label: "New Event", eventName: "", payload: "{}" },
  condition: { label: "Condition", field: "", operator: "==", value: "", trueLabel: "Yes", falseLabel: "No" },
  delay: { label: "Wait", duration: 5, unit: "minutes" },
  notification: { label: "Notify", notificationType: "0", title: "", description: "", buttons: [] },
  webhook: { label: "Webhook", url: "", method: "POST", headers: "{}", body: "{}", retryCount: 0 },
  ab_split: { label: "A/B Test", splitA: 50, splitB: 50, splitALabel: "A", splitBLabel: "B" },
  filter: { label: "Filter", field: "", operator: "==", value: "", attribute: "" },
  schedule: { label: "Schedule", days: ["mon", "tue", "wed", "thu", "fri"], startHour: 9, endHour: 17, timezone: "UTC" },
  rate_limit: { label: "Rate Limit", maxCount: 3, window: 1, windowUnit: "hours", key: "" },
  presence_check: { label: "Presence Check", checkType: "online", fallbackAction: "queue" },
  transform: { label: "Transform", mappings: "{}" },
  email: { label: "Send Email", to: "", subject: "", body: "", templateId: "", replyTo: "" },
  merge: { label: "Merge", mergeMode: "all" },
  note: { label: "Note", content: "" },
}

// ─── Main Component ─────────────────────────────────────────────────────────────

interface NotificationFlowBuilderProps {
  flowId?: string
}

export default function NotificationFlowBuilder({ flowId }: NotificationFlowBuilderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [rfInstance, setRfInstance] = useState<any>(null)
  const [showPayload, setShowPayload] = useState(false)
  const [flowName, setFlowName] = useState("Untitled Flow")
  const [currentFlowId] = useState(() => flowId || generateFlowId())
  const { toast } = useToast()
  const router = useRouter()

  // Load existing flow
  useEffect(() => {
    if (flowId) {
      const existing = getFlowById(flowId)
      if (existing) {
        setFlowName(existing.name)
        setNodes(existing.nodes.map(n => ({ ...n, data: n.data })) as Node[])
        setEdges(existing.edges.map(e => ({ ...e, animated: true, style: { stroke: "hsl(var(--primary))", strokeWidth: 2 } })))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowId])

  // Connect edges
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges(eds => addEdge({ ...params, animated: true, style: { stroke: "hsl(var(--primary))", strokeWidth: 2 } }, eds)),
    [setEdges],
  )

  // Drag over canvas
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }, [])

  // Drop node onto canvas
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const type = e.dataTransfer.getData("application/notification-flow")
      if (!type || !rfInstance || !wrapperRef.current) return

      const bounds = wrapperRef.current.getBoundingClientRect()
      const position = rfInstance.screenToFlowPosition({
        x: e.clientX - bounds.left,
        y: e.clientY - bounds.top,
      })

      const newNode: Node = {
        id: nextId(type),
        type,
        position,
        data: { ...defaultData[type] },
      }

      setNodes(nds => nds.concat(newNode))
    },
    [rfInstance, setNodes],
  )

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => setSelectedNode(node), [])
  const onPaneClick = useCallback(() => setSelectedNode(null), [])

  const updateNodeData = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes(nds =>
        nds.map(n => (n.id === nodeId ? { ...n, data: { ...n.data, ...data } } : n)),
      )
      // Keep selected node in sync
      setSelectedNode(prev => (prev && prev.id === nodeId ? { ...prev, data: { ...prev.data, ...data } } : prev))
    },
    [setNodes],
  )

  // Build export payload
  const flowPayload = useMemo<FlowExport>(() => ({
    id: currentFlowId,
    name: flowName,
    projectId: getFlowById(currentFlowId)?.projectId || "",
    status: "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: nodes.map(n => ({
      id: n.id,
      type: n.type as FlowExport["nodes"][0]["type"],
      data: n.data,
      position: n.position,
    })),
    edges: edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      label: typeof e.label === "string" ? e.label : undefined,
    })),
  }), [currentFlowId, flowName, nodes, edges])

  // Save flow
  const handleSave = useCallback(() => {
    if (nodes.length === 0) {
      toast({ title: "Nothing to save", description: "Add nodes first.", variant: "destructive" })
      return
    }
    const existing = getFlowById(currentFlowId)
    saveFlow({
      ...flowPayload,
      status: existing?.status || "draft",
      createdAt: existing?.createdAt || new Date().toISOString(),
    })
    toast({ title: "Flow saved", description: `"${flowName}" saved successfully.` })
  }, [flowPayload, nodes.length, toast, currentFlowId, flowName])

  // Export JSON
  const handleExport = useCallback(() => {
    if (nodes.length === 0) return
    const blob = new Blob([JSON.stringify(flowPayload, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${flowName.toLowerCase().replace(/\s+/g, "-")}-flow.json`
    a.click()
    URL.revokeObjectURL(url)
    toast({ title: "Exported", description: "Flow JSON downloaded." })
  }, [flowPayload, nodes.length, toast])

  // Clear canvas
  const handleClear = useCallback(() => {
    setNodes([])
    setEdges([])
    setSelectedNode(null)
    toast({ title: "Canvas cleared" })
  }, [setNodes, setEdges, toast])

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden rounded-lg border border-border bg-background">
      {/* ─── Left: Node Palette ─── */}
      <div className="w-56 shrink-0 border-r border-border bg-card/50 flex flex-col">
        <div className="px-3 py-3 border-b border-border">
          <Button variant="ghost" size="sm" className="h-7 text-xs mb-2 -ml-1 text-muted-foreground" onClick={() => router.push("/u/flows")}>
            <ArrowLeft className="size-3.5 mr-1" /> Back to Flows
          </Button>
          <Input
            value={flowName}
            onChange={e => setFlowName(e.target.value)}
            className="h-8 text-sm font-semibold border-transparent hover:border-border focus:border-border bg-transparent px-1"
            placeholder="Flow name"
          />
          <p className="text-[11px] text-muted-foreground mt-1 px-1">Drag nodes onto canvas</p>
        </div>
        <div className="flex-1 overflow-auto p-2 space-y-1.5">
          {PALETTE.map((p, i) => {
            const Icon = p.icon
            const showGroup = i === 0 || PALETTE[i - 1].group !== p.group
            return (
              <div key={p.type}>
                {showGroup && (
                  <p className={`text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1 ${i > 0 ? "mt-3 mb-1" : "mb-1"}`}>
                    {p.group}
                  </p>
                )}
                <div
                  draggable
                  onDragStart={e => {
                    e.dataTransfer.setData("application/notification-flow", p.type)
                    e.dataTransfer.effectAllowed = "move"
                  }}
                  className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-card p-2.5 cursor-grab active:cursor-grabbing hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <GripVertical className="size-3.5 text-muted-foreground/50 shrink-0" />
                  <Icon className={`size-4 shrink-0 ${p.color}`} />
                  <div className="min-w-0">
                    <p className="text-xs font-medium truncate">{p.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{p.desc}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ─── Center: Canvas ─── */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1" ref={wrapperRef}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setRfInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
              snapToGrid
              snapGrid={[20, 20]}
              proOptions={{ hideAttribution: true }}
            >
              <Background gap={20} size={1} />
              <Controls className="!rounded-lg !border-border !shadow-md" />
              <MiniMap
                className="!rounded-lg !border-border !shadow-md"
                nodeColor={n => {
                  const colors: Record<string, string> = {
                    event_trigger: "#3b82f6",
                    condition: "#f59e0b",
                    delay: "#8b5cf6",
                    notification: "#10b981",
                    webhook: "#f43f5e",
                    ab_split: "#ec4899",
                    filter: "#06b6d4",
                    schedule: "#6366f1",
                    rate_limit: "#f97316",
                    presence_check: "#14b8a6",
                    transform: "#d946ef",
                    email: "#0ea5e9",
                    merge: "#84cc16",
                    note: "#eab308",
                  }
                  return colors[n.type || ""] || "#6b7280"
                }}
              />

              {/* Toolbar */}
              <Panel position="top-right" className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setShowPayload(!showPayload)}>
                  <Eye className="size-3.5 mr-1" /> {showPayload ? "Hide" : "Payload"}
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleSave}>
                  <Save className="size-3.5 mr-1" /> Save
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={handleExport}>
                  <Download className="size-3.5 mr-1" /> Export
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs text-destructive hover:text-destructive" onClick={handleClear}>
                  <Trash2 className="size-3.5 mr-1" /> Clear
                </Button>
              </Panel>

              {/* Empty state */}
              {nodes.length === 0 && (
                <Panel position="top-center" className="mt-24">
                  <div className="text-center space-y-2 opacity-60">
                    <Zap className="size-10 mx-auto text-muted-foreground" />
                    <p className="text-sm text-muted-foreground font-medium">Drag an Event Trigger to start</p>
                    <p className="text-xs text-muted-foreground">Connect events → conditions → notifications</p>
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </ReactFlowProvider>
        </div>

        {/* Payload Preview */}
        {showPayload && (
          <div className="border-t border-border bg-card/80 max-h-64 overflow-auto">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/60">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-semibold">Flow Payload</h4>
                <Badge variant="secondary" className="text-[10px]">{nodes.length} nodes · {edges.length} edges</Badge>
              </div>
            </div>
            <pre className="p-4 text-xs font-mono text-muted-foreground whitespace-pre-wrap">
              {JSON.stringify(flowPayload, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* ─── Right: Config Panel ─── */}
      {selectedNode && (
        <FlowConfigPanel
          node={selectedNode as FlowNode}
          updateNodeData={updateNodeData}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}
