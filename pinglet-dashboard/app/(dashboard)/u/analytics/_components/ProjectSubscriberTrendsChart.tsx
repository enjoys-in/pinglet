"use client"

import { useState } from "react"
import { AreaChart, Area, XAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"

const chartConfig = {
  project1: {
    label: "Project Alpha",
    color: "hsl(95, 70%, 45%)"
  },
  project2: {
    label: "Project Beta",
    color: "hsl(40, 80%, 50%)" 
  },
  project3: {
    label: "Project Gamma",
    color: "hsl(300, 70%, 50%)" 
  },
  project4: {
    label: "Project Delta",
   color: "hsl(205, 80%, 60%)" 
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

    // Generate growth/loss data for each project
    const project1 = Math.floor(Math.random() * 100) + 50 + (Math.random() > 0.3 ? 1 : -1) * Math.floor(Math.random() * 20)
    const project2 = Math.floor(Math.random() * 80) + 40 + (Math.random() > 0.4 ? 1 : -1) * Math.floor(Math.random() * 15)
    const project3 = Math.floor(Math.random() * 120) + 60 + (Math.random() > 0.2 ? 1 : -1) * Math.floor(Math.random() * 25)
    const project4 = Math.floor(Math.random() * 90) + 45 + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 18)

    data.push({
      time: dateFormat(date),
      project1,
      project2,
      project3,
      project4,
    })
  }

  return data
}

export function ProjectSubscriberTrendsChart() {
  const [timeFilter, setTimeFilter] = useState("daily")
  const data = generateMockData(timeFilter)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Project Subscriber Trends</CardTitle>
          <CardDescription>
            Compare subscriber trends across up to 4 projects
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
              dataKey="project1"
              type="natural"
              fill="var(--color-project1)"
              fillOpacity={0.4}
              stroke="var(--color-project1)"
              stackId="a"
            />
            <Area
              dataKey="project2"
              type="natural"
              fill="var(--color-project2)"
              fillOpacity={0.4}
              stroke="var(--color-project2)"
              stackId="b"
            />
            <Area
              dataKey="project3"
              type="natural"
              fill="var(--color-project3)"
              fillOpacity={0.4}
              stroke="var(--color-project3)"
              stackId="c"
            />
            <Area
              dataKey="project4"
              type="natural"
              fill="var(--color-project4)"
              fillOpacity={0.4}
              stroke="var(--color-project4)"
              stackId="d"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
