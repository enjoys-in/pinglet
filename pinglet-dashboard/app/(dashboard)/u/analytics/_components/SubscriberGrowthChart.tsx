"use client"

import { useState } from "react"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

const chartConfig = {
  subscribers: {
    label: "Subscribers Gained",
    color: "hsl(345, 70%, 55%)"
  },
}

const generateMockData = (timeFilter: string) => {
  const now = new Date()
  const data = []

  let intervals: number
  let dateFormat: (date: Date) => string

  switch (timeFilter) {
    case "weekly":
      intervals = 12
      dateFormat = (date) => `Week ${Math.ceil((now.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1}`
      break
    case "monthly":
      intervals = 12
      dateFormat = (date) => date.toLocaleDateString([], { month: 'short', year: 'numeric' })
      break
    case "3months":
      intervals = 12
      dateFormat = (date) => date.toLocaleDateString([], { month: 'short', day: 'numeric' })
      break
    case "6months":
      intervals = 24
      dateFormat = (date) => date.toLocaleDateString([], { month: 'short', day: 'numeric' })
      break
    case "yearly":
      intervals = 12
      dateFormat = (date) => date.toLocaleDateString([], { month: 'short', year: 'numeric' })
      break
    default:
      intervals = 12
      dateFormat = (date) => date.toLocaleDateString([], { month: 'short', year: 'numeric' })
  }

  for (let i = intervals - 1; i >= 0; i--) {
    const date = new Date(now)

    switch (timeFilter) {
      case "weekly":
        date.setDate(date.getDate() - i * 7)
        break
      case "monthly":
        date.setMonth(date.getMonth() - i)
        break
      case "3months":
        date.setDate(date.getDate() - i * 7)
        break
      case "6months":
        date.setDate(date.getDate() - i * 7)
        break
      case "yearly":
        date.setMonth(date.getMonth() - i)
        break
    }

    const baseGrowth = timeFilter === "yearly" ? 1000 : timeFilter === "monthly" ? 500 : 200
    const subscribers = Math.floor(Math.random() * baseGrowth) + baseGrowth * 0.5

    data.push({
      time: dateFormat(date),
      subscribers,
    })
  }

  return data
}

export function SubscriberGrowthChart() {
  const [timeFilter, setTimeFilter] = useState("monthly")
  const data = generateMockData(timeFilter)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Subscriber Growth</CardTitle>
          <CardDescription>
            Track subscriber acquisition over time
          </CardDescription>
        </div>
        <Select value={timeFilter} onValueChange={setTimeFilter}>
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
              dataKey="subscribers"
              type="natural"
              fill="transparent"        // No fill
              stroke="var(--color-subscribers)" // Line color
              strokeWidth={2}           // Optional: make the line bolder
              stackId="a"
              dot={true}               // Optional: hide data point dots
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
