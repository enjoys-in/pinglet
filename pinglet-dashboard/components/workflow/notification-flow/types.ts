import type { Node, Edge } from "reactflow"

// ─── Node Data Types ────────────────────────────────────────────────────────────

export interface EventTriggerData {
  label: string
  eventName: string       // e.g. "user:signup", "user:cart", "order:placed"
  description?: string
  payload?: string         // JSON string of sample payload
}

export interface ConditionData {
  label: string
  field: string            // e.g. "payload.amount"
  operator: "==" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "not_contains" | "exists" | "not_exists"
  value: string
  trueLabel?: string
  falseLabel?: string
}

export interface DelayData {
  label: string
  duration: number
  unit: "seconds" | "minutes" | "hours" | "days"
}

export interface NotificationData {
  label: string
  notificationType: "0" | "1" | "2" | "-1"   // matches Pinglet SDK types
  title: string
  description?: string
  // Type 0 / 2 fields
  icon?: string
  logo?: string
  url?: string
  variant?: string
  // Type -1 fields
  pushIcon?: string
  pushImage?: string
  pushUrl?: string
  requireInteraction?: boolean
  // Type 1 fields
  templateId?: string
  // Buttons
  buttons?: Array<{
    text: string
    action: string
    event?: string
  }>
}

export interface WebhookData {
  label: string
  url: string
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  headers?: string        // JSON string
  body?: string            // JSON string
  retryCount?: number
}

export interface ABSplitData {
  label: string
  splitA: number           // percentage 0-100
  splitB: number           // percentage 0-100
  splitALabel?: string
  splitBLabel?: string
}

export interface FilterData {
  label: string
  field: string
  operator: "==" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "not_contains" | "exists" | "not_exists" | "in" | "not_in"
  value: string
  attribute?: string       // user attribute to filter on
}

export interface ScheduleData {
  label: string
  days: string[]           // e.g. ["mon","tue","wed"]
  startHour: number        // 0-23
  endHour: number          // 0-23
  timezone: string         // e.g. "UTC", "America/New_York"
}

export interface RateLimitData {
  label: string
  maxCount: number
  window: number
  windowUnit: "seconds" | "minutes" | "hours" | "days"
  key?: string             // grouping key like "userId"
}

export interface PresenceCheckData {
  label: string
  checkType: "online" | "offline"
  fallbackAction?: "queue" | "skip" | "email"
}

export interface TransformData {
  label: string
  mappings: string         // JSON string of key→expression mappings
}

export interface EmailData {
  label: string
  to: string               // e.g. "{{email}}" or static
  subject: string
  body: string             // HTML or plain text
  templateId?: string
  replyTo?: string
}

export interface MergeData {
  label: string
  mergeMode: "all" | "any"  // wait for all inputs or any
}

export interface DivergeData {
  label: string
  outputCount: number       // 2-5 parallel outputs
  outputLabels?: string[]   // optional labels for each output
}

export interface NoteData {
  label: string
  content: string
  color?: string
}

export type FlowNodeData =
  | EventTriggerData
  | ConditionData
  | DelayData
  | NotificationData
  | WebhookData
  | ABSplitData
  | FilterData
  | ScheduleData
  | RateLimitData
  | PresenceCheckData
  | TransformData
  | EmailData
  | MergeData
  | DivergeData
  | NoteData

export type FlowNode = Node<FlowNodeData>

// ─── Preset Events ──────────────────────────────────────────────────────────────

export interface EventPreset {
  name: string
  eventName: string
  category: string
  samplePayload: Record<string, unknown>
}

export const EVENT_PRESETS: EventPreset[] = [
  // Platform Events
  { name: "Notification Sent", eventName: "notification.sent", category: "Platform", samplePayload: { notificationId: "{{notificationId}}", projectId: "{{projectId}}", userId: "{{userId}}" } },
  { name: "Notification Delivered", eventName: "notification.delivered", category: "Platform", samplePayload: { notificationId: "{{notificationId}}", projectId: "{{projectId}}", userId: "{{userId}}" } },
  { name: "Notification Clicked", eventName: "notification.clicked", category: "Platform", samplePayload: { notificationId: "{{notificationId}}", projectId: "{{projectId}}", userId: "{{userId}}", action: "{{action}}" } },
  { name: "Notification Dismissed", eventName: "notification.dismissed", category: "Platform", samplePayload: { notificationId: "{{notificationId}}", projectId: "{{projectId}}", userId: "{{userId}}" } },
  { name: "Notification Failed", eventName: "notification.failed", category: "Platform", samplePayload: { notificationId: "{{notificationId}}", projectId: "{{projectId}}", reason: "{{reason}}" } },
  { name: "Notification Dropped", eventName: "notification.dropped", category: "Platform", samplePayload: { notificationId: "{{notificationId}}", projectId: "{{projectId}}", reason: "{{reason}}" } },
  { name: "Notification Closed", eventName: "notification.closed", category: "Platform", samplePayload: { notificationId: "{{notificationId}}", projectId: "{{projectId}}", userId: "{{userId}}" } },
  { name: "Notification Queued", eventName: "notification.queued", category: "Platform", samplePayload: { notificationId: "{{notificationId}}", projectId: "{{projectId}}", queuePosition: 0 } },
  { name: "User Subscribed", eventName: "user.subscribed", category: "Platform", samplePayload: { userId: "{{userId}}", projectId: "{{projectId}}", endpoint: "{{endpoint}}" } },
  { name: "User Unsubscribed", eventName: "user.unsubscribed", category: "Platform", samplePayload: { userId: "{{userId}}", projectId: "{{projectId}}" } },
  { name: "Project Created", eventName: "project.created", category: "Platform", samplePayload: { projectId: "{{projectId}}", name: "{{name}}" } },
  { name: "Domain Verified", eventName: "domain.verified", category: "Platform", samplePayload: { domain: "{{domain}}", projectId: "{{projectId}}" } },
  // User/Business Events
  { name: "User Signup", eventName: "user:signup", category: "User", samplePayload: { userId: "{{userId}}", email: "{{email}}", name: "{{name}}" } },
  { name: "User Login", eventName: "user:login", category: "User", samplePayload: { userId: "{{userId}}", ip: "{{ip}}", device: "{{device}}" } },
  { name: "Profile Updated", eventName: "user:profile_updated", category: "User", samplePayload: { userId: "{{userId}}", fields: ["name", "avatar"] } },
  { name: "Add to Cart", eventName: "user:cart", category: "E-Commerce", samplePayload: { userId: "{{userId}}", productId: "{{productId}}", quantity: 1, price: "{{price}}" } },
  { name: "Order Placed", eventName: "order:placed", category: "E-Commerce", samplePayload: { orderId: "{{orderId}}", userId: "{{userId}}", total: "{{total}}", items: [] } },
  { name: "Payment Success", eventName: "payment:success", category: "E-Commerce", samplePayload: { paymentId: "{{paymentId}}", orderId: "{{orderId}}", amount: "{{amount}}" } },
  { name: "Payment Failed", eventName: "payment:failed", category: "E-Commerce", samplePayload: { paymentId: "{{paymentId}}", orderId: "{{orderId}}", reason: "{{reason}}" } },
  { name: "Subscription Created", eventName: "subscription:created", category: "Billing", samplePayload: { userId: "{{userId}}", plan: "{{plan}}", interval: "monthly" } },
  { name: "Subscription Cancelled", eventName: "subscription:cancelled", category: "Billing", samplePayload: { userId: "{{userId}}", plan: "{{plan}}", reason: "{{reason}}" } },
  { name: "Feature Used", eventName: "feature:used", category: "Product", samplePayload: { userId: "{{userId}}", feature: "{{feature}}", count: 1 } },
  { name: "Feedback Submitted", eventName: "feedback:submitted", category: "Product", samplePayload: { userId: "{{userId}}", rating: 5, message: "{{message}}" } },
  // Custom
  { name: "Custom Event", eventName: "", category: "Custom", samplePayload: {} },
]

// ─── Flow Export ─────────────────────────────────────────────────────────────────

export interface FlowExport {
  id: string
  name: string
  description?: string
  projectId: string
  status: "draft" | "active" | "paused"
  createdAt: string
  updatedAt: string
  nodes: Array<{
    id: string
    type: "event_trigger" | "condition" | "delay" | "notification" | "webhook" | "ab_split" | "filter" | "schedule" | "rate_limit" | "presence_check" | "transform" | "email" | "merge" | "diverge" | "note"
    data: FlowNodeData
    position: { x: number; y: number }
  }>
  edges: Array<{
    id: string
    source: string
    target: string
    sourceHandle?: string | null
    label?: string
  }>
}

// ─── Flow ID generator (used before API call) ───────────────────────────────────

export function generateFlowId(): string {
  return `flow_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
