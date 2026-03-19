"use client"

import { useState, useCallback } from "react"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { API } from "@/lib/api/handler"
import { Loader2 } from "lucide-react"

const chartConfig = {
  sent: {
    label: "Sent",
    color: "hsl(152, 69%, 47%)",
  },
  failed: {
    label: "Failed",
    color: "hsl(0, 84%, 60%)",
  },
}

interface Props {
  initialData: Array<{ time: string; sent: number; failed: number }> | null
}

export function DeliveryOverviewChart({ initialData }: Props) {
  const [timeFilter, setTimeFilter] = useState("daily")
  const [data, setData] = useState(initialData ?? [])
  const [loading, setLoading] = useState(false)

  const handleFilterChange = useCallback(async (filter: string) => {
    setTimeFilter(filter)
    setLoading(true)
    try {
      const res = await API.getDeliveryOverview(filter)
      setData(res.data?.result ?? [])
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Delivery Overview</CardTitle>
          <CardDescription>Monitor delivery success and failure rates</CardDescription>
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
              <YAxis />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              <Area dataKey="sent" type="natural" fill="var(--color-sent)" fillOpacity={0.4} stroke="var(--color-sent)" stackId="a" />
              <Area dataKey="failed" type="natural" fill="var(--color-failed)" fillOpacity={0.4} stroke="var(--color-failed)" stackId="b" />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
