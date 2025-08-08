"use client"

import { useState } from "react"
import { Area, AreaChart, XAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

const chartConfig = {
  clickRate: {
    label: "Click Rate (%)",
    color: "hsl(220, 80%, 55%)", // 🔵 Blue - interaction
  },
  dropRate: {
    label: "Drop Rate (%)",
    color: "hsl(35, 85%, 55%)", // 🟠 Orange - warning
  },
  closeRate: {
    label: "Close Rate (%)",
    color: "hsl(260, 60%, 55%)", // 🟣 Purple - neutral/processing
  },

}

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

    const clickRate = Math.random() * 15 + 5 // 5-20%
    const dropRate = Math.random() * 8 + 2 // 2-10%
    const closeRate = Math.random() * 5 + 1 // 1-6%

    data.push({
      time: dateFormat(date),
      clickRate: Number(clickRate.toFixed(2)),
      dropRate: Number(dropRate.toFixed(2)),
      closeRate: Number(closeRate.toFixed(2)),
    })
  }

  return data
}

export function EngagementRatesChart() {
  const [timeFilter, setTimeFilter] = useState("daily")
  const data = generateMockData(timeFilter)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Engagement Rates</CardTitle>
          <CardDescription>
            Track user engagement metrics as percentages
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="clickRate"
              type="natural"
              fill="var(--color-clickRate)"
              fillOpacity={0.4}
              stroke="var(--color-clickRate)"
              stackId="a"
            />
            <Area
              dataKey="dropRate"
              type="natural"
              fill="var(--color-dropRate)"
              fillOpacity={0.4}
              stroke="var(--color-dropRate)"
              stackId="b"
            />
            <Area
              dataKey="closeRate"
              type="natural"
              fill="var(--color-closeRate)"
              fillOpacity={0.4}
              stroke="var(--color-closeRate)"
              stackId="c"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
