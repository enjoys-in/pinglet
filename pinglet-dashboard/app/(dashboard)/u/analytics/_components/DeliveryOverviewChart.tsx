"use client"

import { useState } from "react"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

const chartConfig = {
  sent: {
    label: "Sent",
    color: "hsl(35, 85%, 55%)", // ✅ Green - success
  },
  failed: {
    label: "Failed",
   color: "hsl(260, 60%, 55%)", // ❌ Red - failure
  },
 
};


const generateMockData = (timeFilter: string) => {
  const now = new Date()
  const data = []
  
  let intervals: number
  let dateFormat: (date: Date) => string
  
  switch (timeFilter) {
    case "5min":
      intervals = 10
      dateFormat = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      break
    case "1hour":
      intervals = 12
      dateFormat = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      break
    case "daily":
      intervals = 24
      dateFormat = (date) => date.toLocaleTimeString([], { hour: '2-digit' })
      break
    case "weekly":
      intervals = 7
      dateFormat = (date) => date.toLocaleDateString([], { weekday: 'short' })
      break
    case "monthly":
      intervals = 30
      dateFormat = (date) => date.toLocaleDateString([], { month: 'short', day: 'numeric' })
      break
    default:
      intervals = 24
      dateFormat = (date) => date.toLocaleTimeString([], { hour: '2-digit' })
  }
  
  for (let i = intervals - 1; i >= 0; i--) {
    const date = new Date(now)
    
    switch (timeFilter) {
      case "5min":
        date.setMinutes(date.getMinutes() - i * 0.5)
        break
      case "1hour":
        date.setMinutes(date.getMinutes() - i * 5)
        break
      case "daily":
        date.setHours(date.getHours() - i)
        break
      case "weekly":
        date.setDate(date.getDate() - i)
        break
      case "monthly":
        date.setDate(date.getDate() - i)
        break
    }
    
    const sent = Math.floor(Math.random() * 800) + 200
    const failed = Math.floor(Math.random() * 100) + 10
    
    data.push({
      time: dateFormat(date),
      sent,
      failed,
    })
  }
  
  return data
}

export function DeliveryOverviewChart() {
  const [timeFilter, setTimeFilter] = useState("daily")
  const data = generateMockData(timeFilter)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Delivery Overview</CardTitle>
          <CardDescription>
            Monitor delivery success and failure rates
          </CardDescription>
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
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
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="sent"
              type="natural"
              fill="var(--color-sent)"
              fillOpacity={0.4}
              stroke="var(--color-sent)"
              stackId="a"
            />
            <Area
              dataKey="failed"
              type="natural"
              fill="var(--color-failed)"
              fillOpacity={0.4}
              stroke="var(--color-failed)"
              stackId="b"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
