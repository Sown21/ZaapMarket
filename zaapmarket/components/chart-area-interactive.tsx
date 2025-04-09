"use client"

import * as React from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIsMobile } from "@/hooks/use-mobile"

// Type pour les données du graphique
export interface ChartData {
  date: string
  investment: number
  profit: number
}

// Interface des props du composant
interface ChartAreaInteractiveProps {
  data: ChartData[]
}

// Configuration du graphique
interface ChartConfigItem {
  label: string
  color: string
}

interface ChartConfig {
  investment: ChartConfigItem
  profit: ChartConfigItem
}

// Fonction locale pour formatter les nombres (K, M)
function formatChartNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`
  }
  return value.toString()
}

const chartConfig: ChartConfig = {
  investment: {
    label: "Investissement Total",
    color: "#1e40af", // bleu foncé
  },
  profit: {
    label: "Profit Total",
    color: "#60a5fa", // bleu clair
  },
}

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [filter, setFilter] = React.useState<"90d" | "30d" | "7d">("90d")
  const [chartData, setChartData] = React.useState<ChartData[]>([])

  // Définir le filtre par défaut en fonction de l'appareil
  React.useEffect(() => {
    if (isMobile) {
      setFilter("7d")
    }
  }, [isMobile])

  // Filtrer les données en fonction de la période sélectionnée
  React.useEffect(() => {
    if (!data || !data.length) {
      setChartData([])
      return
    }

    const today = new Date()
    let filteredData: ChartData[] = []

    switch (filter) {
      case "7d":
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(today.getDate() - 7)
        filteredData = data.filter(item => {
          const itemDate = new Date(item.date)
          return itemDate >= sevenDaysAgo
        })
        break
      case "30d":
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(today.getDate() - 30)
        filteredData = data.filter(item => {
          const itemDate = new Date(item.date)
          return itemDate >= thirtyDaysAgo
        })
        break
      default:
        filteredData = data
    }

    setChartData(filteredData)
  }, [data, filter])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Évolution financière</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={filter === "7d" ? "default" : "outline"}
            onClick={() => setFilter("7d")}
          >
            7D
          </Button>
          <Button
            size="sm"
            variant={filter === "30d" ? "default" : "outline"}
            onClick={() => setFilter("30d")}
          >
            30D
          </Button>
          <Button
            size="sm"
            variant={filter === "90d" ? "default" : "outline"}
            onClick={() => setFilter("90d")}
          >
            90D
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-[4/3] h-[375px] w-full px-4 pt-6 sm:px-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.investment.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartConfig.investment.color} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartConfig.profit.color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={chartConfig.profit.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                type="category"
                tickFormatter={(value: string) => {
                  const date = new Date(value)
                  return format(date, "dd MMM", { locale: fr })
                }}
                tickLine={false}
                axisLine={false}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis
                tickFormatter={(value: number) => formatChartNumber(value)}
                tickLine={false}
                axisLine={false}
                padding={{ top: 20, bottom: 20 }}
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  const formattedValue = formatChartNumber(value)
                  const label = name === "investment" 
                    ? chartConfig.investment.label
                    : chartConfig.profit.label
                  return [formattedValue, label]
                }}
                labelFormatter={(label: string) => {
                  const date = new Date(label)
                  return format(date, "d MMMM yyyy", { locale: fr })
                }}
              />
              <Legend 
                payload={[
                  { value: chartConfig.investment.label, type: 'line', color: chartConfig.investment.color },
                  { value: chartConfig.profit.label, type: 'line', color: chartConfig.profit.color }
                ]}
              />
              <Area
                type="monotone"
                dataKey="investment"
                stroke={chartConfig.investment.color}
                fillOpacity={1}
                fill="url(#colorInvestment)"
              />
              <Area
                type="monotone"
                dataKey="profit"
                stroke={chartConfig.profit.color}
                fillOpacity={1}
                fill="url(#colorProfit)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
