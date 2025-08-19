"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TooltipInfo } from "@/components/ui/tooltip-info"
import { PeriodFilter } from "@/components/ui/period-filter"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import {
  ArrowUpRight,
  Download,
  FileUp,
  BarChart3,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Lightbulb,
  Rocket,
  Filter,
  Calendar,
  Plus,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Users,
  DollarSign,
  Percent,
  Clock,
  Info,
  FileText,
} from "lucide-react"
import {
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts"
import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Dados de exemplo para os gráficos
const financialData = [
  { month: "Jan", receita: 45000, despesa: 32000, saldo: 13000 },
  { month: "Fev", receita: 52000, despesa: 34000, saldo: 18000 },
  { month: "Mar", receita: 49000, despesa: 36000, saldo: 13000 },
  { month: "Abr", receita: 63000, despesa: 40000, saldo: 23000 },
  { month: "Mai", receita: 58000, despesa: 45000, saldo: 13000 },
  { month: "Jun", receita: 64000, despesa: 42000, saldo: 22000 },
]

// Dados para o gráfico de pizza
const despesasPorCategoria = [
  { name: "Pessoal", value: 18000 },
  { name: "Marketing", value: 12000 },
  { name: "Operacional", value: 8000 },
  { name: "Tecnologia", value: 4000 },
]

const COLORS = ["#ec0000", "#737373", "#4ade80", "#60a5fa", "#facc15"]

// Componente para o setor ativo no gráfico de pizza
const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 8}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <text x={cx} y={cy - 10} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
        {payload.name}
      </text>
      <text x={cx} y={cy + 10} dy={8} textAnchor="middle" fill={fill} className="text-sm font-bold">
        {`R$ ${value.toLocaleString("pt-BR")}`}
      </text>
      <text x={cx} y={cy + 30} dy={8} textAnchor="middle" fill={fill} className="text-xs">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  )
}

// Componente personalizado para o tooltip dos gráficos
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-2 mb-1">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-muted-foreground">{entry.name}: </span>
            <span className="font-medium">{formatter ? formatter(entry.value) : entry.value}</span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Histórico de diagnósticos
const diagnosticHistory = [
  {
    date: "Abril 2025",
    stage: "Expansão",
    score: 68,
    revenue: 64000,
    expenses: 42000,
    metrics: {
      marginProfit: 34.4,
      roi: 22.8,
      liquidity: 1.8,
      growthRate: 12.0,
    },
  },
  {
    date: "Março 2025",
    stage: "Expansão",
    score: 65,
    revenue: 58000,
    expenses: 40000,
    metrics: {
      marginProfit: 31.0,
      roi: 20.5,
      liquidity: 1.7,
      growthRate: 10.5,
    },
  },
  {
    date: "Fevereiro 2025",
    stage: "Início",
    score: 48,
    revenue: 52000,
    expenses: 38000,
    metrics: {
      marginProfit: 26.9,
      roi: 18.2,
      liquidity: 1.5,
      growthRate: 8.3,
    },
  },
]

// Componente para o card de estágio da empresa
function EstagioEmpresaCard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <SkeletonCard className="overflow-hidden" lines={4} />
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="bg-gradient-to-r from-santander-600 to-santander-800 text-white p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Estágio da Empresa</CardTitle>
          <TooltipInfo
            content="Indica a fase atual do ciclo de vida da sua empresa, baseada em indicadores financeiros e de crescimento."
            className="text-white"
          />
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-santander-100 p-3">
            <Rocket className="h-8 w-8 text-santander-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Expansão</h3>
            <p className="text-sm text-muted-foreground">
              Fase de crescimento sustentável com aumento de receita e base de clientes
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>Início</span>
            <span>Expansão</span>
            <span>Maturidade</span>
            <span>Renovação</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5 mt-2">
            <div className="bg-santander-600 h-2.5 rounded-full" style={{ width: "42%" }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para o card de KPI
function KpiCard({ title, value, change, icon, borderColor, changeColor, hasNotification = false }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <SkeletonCard className={`border-l-4 ${borderColor}`} lines={2} />
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Card className={`border-l-4 ${borderColor} hover:shadow-md transition-all relative group`}>
        {hasNotification && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge className="bg-santander-600">Novo</Badge>
          </div>
        )}
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            {title}
            <TooltipInfo content={`Total de ${title.toLowerCase()} no período atual`} />
          </CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className={`text-xs ${changeColor}`}>{change}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Componente para o card de ação recomendada
function AcaoRecomendadaCard({ titulo, descricao, prioridade, icon, iconBgColor, iconColor }) {
  const getPriorityBadge = () => {
    switch (prioridade) {
      case "alta":
        return <Badge className="bg-red-500 hover:bg-red-600">Alta Prioridade</Badge>
      case "média":
        return <Badge className="bg-amber-500 hover:bg-amber-600">Média Prioridade</Badge>
      case "baixa":
        return <Badge className="bg-green-500 hover:bg-green-600">Baixa Prioridade</Badge>
      default:
        return <Badge className="bg-gray-500">Prioridade Indefinida</Badge>
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-all"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={`rounded-full p-3 ${iconBgColor}`}>
            {icon && <div className={`h-5 w-5 ${iconColor}`}>{icon}</div>}
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{titulo}</h3>
              {getPriorityBadge()}
            </div>
            <p className="text-sm text-muted-foreground">{descricao}</p>
          </div>
        </div>
      </div>
      <div className="border-t p-3 flex justify-end bg-muted/30">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-santander-600 hover:text-santander-700 hover:bg-santander-50"
        >
          Ver detalhes
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}

// Componente para o card de estatísticas
function StatCard({ title, value, icon, description, trend, trendValue }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-full p-2 ${icon.bgColor}`}>
          {icon.component && <icon.component className={`h-4 w-4 ${icon.color}`} />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center gap-2 mt-1">
          <div className={`flex items-center gap-1 text-xs ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
            {trend === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{trendValue}</span>
          </div>
          <span className="text-xs text-muted-foreground">{description}</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para o histórico de diagnósticos
function DiagnosticHistoryCard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Diagnósticos</CardTitle>
          <CardDescription>Evolução dos diagnósticos financeiros</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <LoadingIndicator size="lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Histórico de Diagnósticos</CardTitle>
          <CardDescription>Evolução dos diagnósticos financeiros</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="mr-2 h-4 w-4" />
          Filtrar Período
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="grid grid-cols-5 border-b bg-muted/50">
            <div className="p-2 font-medium">Data</div>
            <div className="p-2 font-medium">Estágio</div>
            <div className="p-2 font-medium">Pontuação</div>
            <div className="p-2 font-medium">Receita</div>
            <div className="p-2 font-medium">Despesa</div>
          </div>
          <div>
            {diagnosticHistory.map((item, index) => (
              <div key={index} className="grid grid-cols-5 border-b last:border-0 hover:bg-muted/20 cursor-pointer">
                <div className="p-2">{item.date}</div>
                <div className="p-2">
                  <Badge className={item.stage === "Expansão" ? "bg-green-500" : "bg-blue-500"}>{item.stage}</Badge>
                </div>
                <div className="p-2">{item.score}/100</div>
                <div className="p-2">R$ {item.revenue.toLocaleString("pt-BR")}</div>
                <div className="p-2">R$ {item.expenses.toLocaleString("pt-BR")}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">Mostrando os últimos 3 diagnósticos</div>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Ver Relatório Completo
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function DashboardPage() {
  const [periodoGrafico, setPeriodoGrafico] = useState("6m")
  const [isLoading, setIsLoading] = useState(true)
  const [periodoFiltro, setPeriodoFiltro] = useState("mes")
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredBar, setHoveredBar] = useState(null)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // Filtrar dados com base no período selecionado
  const filteredData = () => {
    switch (periodoGrafico) {
      case "3m":
        return financialData.slice(-3)
      case "6m":
        return financialData
      case "12m":
        // Simulando 12 meses
        return [
          { month: "Jul", receita: 66000, despesa: 44000, saldo: 22000 },
          { month: "Ago", receita: 68000, despesa: 45000, saldo: 23000 },
          { month: "Set", receita: 65000, despesa: 43000, saldo: 22000 },
          { month: "Out", receita: 70000, despesa: 46000, saldo: 24000 },
          { month: "Nov", receita: 72000, despesa: 48000, saldo: 24000 },
          { month: "Dez", receita: 75000, despesa: 50000, saldo: 25000 },
          ...financialData,
        ]
      default:
        return financialData
    }
  }

  // Formatador para valores monetários
  const formatCurrency = (value) => {
    return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Manipuladores para interação com o gráfico de pizza
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )

  // Manipuladores para interação com o gráfico de barras
  const handleBarMouseEnter = (payload, index) => {
    if (payload && index !== undefined) {
      setHoveredBar(index)
    }
  }

  const handleBarMouseLeave = () => {
    setHoveredBar(null)
  }

  // Função para exportar dados para CSV
  const exportToCSV = () => {
    setIsExporting(true)

    // Simulando o tempo de processamento da exportação
    setTimeout(() => {
      const data = filteredData()
      const headers = "Mês,Receita,Despesa,Saldo\n"
      const csvContent = data.reduce((acc, row) => {
        return acc + `${row.month},${row.receita},${row.despesa},${row.saldo}\n`
      }, headers)

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", "evolucao_financeira.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setIsExporting(false)
    }, 1500)
  }

  return (
    <>
      <TooltipProvider>
        <div className="space-y-8">
          {/* Cabeçalho da página */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Visão geral do desempenho financeiro da sua empresa</p>
              </div>
              <div className="flex items-center gap-2">
                <PeriodFilter />
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                  <span className="sr-only">Filtrar</span>
                </Button>
              </div>
            </div>

            {/* Atalhos rápidos */}
            <div className="flex flex-wrap gap-3">
              <Button asChild className="bg-santander-600 hover:bg-santander-700 shadow-sm">
                <Link href="/enviar-extrato">
                  <FileUp className="mr-2 h-4 w-4" />
                  Enviar Extrato
                </Link>
              </Button>
              <Button asChild variant="outline" className="shadow-sm">
                <Link href="/simulador">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Simulador de Cenários
                </Link>
              </Button>
              <Button asChild variant="outline" className="shadow-sm">
                <Link href="/analises">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Análises
                </Link>
              </Button>
              <Button asChild variant="outline" className="shadow-sm">
                <Link href="/relatorios">
                  <Download className="mr-2 h-4 w-4" />
                  Relatórios
                </Link>
              </Button>
            </div>
          </div>

          {/* Filtros rápidos */}
          <div className="bg-muted/30 rounded-lg p-3 flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtros Rápidos:</span>
            </div>
            <div className="bg-muted rounded-lg p-1 flex">
              <Button
                variant={periodoFiltro === "mes" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPeriodoFiltro("mes")}
                className={periodoFiltro === "mes" ? "bg-santander-600" : ""}
              >
                Mês
              </Button>
              <Button
                variant={periodoFiltro === "trimestre" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPeriodoFiltro("trimestre")}
                className={periodoFiltro === "trimestre" ? "bg-santander-600" : ""}
              >
                Trimestre
              </Button>
              <Button
                variant={periodoFiltro === "semestre" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPeriodoFiltro("semestre")}
                className={periodoFiltro === "semestre" ? "bg-santander-600" : ""}
              >
                Semestre
              </Button>
              <Button
                variant={periodoFiltro === "ano" ? "default" : "ghost"}
                size="sm"
                onClick={() => setPeriodoFiltro("ano")}
                className={periodoFiltro === "ano" ? "bg-santander-600" : ""}
              >
                Ano
              </Button>
            </div>
          </div>

          {/* KPIs */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Receita Total"
              value="R$ 64.000,00"
              change="+12% em relação ao mês anterior"
              icon={<TrendingUp className="h-4 w-4 text-green-500" />}
              borderColor="border-l-green-500"
              changeColor="text-green-500"
            />
            <KpiCard
              title="Despesa Total"
              value="R$ 42.000,00"
              change="-7% em relação ao mês anterior"
              icon={<TrendingDown className="h-4 w-4 text-red-500" />}
              borderColor="border-l-red-500"
              changeColor="text-red-500"
              hasNotification={true}
            />
            <KpiCard
              title="Saldo Atual"
              value="R$ 22.000,00"
              change="+69% em relação ao mês anterior"
              icon={<ArrowUpRight className="h-4 w-4 text-blue-500" />}
              borderColor="border-l-blue-500"
              changeColor="text-blue-500"
            />
            <KpiCard
              title="ROI"
              value="18.5%"
              change="+2.3% em relação ao mês anterior"
              icon={<Percent className="h-4 w-4 text-purple-500" />}
              borderColor="border-l-purple-500"
              changeColor="text-purple-500"
            />
          </div>

          {/* Gráficos principais */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle>Evolução Financeira</CardTitle>
                  <CardDescription>Acompanhe a evolução financeira da sua empresa</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={periodoGrafico === "3m" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setPeriodoGrafico("3m")}
                  >
                    3M
                  </Button>
                  <Button
                    variant={periodoGrafico === "6m" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setPeriodoGrafico("6m")}
                  >
                    6M
                  </Button>
                  <Button
                    variant={periodoGrafico === "12m" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setPeriodoGrafico("12m")}
                  >
                    12M
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[350px] relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingIndicator size="lg" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData()} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis
                        dataKey="month"
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: "var(--border)" }}
                      />
                      <YAxis
                        stroke="var(--muted-foreground)"
                        fontSize={12}
                        tickLine={false}
                        axisLine={{ stroke: "var(--border)" }}
                        tickFormatter={(value) => `R$${value / 1000}k`}
                      />
                      <RechartsTooltip content={<CustomTooltip formatter={formatCurrency} />} />
                      <Legend
                        verticalAlign="top"
                        height={36}
                        iconSize={10}
                        iconType="circle"
                        wrapperStyle={{ fontSize: "12px" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="receita"
                        name="Receita"
                        stroke="#4ade80"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "#4ade80" }}
                        animationDuration={1000}
                      />
                      <Line
                        type="monotone"
                        dataKey="despesa"
                        name="Despesa"
                        stroke="#f87171"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "#f87171" }}
                        animationDuration={1000}
                        animationBegin={300}
                      />
                      <Line
                        type="monotone"
                        dataKey="saldo"
                        name="Saldo"
                        stroke="#60a5fa"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: "#60a5fa" }}
                        animationDuration={1000}
                        animationBegin={600}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Última atualização: <span className="font-medium">Hoje, 09:30</span>
                </div>
                <Button variant="outline" size="sm" onClick={exportToCSV} disabled={isExporting}>
                  {isExporting ? (
                    <>
                      <LoadingIndicator size="sm" className="mr-2" />
                      Exportando...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Exportar CSV
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Distribuição de Despesas</CardTitle>
                <CardDescription>Por categoria no período atual</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingIndicator size="lg" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        activeIndex={activeIndex}
                        activeShape={renderActiveShape}
                        data={despesasPorCategoria}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        onMouseEnter={onPieEnter}
                        animationDuration={1000}
                        isAnimationActive={true}
                      >
                        {despesasPorCategoria.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                            stroke="var(--background)"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip content={<CustomTooltip formatter={formatCurrency} />} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Total: R$ {despesasPorCategoria.reduce((acc, item) => acc + item.value, 0).toLocaleString("pt-BR")}
                </div>
                <Button variant="outline" size="sm">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Histórico de Diagnósticos */}
          <DiagnosticHistoryCard />

          {/* Estágio da Empresa e Estatísticas */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <EstagioEmpresaCard />

            <Card className="md:col-span-1 lg:col-span-2 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Indicadores de Desempenho</CardTitle>
                <CardDescription>Métricas chave para monitoramento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Margem de Lucro</span>
                      <TooltipInfo content="Lucro líquido dividido pela receita total" />
                    </div>
                    <span className="font-medium text-green-600">34.4%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "34.4%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">ROI</span>
                      <TooltipInfo content="Retorno sobre investimento" />
                    </div>
                    <span className="font-medium text-green-600">22.8%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "22.8%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Liquidez Corrente</span>
                      <TooltipInfo content="Ativos circulantes divididos por passivos circulantes" />
                    </div>
                    <span className="font-medium">1.8</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Crescimento de Receita</span>
                      <TooltipInfo content="Taxa de crescimento da receita em relação ao período anterior" />
                    </div>
                    <span className="font-medium text-green-600">12.0%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "12%" }}></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Ver Análise Completa
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Estatísticas adicionais */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Clientes Ativos"
              value="128"
              icon={{ component: Users, bgColor: "bg-blue-100", color: "text-blue-600" }}
              description="vs. mês anterior"
              trend="up"
              trendValue="+12%"
            />
            <StatCard
              title="Ticket Médio"
              value="R$ 1.250,00"
              icon={{ component: DollarSign, bgColor: "bg-green-100", color: "text-green-600" }}
              description="vs. mês anterior"
              trend="up"
              trendValue="+5.2%"
            />
            <StatCard
              title="Taxa de Conversão"
              value="24.8%"
              icon={{ component: Percent, bgColor: "bg-amber-100", color: "text-amber-600" }}
              description="vs. mês anterior"
              trend="down"
              trendValue="-1.3%"
            />
            <StatCard
              title="Tempo Médio de Pagamento"
              value="18 dias"
              icon={{ component: Clock, bgColor: "bg-purple-100", color: "text-purple-600" }}
              description="vs. mês anterior"
              trend="up"
              trendValue="+2 dias"
            />
          </div>

          {/* Ações Recomendadas */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Ações Recomendadas</h2>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Ver Todas
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AcaoRecomendadaCard
                titulo="Revisar Gastos com Marketing"
                descricao="Os gastos com marketing aumentaram 54% sem retorno proporcional. Considere otimizar os canais."
                prioridade="alta"
                icon={<AlertCircle />}
                iconBgColor="bg-red-100"
                iconColor="text-red-600"
              />
              <AcaoRecomendadaCard
                titulo="Diversificar Fontes de Receita"
                descricao="Sua empresa depende muito de poucas fontes. Explore novos segmentos de mercado relacionados."
                prioridade="média"
                icon={<BarChart3 />}
                iconBgColor="bg-amber-100"
                iconColor="text-amber-600"
              />
              <AcaoRecomendadaCard
                titulo="Aplicar Saldo em Investimentos"
                descricao="Há R$ 22.000 disponíveis que poderiam gerar retorno adicional em aplicações financeiras."
                prioridade="baixa"
                icon={<TrendingUp />}
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
              />
            </div>
          </div>

          {/* Gráficos adicionais */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Distribuição de Receitas</CardTitle>
                <CardDescription>Por categoria nos últimos 3 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingIndicator size="md" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Abr", vendas: 30000, servicos: 25000, assinaturas: 8000 },
                        { name: "Mai", vendas: 32000, servicos: 22000, assinaturas: 4000 },
                        { name: "Jun", vendas: 35000, servicos: 20000, assinaturas: 9000 },
                      ]}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      onMouseMove={(state) => {
                        if (state && state.isTooltipActive) {
                          handleBarMouseEnter(state.activePayload, state.activeTooltipIndex)
                        }
                      }}
                      onMouseLeave={handleBarMouseLeave}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
                      <RechartsTooltip content={<CustomTooltip formatter={formatCurrency} />} />
                      <Legend />
                      <Bar
                        dataKey="vendas"
                        name="Vendas"
                        fill="#ec0000"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                      />
                      <Bar
                        dataKey="servicos"
                        name="Serviços"
                        fill="#737373"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                        animationBegin={300}
                      />
                      <Bar
                        dataKey="assinaturas"
                        name="Assinaturas"
                        fill="#a3a3a3"
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                        animationBegin={600}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Análise Detalhada
                </Button>
              </CardFooter>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Tendência de Saldo</CardTitle>
                <CardDescription>Projeção para os próximos 3 meses</CardDescription>
              </CardHeader>
              <CardContent className="h-[250px] relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingIndicator size="md" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        { name: "Abr", saldo: 23000, projecao: null },
                        { name: "Mai", saldo: 13000, projecao: null },
                        { name: "Jun", saldo: 22000, projecao: null },
                        { name: "Jul", saldo: null, projecao: 25000 },
                        { name: "Ago", saldo: null, projecao: 28000 },
                        { name: "Set", saldo: null, projecao: 32000 },
                      ]}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
                      <RechartsTooltip content={<CustomTooltip formatter={formatCurrency} />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="saldo"
                        name="Saldo Atual"
                        stroke="#60a5fa"
                        fill="#60a5fa"
                        fillOpacity={0.3}
                        animationDuration={1000}
                      />
                      <Area
                        type="monotone"
                        dataKey="projecao"
                        name="Projeção"
                        stroke="#a3a3a3"
                        fill="#a3a3a3"
                        fillOpacity={0.3}
                        strokeDasharray="5 5"
                        animationDuration={1000}
                        animationBegin={300}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver Projeções
                </Button>
              </CardFooter>
            </Card>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
                <CardDescription>Calendário financeiro</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="bg-santander-100 rounded-md p-2">
                    <Calendar className="h-5 w-5 text-santander-600" />
                  </div>
                  <div>
                    <p className="font-medium">Fechamento Mensal</p>
                    <p className="text-xs text-muted-foreground">30/05/2023</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="bg-blue-100 rounded-md p-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Reunião com Investidores</p>
                    <p className="text-xs text-muted-foreground">05/06/2023</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <div className="bg-green-100 rounded-md p-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Pagamento de Dividendos</p>
                    <p className="text-xs text-muted-foreground">15/06/2023</p>
                  </div>
                </div>
                <Separator />
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Calendário Completo
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Insights */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Insights Inteligentes
              </CardTitle>
              <CardDescription>Análises e recomendações baseadas nos seus dados financeiros</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-lg border p-4 hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Crescimento de Receita
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Sua empresa apresentou um crescimento de receita de 42% nos últimos 6 meses, superando a média do
                  setor que é de 23%.
                </p>
                <Button variant="link" className="p-0 h-auto mt-2 text-santander-600">
                  Ver detalhes <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-lg border p-4 hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-medium flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Controle de Despesas
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  As despesas aumentaram 31% no mesmo período. Recomendamos revisar os gastos com marketing que
                  cresceram 54%.
                </p>
                <Button variant="link" className="p-0 h-auto mt-2 text-santander-600">
                  Ver detalhes <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-lg border p-4 hover:bg-muted/30 transition-colors"
              >
                <h3 className="font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-blue-500" />
                  Oportunidade de Investimento
                </h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Com o saldo atual, há uma oportunidade de investir em expansão ou aplicar em produtos financeiros com
                  retorno médio de 12% a.a.
                </p>
                <Button variant="link" className="p-0 h-auto mt-2 text-santander-600">
                  Ver detalhes <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </motion.div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Lightbulb className="mr-2 h-4 w-4" />
                Ver Todos os Insights
              </Button>
            </CardFooter>
          </Card>
        </div>
      </TooltipProvider>
    </>
  )
}
