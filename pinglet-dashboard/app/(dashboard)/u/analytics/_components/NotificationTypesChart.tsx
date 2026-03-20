"use client"

import { useState, useCallback } from "react"
import { Area, AreaChart, XAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { API } from "@/lib/api/handler"
import { fillTimeBuckets } from "@/lib/helper"
import { Loader2 } from "lucide-react"

const chartConfig = {
  type0: {
    label: "Default",
    color: "hsl(262, 83%, 58%)"
  },
  typeNeg1: {
    label: "Push Notification",
    color: "hsl(186, 72%, 48%)"
  },
  type1: {
    label: "Custom Notification",
    color: "hsl(330, 81%, 60%)"
  },
}

interface Props {
  initialData: Array<{ time: string; type0: number; typeNeg1: number; type1: number }> | null
}

export function NotificationTypesChart({ initialData }: Props) {
  const [timeFilter, setTimeFilter] = useState("daily")
  const [rawData, setRawData] = useState(initialData ?? [])
  const [loading, setLoading] = useState(false)

  const data = fillTimeBuckets(rawData, timeFilter)

  const handleFilterChange = useCallback(async (filter: string) => {
    setTimeFilter(filter)
    setLoading(true)
    try {
      const res = await API.getNotificationTypes(filter)
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
          <CardTitle>Notification Types</CardTitle>
          <CardDescription>Distribution of notification types over time</CardDescription>
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
              <Area dataKey="type0" type="monotone" fill="var(--color-type0)" fillOpacity={0.4} stroke="var(--color-type0)" stackId="a" />
              <Area dataKey="typeNeg1" type="monotone" fill="var(--color-typeNeg1)" fillOpacity={0.4} stroke="var(--color-typeNeg1)" stackId="b" />
              <Area dataKey="type1" type="monotone" fill="var(--color-type1)" fillOpacity={0.4} stroke="var(--color-type1)" stackId="c" />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
