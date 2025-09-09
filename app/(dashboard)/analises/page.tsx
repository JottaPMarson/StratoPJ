"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PeriodFilter } from "@/components/ui/period-filter"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { TooltipInfo } from "@/components/ui/tooltip-info"
import {
  Download,
  Filter,
  PieChart,
  BarChart3,
  Network,
  TrendingUp,
  Maximize2,
  Zap,
  FileText,
  ArrowUpRight,
  Calendar,
  Sliders,
  ChevronRight,
  Info,
  AlertCircle,
  Lightbulb,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Eye,
  EyeOff,
} from "lucide-react"
import {
  Line,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { motion, AnimatePresence } from "framer-motion"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ApiService } from "@/lib/api"
import { MetricasDashboard } from "@/lib/types"
import { useMemo } from "react"

// Dados de exemplo para os gráficos
const despesasPorCategoria = [
  { name: "Pessoal", value: 18000 },
  { name: "Marketing", value: 12000 },
  { name: "Operacional", value: 8000 },
  { name: "Tecnologia", value: 4000 },
]

const receitasPorCanal = [
  { name: "Vendas Diretas", value: 35000 },
  { name: "E-commerce", value: 15000 },
  { name: "Parcerias", value: 10000 },
  { name: "Assinaturas", value: 4000 },
]

const fluxoCaixa = [
  { mes: "Jan", entradas: 45000, saidas: 32000, saldo: 13000 },
  { mes: "Fev", entradas: 52000, saidas: 34000, saldo: 18000 },
  { mes: "Mar", entradas: 49000, saidas: 36000, saldo: 13000 },
  { mes: "Abr", entradas: 63000, saidas: 40000, saldo: 23000 },
  { mes: "Mai", entradas: 58000, saidas: 45000, saldo: 13000 },
  { mes: "Jun", entradas: 64000, saidas: 42000, saldo: 22000 },
]

// Dados para tendências
const tendenciaReceitas = [
  { mes: "Jan", atual: 45000, projetado: 45000 },
  { mes: "Fev", atual: 52000, projetado: 51000 },
  { mes: "Mar", atual: 49000, projetado: 50000 },
  { mes: "Abr", atual: 63000, projetado: 60000 },
  { mes: "Mai", atual: 58000, projetado: 62000 },
  { mes: "Jun", atual: 64000, projetado: 65000 },
  { mes: "Jul", projetado: 68000 },
  { mes: "Ago", projetado: 72000 },
  { mes: "Set", projetado: 75000 },
]

const tendenciaDespesas = [
  { mes: "Jan", atual: 32000, projetado: 32000 },
  { mes: "Fev", atual: 34000, projetado: 33000 },
  { mes: "Mar", atual: 36000, projetado: 35000 },
  { mes: "Abr", atual: 40000, projetado: 38000 },
  { mes: "Mai", atual: 45000, projetado: 42000 },
  { mes: "Jun", atual: 42000, projetado: 44000 },
  { mes: "Jul", projetado: 46000 },
  { mes: "Ago", projetado: 48000 },
  { mes: "Set", projetado: 50000 },
]

const indicadoresTendencia = [
  { nome: "Crescimento de Receita", valor: 8.2, tendencia: "up", comparativo: "+2.3% vs. setor" },
  { nome: "Margem de Lucro", valor: 34.4, tendencia: "up", comparativo: "+5.1% vs. setor" },
  { nome: "Despesas Operacionais", valor: 28.5, tendencia: "down", comparativo: "-1.8% vs. mês anterior" },
  { nome: "ROI", valor: 22.8, tendencia: "stable", comparativo: "Estável vs. trimestre anterior" },
]

// Dados para análise de rede simplificada
const dadosRede = {
  nodes: [
    { id: "empresa", name: "Sua Empresa", value: 100, group: 1 },
    { id: "cliente1", name: "Cliente A", value: 70, group: 2 },
    { id: "cliente2", name: "Cliente B", value: 60, group: 2 },
    { id: "fornecedor1", name: "Fornecedor X", value: 65, group: 3 },
    { id: "fornecedor2", name: "Fornecedor Y", value: 55, group: 3 },
    { id: "banco1", name: "Banco Santander", value: 75, group: 4 },
  ],
  links: [
    { source: "empresa", target: "cliente1", value: 35 },
    { source: "empresa", target: "cliente2", value: 25 },
    { source: "fornecedor1", target: "empresa", value: 20 },
    { source: "fornecedor2", target: "empresa", value: 18 },
    { source: "empresa", target: "banco1", value: 50 },
    { source: "cliente1", target: "fornecedor1", value: 5 },
  ],
}

// Dados para análise de correlação
const correlacaoDados = [
  { x: 15000, y: 25000, z: 5, name: "Jan" },
  { x: 18000, y: 29000, z: 6, name: "Fev" },
  { x: 17000, y: 28000, z: 5, name: "Mar" },
  { x: 22000, y: 35000, z: 7, name: "Abr" },
  { x: 25000, y: 38000, z: 8, name: "Mai" },
  { x: 24000, y: 40000, z: 8, name: "Jun" },
]

// Dados para radar chart
const radarData = [
  { subject: "Receitas", A: 120, B: 110, fullMark: 150 },
  { subject: "Despesas", A: 98, B: 130, fullMark: 150 },
  { subject: "Lucro", A: 86, B: 130, fullMark: 150 },
  { subject: "Fluxo de Caixa", A: 99, B: 100, fullMark: 150 },
  { subject: "Investimentos", A: 85, B: 90, fullMark: 150 },
  { subject: "Dívidas", A: 65, B: 85, fullMark: 150 },
]

const COLORS = ["#ec0000", "#737373", "#4ade80", "#60a5fa", "#facc15"]

// Função para formatação inteligente de valores grandes
const formatCurrency = (value: number): string => {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(1)}B`
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`
  }
  return value.toString()
}

// Funções para gerar dados dinâmicos baseados nos dados do CSV
const gerarDespesasPorCategoria = (dashboardData: MetricasDashboard | null) => {
  if (!dashboardData) return despesasPorCategoria
  
  const totalDespesas = dashboardData.despesasTotal
  return [
    { name: "Pessoal", value: Math.round(totalDespesas * 0.43) },
    { name: "Marketing", value: Math.round(totalDespesas * 0.29) },
    { name: "Operacional", value: Math.round(totalDespesas * 0.19) },
    { name: "Tecnologia", value: Math.round(totalDespesas * 0.09) },
  ]
}

const gerarReceitasPorCanal = async (dashboardData: MetricasDashboard | null) => {
  if (!dashboardData) return receitasPorCanal
  
  try {
    // Usar dados reais das transações do CSV
    const receitasReais = await ApiService.obterReceitasPorTipoTransacao()
    
    if (receitasReais && receitasReais.length > 0) {
      // Converter para o formato esperado pelo gráfico
      return receitasReais.map(item => ({
        name: item.name,
        value: item.value
      }))
    }
  } catch (error) {
    console.error('Erro ao carregar receitas por tipo de transação:', error)
  }
  
  // Fallback para dados estáticos se houver erro
  return receitasPorCanal
}

const gerarFluxoCaixa = (dashboardData: MetricasDashboard | null) => {
  if (!dashboardData) return fluxoCaixa
  
  const receitaMensal = dashboardData.receitaTotal / 12
  const despesaMensal = dashboardData.despesasTotal / 12
  
  return [
    { mes: "Jan", entradas: Math.round(receitaMensal * 0.9), saidas: Math.round(despesaMensal * 0.8), saldo: Math.round((receitaMensal * 0.9) - (despesaMensal * 0.8)) },
    { mes: "Fev", entradas: Math.round(receitaMensal * 1.1), saidas: Math.round(despesaMensal * 0.85), saldo: Math.round((receitaMensal * 1.1) - (despesaMensal * 0.85)) },
    { mes: "Mar", entradas: Math.round(receitaMensal * 0.95), saidas: Math.round(despesaMensal * 0.9), saldo: Math.round((receitaMensal * 0.95) - (despesaMensal * 0.9)) },
    { mes: "Abr", entradas: Math.round(receitaMensal * 1.2), saidas: Math.round(despesaMensal * 1.0), saldo: Math.round((receitaMensal * 1.2) - (despesaMensal * 1.0)) },
    { mes: "Mai", entradas: Math.round(receitaMensal * 1.05), saidas: Math.round(despesaMensal * 1.1), saldo: Math.round((receitaMensal * 1.05) - (despesaMensal * 1.1)) },
    { mes: "Jun", entradas: Math.round(receitaMensal * 1.15), saidas: Math.round(despesaMensal * 1.05), saldo: Math.round((receitaMensal * 1.15) - (despesaMensal * 1.05)) },
  ]
}

const gerarIndicadoresFinanceiros = (dashboardData: MetricasDashboard | null) => {
  if (!dashboardData) {
    return {
      margemLucro: 34.4,
      roi: 22.8,
      liquidez: 1.8
    }
  }
  
  return {
    margemLucro: dashboardData.margemLucro,
    roi: Math.min(40, dashboardData.margemLucro * 0.7), // ROI baseado na margem
    liquidez: Math.min(3.0, 1.5 + (dashboardData.margemLucro / 50)) // Liquidez baseada na margem
  }
}

const gerarInsightsFinanceiros = (dashboardData: MetricasDashboard | null) => {
  if (!dashboardData) {
    return [
      {
        titulo: "Crescimento Consistente",
        descricao: "Sua empresa apresenta crescimento de receita consistente nos últimos 6 meses, com média de 8.2% ao mês.",
        tipo: "positivo"
      },
      {
        titulo: "Despesas de Marketing",
        descricao: "As despesas com marketing representam 28.5% do total, acima da média do setor que é de 18%. Considere revisar a eficiência dos canais.",
        tipo: "atencao"
      },
      {
        titulo: "Diversificação de Receitas",
        descricao: "54.7% das receitas vêm de vendas diretas. Empresas com melhor desempenho no setor têm maior diversificação de canais.",
        tipo: "sugestao"
      }
    ]
  }
  
  const insights = []
  
  // Insight baseado na margem de lucro
  if (dashboardData.margemLucro > 20) {
    insights.push({
      titulo: "Excelente Performance Financeira",
      descricao: `Sua empresa apresenta uma margem de lucro de ${dashboardData.margemLucro.toFixed(1)}%, muito acima da média do setor. Continue mantendo essa eficiência operacional.`,
      tipo: "positivo"
    })
  } else if (dashboardData.margemLucro < 10) {
    insights.push({
      titulo: "Oportunidade de Otimização",
      descricao: `Com margem de ${dashboardData.margemLucro.toFixed(1)}%, há espaço para melhorar a eficiência operacional. Considere revisar custos e processos.`,
      tipo: "atencao"
    })
  }
  
  // Insight baseado no volume de receitas
  if (dashboardData.receitaTotal > 1000000) {
    insights.push({
      titulo: "Alto Volume de Receitas",
      descricao: `Receita anual de R$ ${formatCurrency(dashboardData.receitaTotal)} indica boa penetração no mercado. Considere estratégias de expansão.`,
      tipo: "positivo"
    })
  }
  
  // Insight sobre diversificação
  insights.push({
    titulo: "Diversificação de Receitas",
    descricao: "Considere diversificar os canais de receita para reduzir dependência de uma única fonte e aumentar a resiliência do negócio.",
    tipo: "sugestao"
  })
  
  return insights
}

export default function AnalisesPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<MetricasDashboard | null>(null)
  const [receitasPorCanalData, setReceitasPorCanalData] = useState(receitasPorCanal)
  const [visualizacaoGrafico, setVisualizacaoGrafico] = useState("barras")
  const [periodoSelecionado, setPeriodoSelecionado] = useState("30d")
  const [showFullDetails, setShowFullDetails] = useState(false)
  const [metricaSelecionada, setMetricaSelecionada] = useState(null)
  const [isExporting, setIsExporting] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showLegend, setShowLegend] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showProjections, setShowProjections] = useState(true)
  const [confidenceInterval, setConfidenceInterval] = useState(80)
  const [selectedNode, setSelectedNode] = useState(null)
  const [highlightedNodes, setHighlightedNodes] = useState([])
  const [networkLayout, setNetworkLayout] = useState("force")
  const [showTooltips, setShowTooltips] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(1000)
  const [dataUpdateTime, setDataUpdateTime] = useState(new Date())

  const networkRef = useRef(null)
  const refreshTimerRef = useRef(null)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        await ApiService.inicializar()
        const dados = await ApiService.obterDadosDashboard()
        setDashboardData(dados)
        
        // Carregar receitas por tipo de transação
        const receitasReais = await ApiService.obterReceitasPorTipoTransacao()
        if (receitasReais && receitasReais.length > 0) {
          const receitasFormatadas = receitasReais.map(item => ({
            name: item.name,
            value: item.value
          }))
          setReceitasPorCanalData(receitasFormatadas)
          console.log('Receitas por tipo de transação carregadas:', receitasFormatadas)
        }

        
        console.log('Dados carregados na página de análises:', dados)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setIsLoading(false)
      }
    }

    carregarDados()
  }, [])

  // Calcular dados dinâmicos baseados nos dados do CSV
  const despesasPorCategoriaData = useMemo(() => 
    gerarDespesasPorCategoria(dashboardData), [dashboardData]
  )
  
  const fluxoCaixaData = useMemo(() => 
    gerarFluxoCaixa(dashboardData), [dashboardData]
  )
  
  const indicadoresFinanceiros = useMemo(() => 
    gerarIndicadoresFinanceiros(dashboardData), [dashboardData]
  )
  
  const insightsFinanceiros = useMemo(() => 
    gerarInsightsFinanceiros(dashboardData), [dashboardData]
  )

  // Simulação de atualização de dados em tempo real
  useEffect(() => {
    if (refreshInterval > 0) {
      refreshTimerRef.current = setInterval(() => {
        // Simulação de atualização de dados
        setDataUpdateTime(new Date())

        // Aqui seria implementada a lógica para buscar novos dados do servidor
        console.log("Atualizando dados em tempo real...")
      }, refreshInterval * 1000)
    }

    return () => {
      if (refreshTimerRef.current) {
        clearInterval(refreshTimerRef.current)
      }
    }
  }, [refreshInterval])

  const handlePeriodChange = (period) => {
    setPeriodoSelecionado(period)
    // Aqui seria implementada a lógica para atualizar os dados com base no período
  }

  const handleExportData = (format = "pdf") => {
    setIsExporting(true)

    // Simulando o tempo de processamento da exportação
    setTimeout(() => {
      setIsExporting(false)

      // Simulação de download
      const link = document.createElement("a")
      link.href = "#"
      link.setAttribute("download", `analise_financeira_${new Date().toISOString().slice(0, 10)}.${format}`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 2000)
  }

  const handleMetricaClick = (metrica) => {
    setMetricaSelecionada(metrica)
    setShowFullDetails(true)
  }

  const handleNodeClick = (node) => {
    setSelectedNode(node)
    setHighlightedNodes([node.id])
  }

  const handleZoomChange = (newZoom) => {
    setZoomLevel(newZoom[0])
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const refreshData = () => {
    setIsLoading(true)
    // Simulação de atualização de dados
    setTimeout(() => {
      setDataUpdateTime(new Date())
      setIsLoading(false)
    }, 1000)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Análises Financeiras</h1>
            <p className="text-muted-foreground">
              Visualize e analise os dados financeiros da sua empresa
              {dataUpdateTime && (
                <span className="ml-2 text-xs">Última atualização: {dataUpdateTime.toLocaleTimeString()}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PeriodFilter onPeriodChange={handlePeriodChange} />
            <Select defaultValue="mensal">
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Agrupamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diario">Diário</SelectItem>
                <SelectItem value="semanal">Semanal</SelectItem>
                <SelectItem value="mensal">Mensal</SelectItem>
                <SelectItem value="trimestral">Trimestral</SelectItem>
                <SelectItem value="anual">Anual</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={refreshData} title="Atualizar dados">
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              <span className="sr-only">Atualizar</span>
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filtrar</span>
            </Button>
          </div>
        </div>

        <div className="bg-muted/30 p-3 rounded-lg flex flex-wrap gap-3 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Label htmlFor="refresh-interval" className="text-sm">
                Atualização:
              </Label>
              <Select value={refreshInterval.toString()} onValueChange={(v) => setRefreshInterval(Number(v))}>
                <SelectTrigger className="w-[120px] h-8">
                  <SelectValue placeholder="Intervalo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Manual</SelectItem>
                  <SelectItem value="30">30 segundos</SelectItem>
                  <SelectItem value="60">1 minuto</SelectItem>
                  <SelectItem value="300">5 minutos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="show-tooltips" className="text-sm">
                Tooltips:
              </Label>
              <Switch id="show-tooltips" checked={showTooltips} onCheckedChange={setShowTooltips} />
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="show-legend" className="text-sm">
                Legenda:
              </Label>
              <Switch id="show-legend" checked={showLegend} onCheckedChange={setShowLegend} />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Label htmlFor="animation-speed" className="text-sm">
              Velocidade de animação:
            </Label>
            <Select value={animationSpeed.toString()} onValueChange={(v) => setAnimationSpeed(Number(v))}>
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="Velocidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Sem animação</SelectItem>
                <SelectItem value="500">Rápida</SelectItem>
                <SelectItem value="1000">Média</SelectItem>
                <SelectItem value="2000">Lenta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="financeira" className="space-y-4">
          <TabsList className="bg-background border">
            <TabsTrigger value="financeira" className="data-[state=active]:bg-muted">
              <BarChart3 className="h-4 w-4 mr-2" />
              Análise Financeira
            </TabsTrigger>
            <TabsTrigger value="redes" className="data-[state=active]:bg-muted">
              <Network className="h-4 w-4 mr-2" />
              Análise de Redes
            </TabsTrigger>
            <TabsTrigger value="tendencias" className="data-[state=active]:bg-muted">
              <TrendingUp className="h-4 w-4 mr-2" />
              Tendências
            </TabsTrigger>
          </TabsList>

          <TabsContent value="financeira" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <PieChart className="h-5 w-5 text-santander-600" />
                      Despesas por Categoria
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Select value={visualizacaoGrafico} onValueChange={setVisualizacaoGrafico} defaultValue="pizza">
                        <SelectTrigger className="w-[130px] h-8">
                          <SelectValue placeholder="Visualização" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pizza">Gráfico Pizza</SelectItem>
                          <SelectItem value="barras">Gráfico Barras</SelectItem>
                          <SelectItem value="tabela">Tabela</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Distribuição das despesas no período</CardDescription>
                </CardHeader>
                <CardContent
                  className={`${isFullscreen ? "fixed inset-0 z-50 bg-background p-6" : ""} h-[300px] relative`}
                >
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LoadingIndicator size="lg" />
                    </div>
                  ) : visualizacaoGrafico === "pizza" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={despesasPorCategoriaData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          animationDuration={animationSpeed}
                        >
                          {despesasPorCategoriaData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        {showTooltips && (
                          <Tooltip
                            formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, "Valor"]}
                            contentStyle={{
                              backgroundColor: "var(--background)",
                              borderColor: "var(--border)",
                              borderRadius: "8px",
                            }}
                          />
                        )}
                        {showLegend && <Legend />}
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : visualizacaoGrafico === "barras" ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={despesasPorCategoriaData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={formatCurrency} />
                        {showTooltips && (
                          <Tooltip
                            formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, "Valor"]}
                            contentStyle={{
                              backgroundColor: "var(--background)",
                              borderColor: "var(--border)",
                              borderRadius: "8px",
                            }}
                          />
                        )}
                        {showLegend && <Legend />}
                        <Bar
                          dataKey="value"
                          fill="#ec0000"
                          animationDuration={animationSpeed}
                          onClick={(data) =>
                            handleMetricaClick({ type: "despesa", category: data.name, value: data.value })
                          }
                          style={{ cursor: "pointer" }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full overflow-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-4">Categoria</th>
                            <th className="text-right py-2 px-4">Valor (R$)</th>
                            <th className="text-right py-2 px-4">Percentual</th>
                          </tr>
                        </thead>
                        <tbody>
                          {despesasPorCategoriaData.map((item, index) => {
                            const total = despesasPorCategoriaData.reduce((acc, curr) => acc + curr.value, 0)
                            const percentual = (item.value / total) * 100
                            return (
                              <tr
                                key={index}
                                className="border-b hover:bg-muted/50 cursor-pointer"
                                onClick={() =>
                                  handleMetricaClick({ type: "despesa", category: item.name, value: item.value })
                                }
                              >
                                <td className="py-2 px-4">{item.name}</td>
                                <td className="text-right py-2 px-4">{item.value.toLocaleString("pt-BR")}</td>
                                <td className="text-right py-2 px-4">{percentual.toFixed(1)}%</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {isFullscreen && (
                    <Button className="absolute top-4 right-4" variant="outline" onClick={toggleFullscreen}>
                      Fechar
                    </Button>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Total: R$ {despesasPorCategoriaData.reduce((acc, item) => acc + item.value, 0).toLocaleString("pt-BR")}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExportData("csv")}>
                      <Download className="mr-2 h-4 w-4" />
                      Exportar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleMetricaClick("despesas")}>
                      <Maximize2 className="mr-2 h-4 w-4" />
                      Detalhes
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <PieChart className="h-5 w-5 text-santander-600" />
                      Receitas por Canal
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="pizza">
                        <SelectTrigger className="w-[130px] h-8">
                          <SelectValue placeholder="Visualização" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pizza">Gráfico Pizza</SelectItem>
                          <SelectItem value="barras">Gráfico Barras</SelectItem>
                          <SelectItem value="tabela">Tabela</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon">
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Distribuição das receitas no período</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] relative">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LoadingIndicator size="lg" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={receitasPorCanalData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          animationDuration={animationSpeed}
                          onClick={(data) =>
                            handleMetricaClick({ type: "receita", category: data.name, value: data.value })
                          }
                        >
                          {receitasPorCanalData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                              style={{ cursor: "pointer" }}
                            />
                          ))}
                        </Pie>
                        {showTooltips && (
                          <Tooltip
                            formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, "Valor"]}
                            contentStyle={{
                              backgroundColor: "var(--background)",
                              borderColor: "var(--border)",
                              borderRadius: "8px",
                            }}
                          />
                        )}
                        {showLegend && <Legend />}
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    Total: R$ {receitasPorCanalData.reduce((acc, item) => acc + item.value, 0).toLocaleString("pt-BR")}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleExportData("csv")}>
                      <Download className="mr-2 h-4 w-4" />
                      Exportar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleMetricaClick("receitas")}>
                      <Maximize2 className="mr-2 h-4 w-4" />
                      Detalhes
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BarChart3 className="h-5 w-5 text-santander-600" />
                      Fluxo de Caixa
                    </CardTitle>
                    <CardDescription>Entradas, saídas e saldo mensal</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      Entradas
                    </Badge>
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                      Saídas
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-santander-100 text-santander-800 dark:bg-santander-900/20 dark:text-santander-400"
                    >
                      <div className="w-2 h-2 rounded-full bg-santander-600 mr-1"></div>
                      Saldo
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[350px] relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingIndicator size="lg" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={fluxoCaixaData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis tickFormatter={formatCurrency} />
                      {showTooltips && (
                        <Tooltip
                          formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, undefined]}
                          contentStyle={{
                            backgroundColor: "var(--background)",
                            borderColor: "var(--border)",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                      {showLegend && <Legend />}
                      <Bar
                        dataKey="entradas"
                        name="Entradas"
                        fill="#4ade80"
                        animationDuration={animationSpeed}
                        onClick={(data) =>
                          handleMetricaClick({
                            type: "fluxo",
                            category: "entradas",
                            month: data.mes,
                            value: data.entradas,
                          })
                        }
                        style={{ cursor: "pointer" }}
                      />
                      <Bar
                        dataKey="saidas"
                        name="Saídas"
                        fill="#f87171"
                        animationDuration={animationSpeed}
                        onClick={(data) =>
                          handleMetricaClick({ type: "fluxo", category: "saidas", month: data.mes, value: data.saidas })
                        }
                        style={{ cursor: "pointer" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="saldo"
                        name="Saldo"
                        stroke="#ec0000"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{
                          r: 8,
                          onClick: (data) =>
                            handleMetricaClick({
                              type: "fluxo",
                              category: "saldo",
                              month: data.payload.mes,
                              value: data.payload.saldo,
                            }),
                        }}
                        animationDuration={animationSpeed}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm space-x-4">
                  <span className="text-green-600 font-medium">
                    Total Entradas: R${" "}
                    {fluxoCaixaData.reduce((acc, item) => acc + item.entradas, 0).toLocaleString("pt-BR")}
                  </span>
                  <span className="text-red-600 font-medium">
                    Total Saídas: R$ {fluxoCaixaData.reduce((acc, item) => acc + item.saidas, 0).toLocaleString("pt-BR")}
                  </span>
                  <span className="text-santander-600 font-medium">
                    Saldo Acumulado: R$ {fluxoCaixaData.reduce((acc, item) => acc + item.saldo, 0).toLocaleString("pt-BR")}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="pdf">
                    <SelectTrigger className="w-[100px] h-8">
                      <SelectValue placeholder="Formato" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="xlsx">Excel</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={() => handleExportData()}>
                    {isExporting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Exportando...
                      </>
                    ) : (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <div className="grid gap-6 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">Indicadores Financeiros</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Margem de Lucro</span>
                          <TooltipInfo content="Lucro líquido dividido pela receita total" />
                        </div>
                        <span className="font-medium text-green-600">{indicadoresFinanceiros.margemLucro.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${indicadoresFinanceiros.margemLucro}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>Média do setor: 18%</span>
                        <span>50%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">ROI</span>
                          <TooltipInfo content="Retorno sobre investimento" />
                        </div>
                        <span className="font-medium text-green-600">{indicadoresFinanceiros.roi.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${indicadoresFinanceiros.roi}%` }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0%</span>
                        <span>Média do setor: 15%</span>
                        <span>40%</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Liquidez Corrente</span>
                          <TooltipInfo content="Ativos circulantes divididos por passivos circulantes" />
                        </div>
                        <span className="font-medium">{indicadoresFinanceiros.liquidez.toFixed(1)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0</span>
                        <span>Média do setor: 2.0</span>
                        <span>3.0</span>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full mt-2">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Ver Todos os Indicadores
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="md:col-span-2"
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Insights Financeiros</span>
                      <Badge
                        variant="outline"
                        className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        Powered by AI
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {insightsFinanceiros.map((insight, index) => {
                      const iconMap = {
                        positivo: <TrendingUp className="h-4 w-4 text-green-500" />,
                        atencao: <BarChart3 className="h-4 w-4 text-yellow-500" />,
                        sugestao: <Network className="h-4 w-4 text-blue-500" />
                      }
                      
                      const colorMap = {
                        positivo: "text-green-500",
                        atencao: "text-yellow-500", 
                        sugestao: "text-blue-500"
                      }
                      
                      return (
                        <div key={index} className="rounded-lg border p-3 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                          <h3 className="font-medium flex items-center gap-2">
                            {iconMap[insight.tipo as keyof typeof iconMap]}
                            {insight.titulo}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {insight.descricao}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <Button variant="link" size="sm" className="h-auto p-0 text-santander-600">
                              Ver análise detalhada
                            </Button>
                            <ChevronRight className="h-4 w-4 text-santander-600" />
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="redes" className="space-y-4">
            <Alert className="bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200 dark:border-blue-900/30">
              <Info className="h-4 w-4" />
              <AlertTitle>Análise de Rede Financeira</AlertTitle>
              <AlertDescription>
                Visualize as conexões financeiras entre sua empresa, clientes, fornecedores e instituições financeiras.
                Identifique relacionamentos-chave e potenciais riscos na sua rede de negócios.
              </AlertDescription>
            </Alert>

            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="network-layout" className="mb-2 block">
                  Layout da Rede
                </Label>
                <Select value={networkLayout} onValueChange={setNetworkLayout}>
                  <SelectTrigger id="network-layout">
                    <SelectValue placeholder="Selecione o layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="force">Força Dirigida</SelectItem>
                    <SelectItem value="circular">Circular</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                    <SelectItem value="hierarchical">Hierárquico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="zoom-level" className="mb-2 block">
                  Nível de Zoom: {zoomLevel}%
                </Label>
                <Slider
                  id="zoom-level"
                  min={50}
                  max={200}
                  step={10}
                  value={[zoomLevel]}
                  onValueChange={handleZoomChange}
                  className="w-full"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="highlight-filter" className="mb-2 block">
                  Destacar por Tipo
                </Label>
                <Select defaultValue="all">
                  <SelectTrigger id="highlight-filter">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="clients">Clientes</SelectItem>
                    <SelectItem value="suppliers">Fornecedores</SelectItem>
                    <SelectItem value="banks">Bancos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Network className="h-5 w-5 text-santander-600" />
                      Visão Geral da Rede
                    </CardTitle>
                    <CardDescription>Principais conexões financeiras da sua empresa</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/analises/rede">
                      <Maximize2 className="mr-2 h-4 w-4" />
                      Análise Completa
                    </a>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="h-[400px] relative" ref={networkRef}>
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingIndicator size="lg" />
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div
                      className="relative w-full h-full"
                      style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "center center" }}
                    >
                      <AnimatePresence>
                        {/* Empresa Central */}
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: animationSpeed / 1000 }}
                        >
                          <motion.div
                            className="w-20 h-20 rounded-full bg-santander-100 dark:bg-santander-900/30 flex items-center justify-center border-2 border-santander-600 text-santander-600 font-medium cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleNodeClick({ id: "empresa", name: "Sua Empresa", type: "empresa" })}
                          >
                            Sua Empresa
                          </motion.div>
                        </motion.div>

                        {/* Cliente A */}
                        <motion.div
                          className="absolute top-[15%] right-[30%] flex flex-col items-center"
                          initial={{ x: 50, y: -50, opacity: 0 }}
                          animate={{ x: 0, y: 0, opacity: 1 }}
                          transition={{ duration: animationSpeed / 1000, delay: 0.1 }}
                        >
                          <motion.div
                            className={`w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center border-2 border-green-600 text-green-600 font-medium text-sm cursor-pointer ${highlightedNodes.includes("cliente1") ? "ring-4 ring-green-300" : ""}`}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleNodeClick({ id: "cliente1", name: "Cliente A", type: "cliente" })}
                          >
                            Cliente A
                          </motion.div>
                          <div className="text-xs mt-1 text-muted-foreground">R$ 35.000</div>
                        </motion.div>
                        <svg className="absolute top-[25%] right-[40%] w-[100px] h-[100px]" viewBox="0 0 100 100">
                          <motion.line
                            x1="0"
                            y1="0"
                            x2="100"
                            y2="100"
                            stroke="#4ade80"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: highlightedNodes.includes("cliente1") ? 1 : 0.6 }}
                            transition={{ duration: animationSpeed / 1000, delay: 0.2 }}
                          />
                          {showTooltips && <title>R$ 35.000 - Vendas para Cliente A</title>}
                        </svg>

                        {/* Cliente B */}
                        <motion.div
                          className="absolute top-[60%] right-[20%] flex flex-col items-center"
                          initial={{ x: 50, y: 50, opacity: 0 }}
                          animate={{ x: 0, y: 0, opacity: 1 }}
                          transition={{ duration: animationSpeed / 1000, delay: 0.2 }}
                        >
                          <motion.div
                            className={`w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center border-2 border-green-600 text-green-600 font-medium text-sm cursor-pointer ${highlightedNodes.includes("cliente2") ? "ring-4 ring-green-300" : ""}`}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleNodeClick({ id: "cliente2", name: "Cliente B", type: "cliente" })}
                          >
                            Cliente B
                          </motion.div>
                          <div className="text-xs mt-1 text-muted-foreground">R$ 25.000</div>
                        </motion.div>
                        <svg className="absolute top-[45%] right-[30%] w-[100px] h-[100px]" viewBox="0 0 100 100">
                          <motion.line
                            x1="0"
                            y1="0"
                            x2="100"
                            y2="100"
                            stroke="#4ade80"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: highlightedNodes.includes("cliente2") ? 1 : 0.6 }}
                            transition={{ duration: animationSpeed / 1000, delay: 0.3 }}
                          />
                          {showTooltips && <title>R$ 25.000 - Vendas para Cliente B</title>}
                        </svg>

                        {/* Fornecedor X */}
                        <motion.div
                          className="absolute top-[20%] left-[25%] flex flex-col items-center"
                          initial={{ x: -50, y: -50, opacity: 0 }}
                          animate={{ x: 0, y: 0, opacity: 1 }}
                          transition={{ duration: animationSpeed / 1000, delay: 0.3 }}
                        >
                          <motion.div
                            className={`w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center border-2 border-red-600 text-red-600 font-medium text-sm cursor-pointer ${highlightedNodes.includes("fornecedor1") ? "ring-4 ring-red-300" : ""}`}
                            whileHover={{ scale: 1.1 }}
                            onClick={() =>
                              handleNodeClick({ id: "fornecedor1", name: "Fornecedor X", type: "fornecedor" })
                            }
                          >
                            Fornecedor X
                          </motion.div>
                          <div className="text-xs mt-1 text-muted-foreground">R$ 20.000</div>
                        </motion.div>
                        <svg className="absolute top-[30%] left-[35%] w-[100px] h-[100px]" viewBox="0 0 100 100">
                          <motion.line
                            x1="100"
                            y1="0"
                            x2="0"
                            y2="100"
                            stroke="#f87171"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: highlightedNodes.includes("fornecedor1") ? 1 : 0.6 }}
                            transition={{ duration: animationSpeed / 1000, delay: 0.4 }}
                          />
                          {showTooltips && <title>R$ 20.000 - Compras do Fornecedor X</title>}
                        </svg>

                        {/* Fornecedor Y */}
                        <motion.div
                          className="absolute bottom-[20%] left-[30%] flex flex-col items-center"
                          initial={{ x: -50, y: 50, opacity: 0 }}
                          animate={{ x: 0, y: 0, opacity: 1 }}
                          transition={{ duration: animationSpeed / 1000, delay: 0.4 }}
                        >
                          <motion.div
                            className={`w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center border-2 border-red-600 text-red-600 font-medium text-sm cursor-pointer ${highlightedNodes.includes("fornecedor2") ? "ring-4 ring-red-300" : ""}`}
                            whileHover={{ scale: 1.1 }}
                            onClick={() =>
                              handleNodeClick({ id: "fornecedor2", name: "Fornecedor Y", type: "fornecedor" })
                            }
                          >
                            Fornecedor Y
                          </motion.div>
                          <div className="text-xs mt-1 text-muted-foreground">R$ 18.000</div>
                        </motion.div>
                        <svg className="absolute bottom-[30%] left-[40%] w-[100px] h-[100px]" viewBox="0 0 100 100">
                          <motion.line
                            x1="100"
                            y1="0"
                            x2="0"
                            y2="100"
                            stroke="#f87171"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: highlightedNodes.includes("fornecedor2") ? 1 : 0.6 }}
                            transition={{ duration: animationSpeed / 1000, delay: 0.5 }}
                          />
                          {showTooltips && <title>R$ 18.000 - Compras do Fornecedor Y</title>}
                        </svg>

                        {/* Banco */}
                        <motion.div
                          className="absolute bottom-[30%] right-[35%] flex flex-col items-center"
                          initial={{ x: 50, y: 50, opacity: 0 }}
                          animate={{ x: 0, y: 0, opacity: 1 }}
                          transition={{ duration: animationSpeed / 1000, delay: 0.5 }}
                        >
                          <motion.div
                            className={`w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-2 border-blue-600 text-blue-600 font-medium text-sm cursor-pointer ${highlightedNodes.includes("banco1") ? "ring-4 ring-blue-300" : ""}`}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => handleNodeClick({ id: "banco1", name: "Banco Santander", type: "banco" })}
                          >
                            Banco
                          </motion.div>
                          <div className="text-xs mt-1 text-muted-foreground">R$ 50.000</div>
                        </motion.div>
                        <svg className="absolute bottom-[40%] right-[45%] w-[100px] h-[100px]" viewBox="0 0 100 100">
                          <motion.line
                            x1="0"
                            y1="0"
                            x2="100"
                            y2="100"
                            stroke="#60a5fa"
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: highlightedNodes.includes("banco1") ? 1 : 0.6 }}
                            transition={{ duration: animationSpeed / 1000, delay: 0.6 }}
                          />
                          {showTooltips && <title>R$ 50.000 - Financiamento com o Banco</title>}
                        </svg>
                      </AnimatePresence>
                    </div>

                    <div className="absolute top-4 right-4 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.min(200, zoomLevel + 20))}>
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setZoomLevel(Math.max(50, zoomLevel - 20))}>
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setHighlightedNodes([])}>
                        {highlightedNodes.length > 0 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="w-full space-y-4">
                  <Separator />
                  <div className="flex flex-wrap gap-3 justify-center">
                    <Badge
                      variant="outline"
                      className="bg-santander-100 text-santander-800 dark:bg-santander-900/20 dark:text-santander-400"
                    >
                      <div className="w-2 h-2 rounded-full bg-santander-600 mr-1"></div>
                      Sua Empresa
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      Clientes
                    </Badge>
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                      Fornecedores
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
                      Instituições Financeiras
                    </Badge>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Métricas de Rede</CardTitle>
                  <CardDescription>Indicadores da estrutura da sua rede financeira</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Centralidade</span>
                        <TooltipInfo content="Mede a importância de cada nó na rede com base em suas conexões" />
                      </div>
                      <span className="font-medium">0.42</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-santander-600 h-2 rounded-full" style={{ width: "42%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Modularidade</span>
                        <TooltipInfo content="Indica a qualidade da divisão da rede em comunidades" />
                      </div>
                      <span className="font-medium">0.38</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-santander-600 h-2 rounded-full" style={{ width: "38%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Coesão</span>
                        <TooltipInfo content="Mede o quão conectados estão os nós da rede entre si" />
                      </div>
                      <span className="font-medium">0.35</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-santander-600 h-2 rounded-full" style={{ width: "35%" }}></div>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                    <a href="/analises/rede">
                      <Network className="mr-2 h-4 w-4" />
                      Ver Análise Completa
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Alertas de Risco</CardTitle>
                  <CardDescription>Pontos de atenção identificados na sua rede</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <motion.div
                    className="rounded-lg border p-3 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      Concentração de Clientes
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      60% da receita depende de apenas 2 clientes, o que representa um risco significativo.
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-red-600 p-0 h-auto"
                      onClick={() => setHighlightedNodes(["cliente1", "cliente2"])}
                    >
                      Destacar na rede
                    </Button>
                  </motion.div>

                  <motion.div
                    className="rounded-lg border p-3 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Fornecedor Crítico
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Fornecedor X representa 40% dos pagamentos, considere diversificar fornecedores.
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-amber-600 p-0 h-auto"
                      onClick={() => setHighlightedNodes(["fornecedor1"])}
                    >
                      Destacar na rede
                    </Button>
                  </motion.div>

                  <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                    <a href="/analises/rede">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Ver Todos os Alertas
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tendencias" className="space-y-4">
            <Alert className="bg-purple-50 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200 dark:border-purple-900/30">
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Análise de Tendências</AlertTitle>
              <AlertDescription>
                Visualize padrões históricos e projeções futuras para receitas, despesas e outros indicadores
                financeiros. As projeções são baseadas em modelos estatísticos e aprendizado de máquina.
              </AlertDescription>
            </Alert>

            <div className="bg-muted/30 p-3 rounded-lg flex flex-wrap gap-3 items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="show-projections" className="text-sm">
                    Mostrar projeções:
                  </Label>
                  <Switch id="show-projections" checked={showProjections} onCheckedChange={setShowProjections} />
                </div>

                <div className="flex items-center gap-2">
                  <Label htmlFor="confidence-interval" className="text-sm">
                    Intervalo de confiança: {confidenceInterval}%
                  </Label>
                  <Slider
                    id="confidence-interval"
                    min={50}
                    max={95}
                    step={5}
                    value={[confidenceInterval]}
                    onValueChange={(value) => setConfidenceInterval(value[0])}
                    className="w-[150px]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Sliders className="mr-2 h-4 w-4" />
                  Ajustar Modelo
                </Button>
              </div>
            </div>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TrendingUp className="h-5 w-5 text-santander-600" />
                      Projeção de Receitas e Despesas
                    </CardTitle>
                    <CardDescription>Valores históricos e projeções para os próximos 3 meses</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    >
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
                      Receitas
                    </Badge>
                    <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                      Despesas
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[400px] relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingIndicator size="lg" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        ...tendenciaReceitas,
                        ...tendenciaDespesas.map((item) => ({
                          ...item,
                          atual: undefined,
                          projetado: undefined,
                          despesaAtual: item.atual,
                          despesaProjetado: item.projetado,
                        })),
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorReceitaProj" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorDespesaProj" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorReceitaConfidence" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4ade80" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorDespesaConfidence" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis tickFormatter={formatCurrency} />
                      {showTooltips && (
                        <Tooltip
                          formatter={(value, name) => {
                            const formattedValue = `R$ ${Number(value).toLocaleString("pt-BR")}`
                            let formattedName = name

                            if (name === "atual") formattedName = "Receita Atual"
                            if (name === "projetado") formattedName = "Receita Projetada"
                            if (name === "despesaAtual") formattedName = "Despesa Atual"
                            if (name === "despesaProjetado") formattedName = "Despesa Projetada"

                            return [formattedValue, formattedName]
                          }}
                          contentStyle={{
                            backgroundColor: "var(--background)",
                            borderColor: "var(--border)",
                            borderRadius: "8px",
                          }}
                        />
                      )}
                      {showLegend && <Legend />}

                      {/* Receitas */}
                      <Area
                        type="monotone"
                        dataKey="atual"
                        name="Receita Atual"
                        stroke="#4ade80"
                        fillOpacity={1}
                        fill="url(#colorReceita)"
                        strokeWidth={2}
                        animationDuration={animationSpeed}
                      />
                      {showProjections && (
                        <>
                          <Area
                            type="monotone"
                            dataKey="projetado"
                            name="Receita Projetada"
                            stroke="#4ade80"
                            fillOpacity={1}
                            fill="url(#colorReceitaProj)"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            animationDuration={animationSpeed}
                          />
                          {/* Área de confiança para receitas */}
                          <Area
                            type="monotone"
                            dataKey={(entry) =>
                              entry.projetado ? entry.projetado * (1 + (100 - confidenceInterval) / 100) : null
                            }
                            name="Limite Superior (Receita)"
                            stroke="transparent"
                            fill="url(#colorReceitaConfidence)"
                            fillOpacity={0.5}
                            animationDuration={animationSpeed}
                          />
                          <Area
                            type="monotone"
                            dataKey={(entry) =>
                              entry.projetado ? entry.projetado * (1 - (100 - confidenceInterval) / 100) : null
                            }
                            name="Limite Inferior (Receita)"
                            stroke="transparent"
                            fill="transparent"
                            fillOpacity={0.5}
                            animationDuration={animationSpeed}
                          />
                        </>
                      )}

                      {/* Despesas */}
                      <Area
                        type="monotone"
                        dataKey="despesaAtual"
                        name="Despesa Atual"
                        stroke="#f87171"
                        fillOpacity={1}
                        fill="url(#colorDespesa)"
                        strokeWidth={2}
                        animationDuration={animationSpeed}
                      />
                      {showProjections && (
                        <>
                          <Area
                            type="monotone"
                            dataKey="despesaProjetado"
                            name="Despesa Projetada"
                            stroke="#f87171"
                            fillOpacity={1}
                            fill="url(#colorDespesaProj)"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            animationDuration={animationSpeed}
                          />
                          {/* Área de confiança para despesas */}
                          <Area
                            type="monotone"
                            dataKey={(entry) =>
                              entry.despesaProjetado
                                ? entry.despesaProjetado * (1 + (100 - confidenceInterval) / 100)
                                : null
                            }
                            name="Limite Superior (Despesa)"
                            stroke="transparent"
                            fill="url(#colorDespesaConfidence)"
                            fillOpacity={0.5}
                            animationDuration={animationSpeed}
                          />
                          <Area
                            type="monotone"
                            dataKey={(entry) =>
                              entry.despesaProjetado
                                ? entry.despesaProjetado * (1 - (100 - confidenceInterval) / 100)
                                : null
                            }
                            name="Limite Inferior (Despesa)"
                            stroke="transparent"
                            fill="transparent"
                            fillOpacity={0.5}
                            animationDuration={animationSpeed}
                          />
                        </>
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1" />
                    Histórico
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400 border-dashed"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Projeção
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Sliders className="mr-2 h-4 w-4" />
                    Ajustar Projeção
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Indicadores de Tendência</CardTitle>
                  <CardDescription>Evolução dos principais indicadores financeiros</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {indicadoresTendencia.map((indicador, index) => (
                    <motion.div
                      key={index}
                      className="space-y-2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{indicador.nome}</span>
                          <TooltipInfo content={`Comparativo: ${indicador.comparativo}`} />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{indicador.valor}%</span>
                          {indicador.tendencia === "up" && <ArrowUpRight className="h-4 w-4 text-green-500" />}
                          {indicador.tendencia === "down" && (
                            <ArrowUpRight className="h-4 w-4 text-red-500 rotate-180" />
                          )}
                          {indicador.tendencia === "stable" && (
                            <ArrowUpRight className="h-4 w-4 text-yellow-500 rotate-90" />
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${
                            indicador.tendencia === "up"
                              ? "bg-green-500"
                              : indicador.tendencia === "down"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${indicador.valor}%` }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        ></motion.div>
                      </div>
                      <div className="text-xs text-muted-foreground">{indicador.comparativo}</div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Análise Comparativa</CardTitle>
                  <CardDescription>Comparação com médias do setor</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] relative">
                  {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LoadingIndicator size="lg" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={90} data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 150]} />
                        <Radar
                          name="Sua Empresa"
                          dataKey="A"
                          stroke="#ec0000"
                          fill="#ec0000"
                          fillOpacity={0.6}
                          animationDuration={animationSpeed}
                        />
                        <Radar
                          name="Média do Setor"
                          dataKey="B"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.6}
                          animationDuration={animationSpeed}
                        />
                        {showLegend && <Legend />}
                        {showTooltips && (
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--background)",
                              borderColor: "var(--border)",
                              borderRadius: "8px",
                            }}
                          />
                        )}
                      </RadarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    Comparação normalizada (0-150) dos principais indicadores financeiros com a média do setor
                  </p>
                </CardFooter>
              </Card>
            </div>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Insights de Tendências</span>
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
                  >
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Powered by AI
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  className="rounded-lg border p-4 bg-muted/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <h3 className="font-medium">Crescimento Sustentável</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    A análise de tendências indica um crescimento sustentável de receitas nos próximos 3 meses, com taxa
                    média projetada de 8.5% ao mês. Este crescimento está alinhado com o aumento de investimentos em
                    marketing.
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-lg border p-4 bg-muted/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <h3 className="font-medium">Sazonalidade Identificada</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Identificamos um padrão sazonal nas suas receitas, com picos nos meses de abril e outubro.
                    Recomendamos planejamento antecipado para estes períodos de maior demanda.
                  </p>
                </motion.div>

                <motion.div
                  className="rounded-lg border p-4 bg-muted/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <h3 className="font-medium">Alerta de Tendência</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    As despesas operacionais apresentam tendência de crescimento acima da inflação (12.5% vs 4.2%).
                    Recomendamos revisão dos processos operacionais para conter este aumento.
                  </p>
                </motion.div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar Relatório Completo de Tendências
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Diálogo para detalhes completos */}
      <Dialog open={showFullDetails} onOpenChange={setShowFullDetails}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {metricaSelecionada === "despesas"
                ? "Análise Detalhada de Despesas"
                : metricaSelecionada === "receitas"
                  ? "Análise Detalhada de Receitas"
                  : metricaSelecionada?.type === "fluxo"
                    ? `Análise de ${metricaSelecionada.category} - ${metricaSelecionada.month}`
                    : "Detalhes da Análise"}
            </DialogTitle>
            <DialogDescription>Visualização detalhada e análise aprofundada dos dados</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {metricaSelecionada === "despesas" && (
              <>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={despesasPorCategoriaData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip
                        formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, "Valor"]}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          borderColor: "var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="value" name="Valor" fill="#ec0000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Análise de Despesas</h3>
                  <p className="text-muted-foreground">
                    As despesas com pessoal representam a maior parte dos custos (42.9%), seguidas por marketing
                    (28.6%). A média do setor para despesas com pessoal é de 35%, o que indica que sua empresa está
                    acima da média.
                  </p>

                  <div className="rounded-lg border p-3 bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30">
                    <h4 className="font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-amber-500" />
                      Ponto de Atenção
                    </h4>
                    <p className="text-sm mt-1">
                      As despesas com marketing estão 10.6% acima da média do setor. Recomendamos uma análise do ROI de
                      cada canal para otimizar os investimentos.
                    </p>
                  </div>
                </div>
              </>
            )}

            {metricaSelecionada === "receitas" && (
              <>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={receitasPorCanalData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {receitasPorCanalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, "Valor"]}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          borderColor: "var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Análise de Receitas</h3>
                  <p className="text-muted-foreground">
                    As vendas diretas representam a maior fonte de receita (54.7%), seguidas pelo e-commerce (23.4%).
                    Empresas líderes do setor têm uma distribuição mais equilibrada entre os canais.
                  </p>

                  <div className="rounded-lg border p-3 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30">
                    <h4 className="font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-green-500" />
                      Oportunidade
                    </h4>
                    <p className="text-sm mt-1">
                      O canal de assinaturas representa apenas 6.3% das receitas, mas tem o maior potencial de
                      crescimento e previsibilidade. Considere investir mais neste modelo de negócio.
                    </p>
                  </div>
                </div>
              </>
            )}

            {metricaSelecionada?.type === "fluxo" && (
              <>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={fluxoCaixaData.filter((item) => item.mes === metricaSelecionada.month)}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis tickFormatter={formatCurrency} />
                      <Tooltip
                        formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, undefined]}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          borderColor: "var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="entradas" name="Entradas" fill="#4ade80" />
                      <Bar dataKey="saidas" name="Saídas" fill="#f87171" />
                      <Bar dataKey="saldo" name="Saldo" fill="#ec0000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Análise de {metricaSelecionada.category} em {metricaSelecionada.month}
                  </h3>
                  <p className="text-muted-foreground">
                    {metricaSelecionada.category === "entradas" &&
                      `As entradas de ${metricaSelecionada.month} totalizaram R$ ${metricaSelecionada.value.toLocaleString("pt-BR")}, representando um aumento de 8.5% em relação ao mês anterior.`}
                    {metricaSelecionada.category === "saidas" &&
                      `As saídas de ${metricaSelecionada.month} totalizaram R$ ${metricaSelecionada.value.toLocaleString("pt-BR")}, representando um aumento de 5.2% em relação ao mês anterior.`}
                    {metricaSelecionada.category === "saldo" &&
                      `O saldo de ${metricaSelecionada.month} foi de R$ ${metricaSelecionada.value.toLocaleString("pt-BR")}, representando 36.5% das entradas do mês.`}
                  </p>

                  <div className="rounded-lg border p-3 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30">
                    <h4 className="font-medium flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      Detalhamento
                    </h4>
                    <p className="text-sm mt-1">
                      {metricaSelecionada.category === "entradas" &&
                        `As principais fontes de receita em ${metricaSelecionada.month} foram vendas diretas (58%) e e-commerce (25%).`}
                      {metricaSelecionada.category === "saidas" &&
                        `As principais categorias de despesa em ${metricaSelecionada.month} foram pessoal (45%) e marketing (30%).`}
                      {metricaSelecionada.category === "saldo" &&
                        `O saldo de ${metricaSelecionada.month} está 15% acima da média dos últimos 6 meses, indicando uma tendência positiva.`}
                    </p>
                  </div>
                </div>
              </>
            )}

            {metricaSelecionada?.type === "despesa" && (
              <>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: metricaSelecionada.category, value: metricaSelecionada.value },
                          {
                            name: "Outras Despesas",
                            value: despesasPorCategoriaData.reduce(
                              (acc, item) => acc + (item.name !== metricaSelecionada.category ? item.value : 0),
                              0,
                            ),
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#ec0000" />
                        <Cell fill="#737373" />
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, "Valor"]}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          borderColor: "var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Análise de Despesa: {metricaSelecionada.category}</h3>
                  <p className="text-muted-foreground">
                    A categoria {metricaSelecionada.category} representa{" "}
                    {(
                      (metricaSelecionada.value / despesasPorCategoriaData.reduce((acc, item) => acc + item.value, 0)) *
                      100
                    ).toFixed(1)}
                    % do total de despesas, totalizando R$ {metricaSelecionada.value.toLocaleString("pt-BR")}.
                  </p>

                  <div className="rounded-lg border p-3 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30">
                    <h4 className="font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      Tendência
                    </h4>
                    <p className="text-sm mt-1">
                      As despesas com {metricaSelecionada.category.toLowerCase()} apresentaram um crescimento de
                      {metricaSelecionada.category === "Pessoal"
                        ? " 5.2%"
                        : metricaSelecionada.category === "Marketing"
                          ? " 8.7%"
                          : metricaSelecionada.category === "Operacional"
                            ? " 3.1%"
                            : " 12.4%"}
                      nos últimos 3 meses.
                    </p>
                  </div>
                </div>
              </>
            )}

            {metricaSelecionada?.type === "receita" && (
              <>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: metricaSelecionada.category, value: metricaSelecionada.value },
                          {
                            name: "Outras Receitas",
                            value: receitasPorCanalData.reduce(
                              (acc, item) => acc + (item.name !== metricaSelecionada.category ? item.value : 0),
                              0,
                            ),
                          },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        <Cell fill="#4ade80" />
                        <Cell fill="#737373" />
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, "Valor"]}
                        contentStyle={{
                          backgroundColor: "var(--background)",
                          borderColor: "var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Análise de Receita: {metricaSelecionada.category}</h3>
                  <p className="text-muted-foreground">
                    O canal {metricaSelecionada.category} representa{" "}
                    {(
                      (metricaSelecionada.value / receitasPorCanalData.reduce((acc, item) => acc + item.value, 0)) *
                      100
                    ).toFixed(1)}
                    % do total de receitas, totalizando R$ {metricaSelecionada.value.toLocaleString("pt-BR")}.
                  </p>

                  <div className="rounded-lg border p-3 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/30">
                    <h4 className="font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Tendência
                    </h4>
                    <p className="text-sm mt-1">
                      As receitas de {metricaSelecionada.category.toLowerCase()} apresentaram um crescimento de
                      {metricaSelecionada.category === "Vendas Diretas"
                        ? " 7.8%"
                        : metricaSelecionada.category === "E-commerce"
                          ? " 15.3%"
                          : metricaSelecionada.category === "Parcerias"
                            ? " 5.2%"
                            : " 22.7%"}
                      nos últimos 3 meses.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFullDetails(false)}>
              Fechar
            </Button>
            <Button onClick={() => handleExportData("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Relatório
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
