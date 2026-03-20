"use client"

import { useSearchParams } from "next/navigation"
import NotificationFlowBuilder from "@/components/workflow/notification-flow"

export default function FlowBuildPage() {
  const searchParams = useSearchParams()
  const flowId = searchParams.get("id") || undefined

  return <NotificationFlowBuilder flowId={flowId} />
}