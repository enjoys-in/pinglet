"use client"

import { useState, useCallback } from "react"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { API } from "@/lib/api/handler"
import { fillTimeBuckets } from "@/lib/helper"
import { Loader2 } from "lucide-react"

const chartConfig = {
  subscribers: {
    label: "Subscribers Gained",
    color: "hsl(262, 83%, 58%)"
  },
}

interface Props {
  initialData: Array<{ time: string; subscribers: number }> | null
}

export function SubscriberGrowthChart({ initialData }: Props) {
  const [timeFilter, setTimeFilter] = useState("monthly")
  const [rawData, setRawData] = useState(initialData ?? [])
  const [loading, setLoading] = useState(false)

  const data = fillTimeBuckets(rawData, timeFilter)

  const handleFilterChange = useCallback(async (filter: string) => {
    setTimeFilter(filter)
    setLoading(true)
    try {
      const res = await API.getSubscriberGrowth(filter)
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
          <CardTitle>Subscriber Growth</CardTitle>
          <CardDescription>Track subscriber acquisition over time</CardDescription>
        </div>
        <Select value={timeFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="yearly">Yearly</SelectItem>
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
              <Area dataKey="subscribers" type="natural" fill="transparent" stroke="var(--color-subscribers)" strokeWidth={2} stackId="a" dot={true} />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
