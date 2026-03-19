"use client"

import { useState, useCallback, useMemo } from "react"
import { AreaChart, Area, XAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { API } from "@/lib/api/handler"
import { fillTimeBuckets } from "@/lib/helper"
import { Loader2 } from "lucide-react"

const defaultColors = [
  "hsl(262, 83%, 58%)",
  "hsl(172, 66%, 50%)",
  "hsl(25, 95%, 53%)",
  "hsl(217, 91%, 60%)",
]

interface ProjectMeta {
  key: string
  label: string
}

interface Props {
  initialData: {
    projects?: ProjectMeta[]
    data?: Array<Record<string, any>>
  } | null
}

export function ProjectSubscriberTrendsChart({ initialData }: Props) {
  const [timeFilter, setTimeFilter] = useState("daily")
  const [rawData, setRawData] = useState(initialData)
  const [loading, setLoading] = useState(false)

  const projects = rawData?.projects ?? []
  const data = fillTimeBuckets(rawData?.data ?? [], timeFilter)

  const chartConfig = useMemo(() => {
    const cfg: Record<string, { label: string; color: string }> = {}
    projects.forEach((p, i) => {
      cfg[p.key] = { label: p.label, color: defaultColors[i % defaultColors.length] }
    })
    return cfg
  }, [projects])

  const handleFilterChange = useCallback(async (filter: string) => {
    setTimeFilter(filter)
    setLoading(true)
    try {
      const res = await API.getProjectSubscriberTrends(filter)
      setRawData(res.data?.result ?? null)
    } catch {
      setRawData(null)
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Project Subscriber Trends</CardTitle>
          <CardDescription>Compare subscriber trends across projects</CardDescription>
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
              {projects.map((p, i) => (
                <Area
                  key={p.key}
                  dataKey={p.key}
                  type="natural"
                  fill={`var(--color-${p.key})`}
                  fillOpacity={0.4}
                  stroke={`var(--color-${p.key})`}
                  stackId={String.fromCharCode(97 + i)}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
