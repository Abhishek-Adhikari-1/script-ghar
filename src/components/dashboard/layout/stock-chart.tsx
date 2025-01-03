"use client";
import { LuEllipsis, LuTrendingUp } from "react-icons/lu";
import {
  Area,
  AreaChart,
  CartesianGrid,
  // Line,
  // LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A multiple line chart";

const chartData = [
  { month: "January", share1: 186, share2: 80 },
  { month: "February", share1: 305, share2: 200 },
  { month: "March", share1: 237, share2: 120 },
  { month: "April", share1: 73, share2: 190 },
  { month: "May", share1: 209, share2: 130 },
  { month: "June", share1: 214, share2: 140 },
];

const chartConfig = {
  share1: {
    label: "Share1",
    color: "hsl(var(--chart-1))",
  },
  share2: {
    label: "Share2",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

const StockChart = () => {
  return (
    <div className="bg-card rounded-lg w-full">
      <CardHeader>
        <CardTitle className="flex w-full flex-row justify-between items-center">
          <span>Stock Chart</span>
          <LuEllipsis className="cursor-pointer text-card-foreground" />
        </CardTitle>
        <CardDescription>June - January 2025</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -30,
            }}
          >
            <CartesianGrid
              strokeDasharray="5 5"
              vertical={false}
              stroke="hsl(var(--border))"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <YAxis />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <defs>
              <linearGradient id="fillShare2" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-share2)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-share2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillShare1" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-share1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-share1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="share2"
              type="natural"
              fill="url(#fillShare2)"
              fillOpacity={0.4}
              stroke="var(--color-share2)"
              stackId="a"
            />
            <Area
              dataKey="share1"
              type="natural"
              fill="url(#fillShare1)"
              fillOpacity={0.4}
              stroke="var(--color-share1)"
              stackId="a"
            />

            {/* <Line
              dataKey="share1"
              type="bump"
              stroke="var(--color-share1)"
              strokeWidth={2}
              dot={true}
            />
            <Line
              dataKey="share2"
              type="monotone"
              stroke="var(--color-share2)"
              strokeWidth={2}
              dot={true}
            /> */}
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month{" "}
              <LuTrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </div>
  );
};

export default StockChart;
