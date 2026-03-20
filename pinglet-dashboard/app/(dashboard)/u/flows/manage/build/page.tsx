"use client"

import { useSearchParams } from "next/navigation"
import NotificationFlowBuilder from "@/components/workflow/notification-flow"

export default function FlowBuildPage() {
  const searchParams = useSearchParams()
  const flowId = searchParams.get("id") || undefined
  const projectId = searchParams.get("projectId") || undefined

  return <NotificationFlowBuilder flowId={flowId} projectId={projectId} />
}