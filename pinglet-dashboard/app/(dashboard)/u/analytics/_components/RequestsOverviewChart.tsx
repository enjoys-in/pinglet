"use client"

import { useState, useCallback } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { API } from "@/lib/api/handler"
import { fillTimeBuckets } from "@/lib/helper"
import { Loader2 } from "lucide-react"

const chartConfig = {
  requests: {
    label: "Requests",
    color: "hsl(262, 83%, 58%)"
  },
  sent: {
    label: "Sent",
    color: "hsl(152, 69%, 47%)"
  },
  failed: {
    label: "Failed",
    color: "hsl(0, 84%, 60%)"
  },
  closed: {
    label: "Closed",
    color: "hsl(217, 91%, 60%)"
  },
  dropped: {
    label: "Dropped",
    color: "hsl(215, 20%, 65%)"
  },
}

interface Props {
  initialData: Array<{ time: string; requests: number; sent: number; failed: number; closed: number; dropped: number }> | null
}

export function RequestsOverviewChart({ initialData }: Props) {
  const [timeFilter, setTimeFilter] = useState("daily")
  const [rawData, setRawData] = useState(initialData ?? [])
  const [loading, setLoading] = useState(false)

  const data = fillTimeBuckets(rawData, timeFilter)

  const handleFilterChange = useCallback(async (filter: string) => {
    setTimeFilter(filter)
    setLoading(true)
    try {
      const res = await API.getRequestsOverview(filter)
      setRawData(res.data?.result ?? [])
    } catch {
      setRawData([])
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Requests Overview</CardTitle>
          <CardDescription>Track request metrics over time</CardDescription>
        </div>
        <Select value={timeFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5min">Last 5 Minutes</SelectItem>
            <SelectItem value="1hour">Last 1 Hour</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[400px] flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : data.length === 0 ? (
          <div className="h-[400px] flex items-center justify-center text-sm text-muted-foreground">No data available</div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[400px] w-full">
            <AreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Area dataKey="requests" type="natural" fill="transparent" strokeWidth={2} dot={true} stroke="var(--color-requests)" stackId="a" />
              <Area dataKey="sent" type="natural" fill="var(--color-sent)" fillOpacity={0.4} stroke="var(--color-sent)" stackId="b" />
              <Area dataKey="failed" type="natural" fill="var(--color-failed)" fillOpacity={0.4} stroke="var(--color-failed)" stackId="c" />
              <Area dataKey="closed" type="natural" fill="var(--color-closed)" fillOpacity={0.4} stroke="var(--color-closed)" stackId="d" />
              <Area dataKey="dropped" type="natural" fill="transparent" stroke="var(--color-dropped)" dot={true} strokeWidth={2} stackId="e" />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
