"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ManagePage() {
  const router = useRouter()
  useEffect(() => { router.replace("/u/flows") }, [router])
  return null
}
