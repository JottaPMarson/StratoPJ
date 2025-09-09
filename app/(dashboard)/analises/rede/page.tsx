"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PeriodFilter } from "@/components/ui/period-filter"
import { Button } from "@/components/ui/button"
import {
  Filter,
  Share2,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Search,
  Network,
  BarChart3,
  RefreshCw,
  Eye,
  EyeOff,
  Save,
  DownloadIcon,
  PanelLeftOpen,
  AlertTriangle,
} from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { SkeletonCard } from "@/components/ui/skeleton-card"
import { RedeFinanceiraVisualizer } from "@/components/rede-financeira-visualizer"
import { RedeFinanceiraDetalhes } from "@/components/rede-financeira-detalhes"

// Dados simulados para a rede
const networkDataSimulado = {
  nodes: [
    { id: "empresa", name: "Sua Empresa", type: "empresa", value: 100000, risk: "low", centrality: 1.0 },
    { id: "cliente1", name: "Cliente A", type: "cliente", value: 35000, risk: "low", centrality: 0.75 },
    { id: "cliente2", name: "Cliente B", type: "cliente", value: 25000, risk: "medium", centrality: 0.55 },
    { id: "cliente3", name: "Cliente C", type: "cliente", value: 15000, risk: "high", centrality: 0.42 },
    { id: "fornecedor1", name: "Fornecedor X", type: "fornecedor", value: 20000, risk: "low", centrality: 0.68 },
    { id: "fornecedor2", name: "Fornecedor Y", type: "fornecedor", value: 18000, risk: "medium", centrality: 0.48 },
    { id: "fornecedor3", name: "Fornecedor Z", type: "fornecedor", value: 12000, risk: "high", centrality: 0.38 },
    { id: "banco1", name: "Banco Santander", type: "banco", value: 50000, risk: "low", centrality: 0.62 },
    { id: "banco2", name: "Banco Beta", type: "banco", value: 30000, risk: "medium", centrality: 0.35 },
    { id: "cliente4", name: "Cliente D", type: "cliente", value: 8000, risk: "medium", centrality: 0.28 },
    { id: "cliente5", name: "Cliente E", type: "cliente", value: 5000, risk: "high", centrality: 0.22 },
    { id: "fornecedor4", name: "Fornecedor W", type: "fornecedor", value: 7000, risk: "medium", centrality: 0.18 },
  ],
  links: [
    { source: "empresa", target: "cliente1", value: 35000, type: "recebimento" },
    { source: "empresa", target: "cliente2", value: 25000, type: "recebimento" },
    { source: "empresa", target: "cliente3", value: 15000, type: "recebimento" },
    { source: "fornecedor1", target: "empresa", value: 20000, type: "pagamento" },
    { source: "fornecedor2", target: "empresa", value: 18000, type: "pagamento" },
    { source: "fornecedor3", target: "empresa", value: 12000, type: "pagamento" },
    { source: "empresa", target: "banco1", value: 50000, type: "financiamento" },
    { source: "empresa", target: "banco2", value: 30000, type: "financiamento" },
    { source: "empresa", target: "cliente4", value: 8000, type: "recebimento" },
    { source: "empresa", target: "cliente5", value: 5000, type: "recebimento" },
    { source: "fornecedor4", target: "empresa", value: 7000, type: "pagamento" },
    { source: "cliente1", target: "fornecedor1", value: 5000, type: "relacionamento" },
    { source: "cliente2", target: "fornecedor2", value: 3000, type: "relacionamento" },
    { source: "banco1", target: "cliente1", value: 10000, type: "financiamento" },
  ],
}

// Métricas de rede calculadas
const networkMetricsSimulado = {
  centralidade: {
    empresa: 1.0,
    cliente1: 0.75,
    fornecedor1: 0.68,
    banco1: 0.62,
    cliente2: 0.55,
    fornecedor2: 0.48,
    cliente3: 0.42,
    fornecedor3: 0.38,
    banco2: 0.35,
    cliente4: 0.28,
    cliente5: 0.22,
    fornecedor4: 0.18,
  },
  modularidade: 0.42,
  coesao: 0.38,
  riscosIdentificados: [
    {
      tipo: "Concentração de Clientes",
      descricao: "60% da receita depende de apenas 2 clientes",
      impacto: "alto",
      recomendacao: "Diversificar base de clientes para reduzir dependência",
      nodes: ["cliente1", "cliente2"],
    },
    {
      tipo: "Fornecedor Crítico",
      descricao: "Fornecedor X representa 40% dos pagamentos",
      impacto: "médio",
      recomendacao: "Buscar fornecedores alternativos para reduzir dependência",
      nodes: ["fornecedor1"],
    },
    {
      tipo: "Conexão Indireta",
      descricao: "Cliente A e Fornecedor X possuem relação direta",
      impacto: "baixo",
      recomendacao: "Monitorar esta relação para evitar conflitos de interesse",
      nodes: ["cliente1", "fornecedor1"],
    },
    {
      tipo: "Cliente de Alto Risco",
      descricao: "Cliente C apresenta histórico de atrasos nos pagamentos",
      impacto: "alto",
      recomendacao: "Revisar termos de pagamento e considerar garantias adicionais",
      nodes: ["cliente3"],
    },
  ],
}

// Dados para tendências
const tendenciasDadosSimulado = [
  { mes: "Jan", nos: 32, conexoes: 48, transacoes: 120 },
  { mes: "Fev", nos: 35, conexoes: 52, transacoes: 135 },
  { mes: "Mar", nos: 37, conexoes: 58, transacoes: 142 },
  { mes: "Abr", nos: 38, conexoes: 62, transacoes: 158 },
  { mes: "Mai", nos: 42, conexoes: 70, transacoes: 172 },
  { mes: "Jun", nos: 45, conexoes: 78, transacoes: 185 },
]

// Dados para análise comparativa
const dadosComparativosSimulado = [
  { atributo: "Centralidade", empresa: 75, setor: 65, benchmark: 80 },
  { atributo: "Densidade", empresa: 60, setor: 55, benchmark: 70 },
  { atributo: "Reciprocidade", empresa: 85, setor: 70, benchmark: 75 },
  { atributo: "Eficiência", empresa: 70, setor: 60, benchmark: 85 },
  { atributo: "Resiliência", empresa: 65, setor: 50, benchmark: 75 },
  { atributo: "Diversificação", empresa: 55, setor: 65, benchmark: 80 },
]

export default function AnaliseRedePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("visualizacao")
  const [period, setPeriod] = useState("last6months")
  const [viewMode, setViewMode] = useState("graph")
  const [isRealTime, setIsRealTime] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const [showSidebar, setShowSidebar] = useState(true)
  const [dataRefreshInterval, setDataRefreshInterval] = useState(null)
  const [networkData, setNetworkData] = useState(null)
  const [filterLevel, setFilterLevel] = useState(50)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedNode, setSelectedNode] = useState(null)
  const [showLabels, setShowLabels] = useState(true)
  const [rotation, setRotation] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [alertsVisible, setAlertsVisible] = useState(true)
  const [riskAlerts, setRiskAlerts] = useState([])
  const [snaMetrics, setSnaMetrics] = useState(null)

  // Simulated data loading
  useEffect(() => {
    setIsLoading(true)

    const timer = setTimeout(() => {
      // Convert the data format to match what the visualizer expects
      const formattedData = {
        nodes: generateNetworkData().nodes.map((node) => ({
          id: node.id,
          label: node.name,
          type: node.type,
          value: node.value,
          riskScore: Math.random(),
          centrality: Math.random(),
        })),
        edges: generateNetworkData().links.map((link) => ({
          from: link.source,
          to: link.target,
          value: link.value,
          label: `R$ ${(link.value / 1000).toFixed(0)}k`,
          type: link.type,
          riskScore: link.riskScore,
        })),
      }

      setNetworkData(formattedData)
      setSnaMetrics(generateSnaMetrics())
      setRiskAlerts(generateRiskAlerts())
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [period])

  // Real-time data updates
  useEffect(() => {
    if (isRealTime) {
      const interval = setInterval(() => {
        setNetworkData((prev) => updateNetworkData(prev))
        setSnaMetrics((prev) => updateSnaMetrics(prev))
        setRiskAlerts((prev) => updateRiskAlerts(prev))
      }, 5000)

      setDataRefreshInterval(interval)
      return () => clearInterval(interval)
    } else if (dataRefreshInterval) {
      clearInterval(dataRefreshInterval)
      setDataRefreshInterval(null)
    }
  }, [isRealTime])

  // Simulated data generation functions
  const generateNetworkData = () => {
    // Generate more complex network data with realistic financial relationships
    const nodeTypes = ["client", "supplier", "bank", "partner", "subsidiary"]
    const riskLevels = ["low", "medium", "high"]

    const nodes = Array.from({ length: 50 }, (_, i) => {
      const type = nodeTypes[Math.floor(Math.random() * nodeTypes.length)]
      const riskLevel = riskLevels[Math.floor(Math.random() * riskLevels.length)]

      return {
        id: `node-${i}`,
        name: `Entity-${i}`,
        type,
        value: Math.random() * 1000000,
        transactions: Math.floor(Math.random() * 100) + 10,
        connections: Math.floor(Math.random() * 15) + 1,
        riskLevel,
        centrality: Math.random(),
        x: Math.random() * 800,
        y: Math.random() * 600,
      }
    })

    // Create more realistic network connections
    const links = []
    nodes.forEach((source) => {
      // Each node connects to 1-5 other nodes
      const connectionCount = Math.floor(Math.random() * 5) + 1

      for (let i = 0; i < connectionCount; i++) {
        const targetIndex = Math.floor(Math.random() * nodes.length)
        if (nodes[targetIndex].id !== source.id) {
          links.push({
            source: source.id,
            target: nodes[targetIndex].id,
            value: Math.random() * 500000,
            type: ["payment", "loan", "investment"][Math.floor(Math.random() * 3)],
            frequency: ["daily", "weekly", "monthly", "quarterly"][Math.floor(Math.random() * 4)],
            riskScore: Math.random(),
          })
        }
      }
    })

    return { nodes, links }
  }

  const generateSnaMetrics = () => {
    return {
      centrality: {
        degree: Math.random() * 100,
        betweenness: Math.random() * 100,
        closeness: Math.random() * 100,
        eigenvector: Math.random() * 100,
      },
      cohesion: {
        density: Math.random() * 100,
        transitivity: Math.random() * 100,
        reciprocity: Math.random() * 100,
      },
      modularity: {
        clusters: Math.floor(Math.random() * 10) + 3,
        modularity: Math.random() * 100,
        communities: Math.floor(Math.random() * 5) + 2,
      },
      resilience: {
        robustness: Math.random() * 100,
        vulnerability: Math.random() * 100,
        stability: Math.random() * 100,
      },
    }
  }

  const generateRiskAlerts = () => {
    const alertTypes = [
      "Alta concentração de transações",
      "Conexão com entidade de alto risco",
      "Padrão incomum de transações",
      "Dependência excessiva",
      "Ciclo de pagamento irregular",
      "Fluxo financeiro anômalo",
    ]

    return Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, i) => ({
      id: `alert-${i}`,
      type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
      severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      description: `Alerta detectado na análise de rede. Recomenda-se atenção.`,
      entities: [`Entity-${Math.floor(Math.random() * 50)}`, `Entity-${Math.floor(Math.random() * 50)}`],
      timestamp: new Date().toISOString(),
    }))
  }

  // Simulated data update functions
  const updateNetworkData = (prevData) => {
    if (!prevData) return generateNetworkData()

    // Update node positions and some values
    const updatedNodes = prevData.nodes.map((node) => {
      if (Math.random() > 0.7) {
        return {
          ...node,
          value: Math.max(10000, node.value * (0.95 + Math.random() * 0.1)),
          transactions: Math.max(5, node.transactions + (Math.random() > 0.5 ? 1 : -1)),
          x: node.x + (Math.random() * 10 - 5),
          y: node.y + (Math.random() * 10 - 5),
        }
      }
      return node
    })

    // Update some link values
    const updatedLinks = prevData.links.map((link) => {
      if (Math.random() > 0.7) {
        return {
          ...link,
          value: Math.max(1000, link.value * (0.95 + Math.random() * 0.1)),
          riskScore: Math.min(1, Math.max(0, link.riskScore + (Math.random() * 0.1 - 0.05))),
        }
      }
      return link
    })

    return { nodes: updatedNodes, links: updatedLinks }
  }

  const updateSnaMetrics = (prevMetrics) => {
    if (!prevMetrics) return generateSnaMetrics()

    // Small random variations in metrics
    return {
      centrality: {
        degree: Math.max(0, Math.min(100, prevMetrics.centrality.degree * (0.98 + Math.random() * 0.04))),
        betweenness: Math.max(0, Math.min(100, prevMetrics.centrality.betweenness * (0.98 + Math.random() * 0.04))),
        closeness: Math.max(0, Math.min(100, prevMetrics.centrality.closeness * (0.98 + Math.random() * 0.04))),
        eigenvector: Math.max(0, Math.min(100, prevMetrics.centrality.eigenvector * (0.98 + Math.random() * 0.04))),
      },
      cohesion: {
        density: Math.max(0, Math.min(100, prevMetrics.cohesion.density * (0.98 + Math.random() * 0.04))),
        transitivity: Math.max(0, Math.min(100, prevMetrics.cohesion.transitivity * (0.98 + Math.random() * 0.04))),
        reciprocity: Math.max(0, Math.min(100, prevMetrics.cohesion.reciprocity * (0.98 + Math.random() * 0.04))),
      },
      modularity: {
        clusters: prevMetrics.modularity.clusters,
        modularity: Math.max(0, Math.min(100, prevMetrics.modularity.modularity * (0.98 + Math.random() * 0.04))),
        communities: prevMetrics.modularity.communities,
      },
      resilience: {
        robustness: Math.max(0, Math.min(100, prevMetrics.resilience.robustness * (0.98 + Math.random() * 0.04))),
        vulnerability: Math.max(0, Math.min(100, prevMetrics.resilience.vulnerability * (0.98 + Math.random() * 0.04))),
        stability: Math.max(0, Math.min(100, prevMetrics.resilience.stability * (0.98 + Math.random() * 0.04))),
      },
    }
  }

  const updateRiskAlerts = (prevAlerts) => {
    if (!prevAlerts) return generateRiskAlerts()

    // Occasionally add or remove an alert
    if (Math.random() > 0.7) {
      if (Math.random() > 0.5 && prevAlerts.length > 2) {
        // Remove a random alert
        const indexToRemove = Math.floor(Math.random() * prevAlerts.length)
        return [...prevAlerts.slice(0, indexToRemove), ...prevAlerts.slice(indexToRemove + 1)]
      } else {
        // Add a new alert
        const alertTypes = [
          "Alta concentração de transações",
          "Conexão com entidade de alto risco",
          "Padrão incomum de transações",
          "Dependência excessiva",
          "Ciclo de pagamento irregular",
          "Fluxo financeiro anômalo",
        ]

        const newAlert = {
          id: `alert-${Date.now()}`,
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
          description: `Novo alerta detectado na análise de rede. Recomenda-se atenção.`,
          entities: [`Entity-${Math.floor(Math.random() * 50)}`, `Entity-${Math.floor(Math.random() * 50)}`],
          timestamp: new Date().toISOString(),
        }

        return [...prevAlerts, newAlert]
      }
    }

    return prevAlerts
  }


  const handleRefreshData = () => {
    setIsLoading(true)
    setTimeout(() => {
      setNetworkData(generateNetworkData())
      setSnaMetrics(generateSnaMetrics())
      setRiskAlerts(generateRiskAlerts())
      setIsLoading(false)
    }, 1000)
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(200, prev + 10))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(50, prev - 10))
  }

  const handleToggleSidebar = () => {
    setShowSidebar((prev) => !prev)
  }

  const handleFilterChange = (value) => {
    setFilterLevel(value[0])
  }

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node)
  }, [])

  const handleRotate = () => {
    setRotation((prev) => (prev + 45) % 360)
  }

  const handleToggleFullscreen = () => {
    setIsFullscreen((prev) => !prev)
  }

  const handleToggleLabels = () => {
    setShowLabels((prev) => !prev)
  }

  const handleToggleAlerts = () => {
    setAlertsVisible((prev) => !prev)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleSaveView = () => {
    // Simulate saving the current view
    alert("Visualização atual salva com sucesso!")
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-amber-100 text-amber-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod)
  }

  const handleVisualizacaoChange = (newVisualizacao) => {
    setViewMode(newVisualizacao)
  }

  const handleFiltroComplexidadeChange = (newFiltroComplexidade) => {
    setFilterLevel(newFiltroComplexidade)
  }

  const handleResetZoom = () => {
    setZoomLevel(100)
  }

  const handleCloseNodeDetails = () => {
    setSelectedNode(null)
  }

  const handleExport = () => {}

  const handleExportFormatChange = (format) => {}

  const handleToggleTooltips = () => {}

  const handleToggleLegend = () => {}

  const handleRefreshIntervalChange = (interval) => {}

  const handleAnimationSpeedChange = (speed) => {}

  const handleFilterTypeChange = (type) => {}

  const handleSearchTermChange = (term) => {
    setSearchQuery(term)
  }

  const handleMetricaVisualizadaChange = (metrica) => {}

  const handleToggleAdvancedFilters = () => {}

  const handleMinValueChange = (value) => {}

  const handleMaxValueChange = (value) => {}

  const handleRiskLevelChange = (level) => {}

  return (
    <TooltipProvider>
      <div className={`container mx-auto p-4 space-y-6 ${isFullscreen ? "fixed inset-0 z-50 bg-background" : ""}`}>
        <div className="flex justify-between items-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/analises">Análises</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Rede Financeira</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-center space-x-4">
            <PeriodFilter value={period} onChange={setPeriod} />

            <div className="flex items-center space-x-2">
              <Label htmlFor="real-time" className="text-sm">
                Tempo real
              </Label>
              <Switch id="real-time" checked={isRealTime} onCheckedChange={setIsRealTime} />
            </div>

            <Button variant="outline" size="sm" onClick={handleRefreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="visualizacao">
                <Network className="h-4 w-4 mr-2" />
                Visualização
              </TabsTrigger>
              <TabsTrigger value="metricas">
                <BarChart3 className="h-4 w-4 mr-2" />
                Métricas SNA
              </TabsTrigger>
              <TabsTrigger value="alertas">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Alertas de Risco
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar entidade..."
                  className="pl-8 h-9 w-[200px]"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>

              <Select value={viewMode} onValueChange={setViewMode}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Visualização" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="graph">Grafo</SelectItem>
                  <SelectItem value="matrix">Matriz</SelectItem>
                  <SelectItem value="tree">Hierárquico</SelectItem>
                  <SelectItem value="circle">Circular</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="ghost" size="icon" onClick={handleZoomIn} title="Aumentar zoom">
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleZoomOut} title="Diminuir zoom">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleRotate} title="Rotacionar visualização">
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleToggleLabels} title="Mostrar/ocultar rótulos">
                {showLabels ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleToggleFullscreen} title="Tela cheia">
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleToggleSidebar} title="Mostrar/ocultar painel lateral">
                <PanelLeftOpen className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-4">
            {showSidebar && (
              <div className="w-64 space-y-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Filtros</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Complexidade</Label>
                        <span className="text-sm text-muted-foreground">{filterLevel}%</span>
                      </div>
                      <Slider value={[filterLevel]} min={0} max={100} step={1} onValueChange={handleFilterChange} />
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Entidade</Label>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="cursor-pointer bg-blue-50">
                          Clientes
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer bg-green-50">
                          Fornecedores
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer bg-purple-50">
                          Bancos
                        </Badge>
                        <Badge variant="outline" className="cursor-pointer bg-orange-50">
                          Parceiros
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Valor Mínimo</Label>
                      <Select defaultValue="any">
                        <SelectTrigger>
                          <SelectValue placeholder="Qualquer valor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="any">Qualquer valor</SelectItem>
                          <SelectItem value="10k">R$ 10.000+</SelectItem>
                          <SelectItem value="50k">R$ 50.000+</SelectItem>
                          <SelectItem value="100k">R$ 100.000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Nível de Risco</Label>
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue placeholder="Todos os níveis" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos os níveis</SelectItem>
                          <SelectItem value="low">Baixo</SelectItem>
                          <SelectItem value="medium">Médio</SelectItem>
                          <SelectItem value="high">Alto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-2">
                      <Button variant="outline" size="sm" className="w-full">
                        <Filter className="h-4 w-4 mr-2" />
                        Aplicar Filtros
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {selectedNode && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Detalhes da Entidade</CardTitle>
                      <CardDescription>{selectedNode.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tipo</span>
                        <Badge variant="outline" className="capitalize">
                          {selectedNode.type}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Valor</span>
                        <span className="font-medium">R$ {selectedNode.value.toLocaleString("pt-BR")}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Transações</span>
                        <span className="font-medium">{selectedNode.transactions}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Conexões</span>
                        <span className="font-medium">{selectedNode.connections}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Risco</span>
                        <Badge className={getSeverityColor(selectedNode.riskLevel)}>
                          {selectedNode.riskLevel === "low"
                            ? "Baixo"
                            : selectedNode.riskLevel === "medium"
                              ? "Médio"
                              : "Alto"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Centralidade</span>
                        <span className="font-medium">{(selectedNode.centrality * 100).toFixed(1)}%</span>
                      </div>
                      <Separator />
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Detalhes Completos
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {alertsVisible && riskAlerts.length > 0 && (
                  <Card className="border-amber-200">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                        Alertas de Risco
                      </CardTitle>
                      <CardDescription>{riskAlerts.length} alerta(s) detectado(s)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 max-h-[200px] overflow-y-auto">
                      {riskAlerts.map((alert) => (
                        <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>{alert.type}</AlertTitle>
                          <AlertDescription className="text-xs">
                            {alert.description}
                            <div className="mt-1 font-medium">Entidades: {alert.entities.join(", ")}</div>
                          </AlertDescription>
                        </Alert>
                      ))}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="w-full">
                        Ver Todos os Alertas
                      </Button>
                    </CardFooter>
                  </Card>
                )}

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Visualizações Salvas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Visão Geral</span>
                      <Button variant="ghost" size="sm">
                        Carregar
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Clientes Principais</span>
                      <Button variant="ghost" size="sm">
                        Carregar
                      </Button>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fornecedores Críticos</span>
                      <Button variant="ghost" size="sm">
                        Carregar
                      </Button>
                    </div>
                    <Separator />
                    <Button variant="outline" size="sm" className="w-full" onClick={handleSaveView}>
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Visualização Atual
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            <div
              className={`flex-1 space-y-4 transition-all ${showSidebar ? "max-w-[calc(100%-16rem)]" : "max-w-full"}`}
            >
              <TabsContent value="visualizacao" className="space-y-4">
                {isLoading ? (
                  <LoadingIndicator height="600px" />
                ) : (
                  <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center justify-between">
                        <span>Visualização da Rede Financeira</span>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4 mr-2" />
                            Compartilhar
                          </Button>
                          <Button variant="outline" size="sm">
                            <DownloadIcon className="h-4 w-4 mr-2" />
                            Exportar
                          </Button>
                        </div>
                      </CardTitle>
                      <CardDescription>
                        Visualização interativa da sua rede financeira. Arraste os nós para reorganizar e clique para
                        ver detalhes.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 h-[600px]">
                      <RedeFinanceiraVisualizer
                        periodo={period}
                        tipoVisualizacao={viewMode}
                        filtroComplexidade={filterLevel}
                        data={networkData}
                        onNodeSelect={handleNodeSelect}
                        realTimeUpdate={isRealTime}
                        className="h-[600px]"
                      />
                    </CardContent>
                    <CardFooter className="bg-muted/50 p-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <div className="flex items-center mr-4">
                          <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                          <span>Clientes</span>
                        </div>
                        <div className="flex items-center mr-4">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                          <span>Fornecedores</span>
                        </div>
                        <div className="flex items-center mr-4">
                          <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
                          <span>Bancos</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-orange-500 mr-1"></div>
                          <span>Parceiros</span>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="metricas" className="space-y-4">
                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard className="md:col-span-2" height="300px" />
                  </div>
                ) : (
                  <RedeFinanceiraDetalhes data={networkData} metrics={snaMetrics} isRealTime={isRealTime} />
                )}
              </TabsContent>

              <TabsContent value="alertas" className="space-y-4">
                {isLoading ? (
                  <SkeletonCard height="500px" />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                        Alertas de Risco na Rede Financeira
                      </CardTitle>
                      <CardDescription>
                        Alertas identificados na análise da sua rede financeira que podem representar riscos para o seu
                        negócio.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {riskAlerts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          Nenhum alerta de risco identificado no período selecionado.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {riskAlerts.map((alert) => (
                            <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>{alert.type}</AlertTitle>
                              <AlertDescription>
                                {alert.description}
                                <div className="mt-2 font-medium">
                                  Entidades envolvidas: {alert.entities.join(", ")}
                                </div>
                                <div className="mt-1 text-xs text-muted-foreground">
                                  Detectado em: {new Date(alert.timestamp).toLocaleString("pt-BR")}
                                </div>
                                <div className="mt-3">
                                  <Button variant="outline" size="sm">
                                    Ver Detalhes
                                  </Button>
                                  <Button variant="ghost" size="sm" className="ml-2">
                                    Ignorar
                                  </Button>
                                </div>
                              </AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline">Exportar Alertas</Button>
                      <Button variant="default">Configurar Alertas</Button>
                    </CardFooter>
                  </Card>
                )}
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
