"use client"

import type React from "react"

import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCw, Search, Filter, Download, Maximize2, MinusCircle, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

// Tipos de dados para a rede financeira
interface NetworkNode {
  id: string
  label: string
  type: string
  value: number
  riskScore?: number
  centrality?: number
  x?: number
  y?: number
  vx?: number
  vy?: number
}

interface NetworkEdge {
  from: string
  to: string
  value: number
  label: string
  type?: string
  riskScore?: number
}

interface NetworkData {
  nodes: NetworkNode[]
  edges: NetworkEdge[]
}

// Simulação de dados para visualização
const mockNodes: NetworkNode[] = [
  { id: "empresa", label: "Sua Empresa", type: "empresa", value: 20, centrality: 0.95, riskScore: 0.2 },
  { id: "cliente1", label: "Cliente A", type: "cliente", value: 15, centrality: 0.65, riskScore: 0.1 },
  { id: "cliente2", label: "Cliente B", type: "cliente", value: 10, centrality: 0.45, riskScore: 0.3 },
  { id: "cliente3", label: "Cliente C", type: "cliente", value: 8, centrality: 0.35, riskScore: 0.5 },
  { id: "fornecedor1", label: "Fornecedor X", type: "fornecedor", value: 12, centrality: 0.55, riskScore: 0.7 },
  { id: "fornecedor2", label: "Fornecedor Y", type: "fornecedor", value: 10, centrality: 0.5, riskScore: 0.4 },
  { id: "fornecedor3", label: "Fornecedor Z", type: "fornecedor", value: 7, centrality: 0.3, riskScore: 0.8 },
  { id: "banco1", label: "Banco Alpha", type: "banco", value: 14, centrality: 0.6, riskScore: 0.2 },
  { id: "banco2", label: "Banco Beta", type: "banco", value: 9, centrality: 0.4, riskScore: 0.3 },
  { id: "parceiro1", label: "Parceiro 1", type: "parceiro", value: 6, centrality: 0.25, riskScore: 0.6 },
  { id: "parceiro2", label: "Parceiro 2", type: "parceiro", value: 5, centrality: 0.2, riskScore: 0.5 },
]

const mockEdges: NetworkEdge[] = [
  { from: "empresa", to: "cliente1", value: 100000, label: "R$ 100k", type: "venda", riskScore: 0.1 },
  { from: "empresa", to: "cliente2", value: 75000, label: "R$ 75k", type: "venda", riskScore: 0.2 },
  { from: "empresa", to: "cliente3", value: 50000, label: "R$ 50k", type: "venda", riskScore: 0.3 },
  { from: "fornecedor1", to: "empresa", value: 80000, label: "R$ 80k", type: "compra", riskScore: 0.6 },
  { from: "fornecedor2", to: "empresa", value: 65000, label: "R$ 65k", type: "compra", riskScore: 0.4 },
  { from: "fornecedor3", to: "empresa", value: 45000, label: "R$ 45k", type: "compra", riskScore: 0.7 },
  { from: "empresa", to: "banco1", value: 120000, label: "R$ 120k", type: "pagamento", riskScore: 0.2 },
  { from: "banco2", to: "empresa", value: 90000, label: "R$ 90k", type: "emprestimo", riskScore: 0.3 },
  { from: "empresa", to: "parceiro1", value: 30000, label: "R$ 30k", type: "parceria", riskScore: 0.5 },
  { from: "parceiro2", to: "empresa", value: 25000, label: "R$ 25k", type: "parceria", riskScore: 0.4 },
  { from: "cliente1", to: "fornecedor1", value: 15000, label: "R$ 15k", type: "transacao", riskScore: 0.3 },
  { from: "cliente2", to: "parceiro1", value: 10000, label: "R$ 10k", type: "transacao", riskScore: 0.2 },
  { from: "fornecedor2", to: "banco1", value: 20000, label: "R$ 20k", type: "transacao", riskScore: 0.4 },
]

interface RedeFinanceiraVisualizerProps {
  periodo: { inicio: Date; fim: Date }
  tipoVisualizacao: string
  filtroComplexidade: string
  className?: string
  onNodeSelect?: (node: NetworkNode) => void
  onEdgeSelect?: (edge: NetworkEdge) => void
  realTimeUpdate?: boolean
  data?: NetworkData
}

export function RedeFinanceiraVisualizer({
  periodo,
  tipoVisualizacao,
  filtroComplexidade,
  className,
  onNodeSelect,
  onEdgeSelect,
  realTimeUpdate = false,
  data,
}: RedeFinanceiraVisualizerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<NetworkEdge | null>(null)
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null)
  const [hoveredEdge, setHoveredEdge] = useState<NetworkEdge | null>(null)
  const [legendVisible, setLegendVisible] = useState(true)
  const [filterVisible, setFilterVisible] = useState(false)
  const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number }>>(new Map())
  const [isDragging, setIsDragging] = useState(false)
  const [dragNode, setDragNode] = useState<string | null>(null)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [riskThreshold, setRiskThreshold] = useState(0.5)
  const [valueThreshold, setValueThreshold] = useState(0)
  const [showLabels, setShowLabels] = useState(true)
  const [showValues, setShowValues] = useState(true)
  const [fullscreen, setFullscreen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Usar dados fornecidos ou mock data
  const networkData = useMemo(() => {
    if (!data) {
      return { nodes: mockNodes, edges: mockEdges }
    }

    // Ensure data has the expected structure
    return {
      nodes: Array.isArray(data.nodes) ? data.nodes : mockNodes,
      edges: Array.isArray(data.edges) ? data.edges : mockEdges,
    }
  }, [data])

  // Filtrar nós com base na complexidade e outros filtros
  const filteredNodes = useMemo(() => {
    if (!networkData || !Array.isArray(networkData.nodes)) {
      return []
    }

    return networkData.nodes.filter((node) => {
      // Filtro de complexidade
      if (filtroComplexidade === "todos") return true
      if (filtroComplexidade === "principais") return node.value >= 10
      if (filtroComplexidade === "criticos") return node.centrality && node.centrality >= 0.5
      if (filtroComplexidade === "risco") return node.riskScore && node.riskScore >= riskThreshold

      // Filtro de pesquisa
      if (searchQuery && !node.label.toLowerCase().includes(searchQuery.toLowerCase())) return false

      return true
    })
  }, [networkData, filtroComplexidade, riskThreshold, searchQuery])

  // Filtrar conexões com base nos nós filtrados e outros filtros
  const filteredEdges = useMemo(() => {
    if (!networkData || !Array.isArray(networkData.edges) || !Array.isArray(filteredNodes)) {
      return []
    }

    return networkData.edges.filter((edge) => {
      const fromNodeExists = filteredNodes.some((node) => node.id === edge.from)
      const toNodeExists = filteredNodes.some((node) => node.id === edge.to)

      // Filtro de valor
      if (edge.value < valueThreshold) return false

      // Filtro de risco
      if (edge.riskScore && edge.riskScore < riskThreshold) return false

      return fromNodeExists && toNodeExists
    })
  }, [networkData, filteredNodes, valueThreshold, riskThreshold])

  // Calcular posições iniciais dos nós
  useEffect(() => {
    if (!filteredNodes || filteredNodes.length === 0) return

    const positions = new Map<string, { x: number; y: number }>()

    // Posicionar nós em círculo
    filteredNodes.forEach((node, index) => {
      const angle = (index / filteredNodes.length) * Math.PI * 2 + (rotation * Math.PI) / 180
      const radius = 200 * (zoom / 100)

      positions.set(node.id, {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
      })
    })

    setNodePositions(positions)
    setIsLoading(false)
  }, [filteredNodes, zoom, rotation])

  // Simulação de física para posicionamento mais natural
  useEffect(() => {
    if (!isSimulating || !filteredNodes || filteredNodes.length === 0 || !filteredEdges) return

    const simulation = () => {
      const newPositions = new Map(nodePositions)

      // Aplicar forças de repulsão entre nós
      filteredNodes.forEach((nodeA) => {
        const posA = nodePositions.get(nodeA.id)
        if (!posA) return

        let fx = 0
        let fy = 0

        // Repulsão entre nós
        filteredNodes.forEach((nodeB) => {
          if (nodeA.id === nodeB.id) return

          const posB = nodePositions.get(nodeB.id)
          if (!posB) return

          const dx = posA.x - posB.x
          const dy = posA.y - posB.y
          const distance = Math.sqrt(dx * dx + dy * dy) || 1

          // Força inversamente proporcional à distância
          const force = 100 / (distance * distance)

          fx += (dx / distance) * force
          fy += (dy / distance) * force
        })

        // Atração para o centro
        const centerForce = 0.01
        fx -= posA.x * centerForce
        fy -= posA.y * centerForce

        // Atualizar posição
        newPositions.set(nodeA.id, {
          x: posA.x + fx * simulationSpeed,
          y: posA.y + fy * simulationSpeed,
        })
      })

      // Aplicar forças de atração nas conexões
      filteredEdges.forEach((edge) => {
        const sourcePos = nodePositions.get(edge.from)
        const targetPos = nodePositions.get(edge.to)

        if (!sourcePos || !targetPos) return

        const dx = targetPos.x - sourcePos.x
        const dy = targetPos.y - sourcePos.y
        const distance = Math.sqrt(dx * dx + dy * dy) || 1

        // Força proporcional à distância
        const force = distance * 0.005

        // Atualizar posições
        if (newPositions.has(edge.from)) {
          const pos = newPositions.get(edge.from)!
          newPositions.set(edge.from, {
            x: pos.x + (dx / distance) * force * simulationSpeed,
            y: pos.y + (dy / distance) * force * simulationSpeed,
          })
        }

        if (newPositions.has(edge.to)) {
          const pos = newPositions.get(edge.to)!
          newPositions.set(edge.to, {
            x: pos.x - (dx / distance) * force * simulationSpeed,
            y: pos.y - (dy / distance) * force * simulationSpeed,
          })
        }
      })

      setNodePositions(newPositions)
    }

    const interval = setInterval(simulation, 16) // ~60fps
    return () => clearInterval(interval)
  }, [isSimulating, filteredNodes, filteredEdges, nodePositions, simulationSpeed])

  // Renderizar a rede no canvas
  useEffect(() => {
    if (!canvasRef.current || isLoading || !filteredNodes || !filteredEdges) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Configurar canvas
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Limpar canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Definir cores por tipo
    const nodeColors: Record<string, string> = {
      empresa: "#3b82f6",
      cliente: "#10b981",
      fornecedor: "#f59e0b",
      banco: "#8b5cf6",
      parceiro: "#ec4899",
    }

    // Calcular centro do canvas
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Desenhar conexões
    filteredEdges.forEach((edge) => {
      const sourcePos = nodePositions.get(edge.from)
      const targetPos = nodePositions.get(edge.to)

      if (!sourcePos || !targetPos) return

      const fromX = centerX + sourcePos.x
      const fromY = centerY + sourcePos.y
      const toX = centerX + targetPos.x
      const toY = centerY + targetPos.y

      // Desenhar linha
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)

      // Espessura baseada no valor
      const lineWidth = Math.max(1, Math.min(5, edge.value / 20000))
      ctx.lineWidth = lineWidth

      // Cor da linha baseada no tipo e risco
      let strokeColor = "rgba(156, 163, 175, 0.6)"

      if (edge.type === "venda") strokeColor = "rgba(16, 185, 129, 0.6)"
      if (edge.type === "compra") strokeColor = "rgba(245, 158, 11, 0.6)"
      if (edge.type === "pagamento") strokeColor = "rgba(139, 92, 246, 0.6)"
      if (edge.type === "emprestimo") strokeColor = "rgba(59, 130, 246, 0.6)"

      // Destacar conexões de alto risco
      if (edge.riskScore && edge.riskScore >= 0.7) {
        strokeColor = "rgba(239, 68, 68, 0.7)"
      }

      // Destacar se a conexão estiver selecionada ou hover
      if (selectedEdge === edge || hoveredEdge === edge) {
        strokeColor = "rgba(79, 70, 229, 0.9)"
        ctx.lineWidth = lineWidth + 2
      }

      ctx.strokeStyle = strokeColor
      ctx.stroke()

      // Adicionar seta para indicar direção
      const arrowSize = lineWidth * 3
      const dx = toX - fromX
      const dy = toY - fromY
      const angle = Math.atan2(dy, dx)

      const midX = (fromX + toX) / 2
      const midY = (fromY + toY) / 2

      ctx.beginPath()
      ctx.moveTo(midX, midY)
      ctx.lineTo(midX - arrowSize * Math.cos(angle - Math.PI / 6), midY - arrowSize * Math.sin(angle - Math.PI / 6))
      ctx.lineTo(midX - arrowSize * Math.cos(angle + Math.PI / 6), midY - arrowSize * Math.sin(angle + Math.PI / 6))
      ctx.closePath()
      ctx.fillStyle = strokeColor
      ctx.fill()

      // Adicionar valor da transação
      if (showValues && zoom > 80) {
        ctx.font = "10px Arial"
        ctx.fillStyle = "rgba(55, 65, 81, 0.8)"
        ctx.fillText(edge.label, midX + 5, midY - 5)
      }
    })

    // Desenhar nós
    filteredNodes.forEach((node) => {
      const position = nodePositions.get(node.id)
      if (!position) return

      const x = centerX + position.x
      const y = centerY + position.y

      // Tamanho baseado no valor
      const size = Math.max(5, Math.min(20, node.value))

      // Desenhar círculo
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)

      // Cor baseada no tipo
      let fillColor = nodeColors[node.type] || "#6b7280"

      // Destacar nós de alto risco
      if (node.riskScore && node.riskScore >= 0.7) {
        fillColor = "#ef4444"
      }

      // Destacar se selecionado ou hover
      if (selectedNode === node.id || hoveredNode === node) {
        fillColor = "#4f46e5"
        ctx.shadowColor = "rgba(79, 70, 229, 0.5)"
        ctx.shadowBlur = 10
      }

      ctx.fillStyle = fillColor
      ctx.fill()

      // Adicionar borda
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 2
      ctx.stroke()

      // Resetar sombra
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      // Adicionar rótulo
      if (showLabels && (zoom > 60 || selectedNode === node.id || hoveredNode === node)) {
        ctx.font = "12px Arial"
        ctx.fillStyle = "#1f2937"
        ctx.textAlign = "center"
        ctx.fillText(node.label, x, y + size + 15)
      }

      // Indicador de centralidade (se disponível)
      if (node.centrality && node.centrality > 0.5) {
        ctx.beginPath()
        ctx.arc(x, y, size + 5, 0, Math.PI * 2)
        ctx.strokeStyle = "rgba(79, 70, 229, 0.4)"
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })
  }, [
    filteredNodes,
    filteredEdges,
    nodePositions,
    zoom,
    selectedNode,
    selectedEdge,
    hoveredNode,
    hoveredEdge,
    showLabels,
    showValues,
    isLoading,
  ])

  // Manipuladores de eventos do mouse
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || filteredNodes.length === 0) return

      const rect = canvasRef.current.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      // Verificar se está arrastando um nó
      if (isDragging && dragNode && dragStart) {
        const dx = mouseX - dragStart.x
        const dy = mouseY - dragStart.y

        const newPositions = new Map(nodePositions)
        const position = nodePositions.get(dragNode)

        if (position) {
          newPositions.set(dragNode, {
            x: position.x + dx,
            y: position.y + dy,
          })

          setNodePositions(newPositions)
          setDragStart({ x: mouseX, y: mouseY })
        }

        return
      }

      // Verificar se o mouse está sobre algum nó
      let foundNode = null
      for (const node of filteredNodes) {
        const position = nodePositions.get(node.id)
        if (!position) continue

        const x = centerX + position.x
        const y = centerY + position.y
        const size = Math.max(5, Math.min(20, node.value))

        const dx = mouseX - x
        const dy = mouseY - y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance <= size) {
          foundNode = node
          break
        }
      }

      setHoveredNode(foundNode)

      // Verificar se o mouse está sobre alguma conexão
      if (!foundNode) {
        let foundEdge = null
        const threshold = 5 // Distância máxima para considerar hover na linha

        for (const edge of filteredEdges) {
          const sourcePos = nodePositions.get(edge.from)
          const targetPos = nodePositions.get(edge.to)

          if (!sourcePos || !targetPos) continue

          const x1 = centerX + sourcePos.x
          const y1 = centerY + sourcePos.y
          const x2 = centerX + targetPos.x
          const y2 = centerY + targetPos.y

          // Calcular distância do ponto à linha
          const lineLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
          const distance = Math.abs((y2 - y1) * mouseX - (x2 - x1) * mouseY + x2 * y1 - y2 * x1) / lineLength

          // Verificar se o ponto está entre os extremos da linha
          const dotProduct = ((mouseX - x1) * (x2 - x1) + (mouseY - y1) * (y2 - y1)) / lineLength ** 2

          if (distance <= threshold && dotProduct >= 0 && dotProduct <= 1) {
            foundEdge = edge
            break
          }
        }

        setHoveredEdge(foundEdge)
      } else {
        setHoveredEdge(null)
      }
    },
    [filteredNodes, filteredEdges, nodePositions, isDragging, dragNode, dragStart],
  )

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !hoveredNode) return

      setIsDragging(true)
      setDragNode(hoveredNode.id)
      setDragStart({
        x: e.clientX - canvasRef.current.getBoundingClientRect().left,
        y: e.clientY - canvasRef.current.getBoundingClientRect().top,
      })
    },
    [hoveredNode],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setDragNode(null)
    setDragStart(null)

    // Se estava arrastando, não considerar como clique
    if (!isDragging && hoveredNode) {
      setSelectedNode(hoveredNode.id)
      onNodeSelect?.(hoveredNode)
    } else if (!isDragging && hoveredEdge) {
      setSelectedEdge(hoveredEdge)
      onEdgeSelect?.(hoveredEdge)
    }
  }, [isDragging, hoveredNode, hoveredEdge, onNodeSelect, onEdgeSelect])

  const handleMouseLeave = useCallback(() => {
    setHoveredNode(null)
    setHoveredEdge(null)
    setIsDragging(false)
  }, [])

  // Manipuladores de zoom e rotação
  const handleZoomIn = () => {
    setZoom(Math.min(200, zoom + 20))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(40, zoom - 20))
  }

  const handleReset = () => {
    setZoom(100)
    setRotation(0)
    setIsSimulating(false)
  }

  const handleRotate = (angle: number) => {
    setRotation((prev) => (prev + angle) % 360)
  }

  // Exportar visualização como imagem
  const handleExport = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = `rede-financeira-${new Date().toISOString().split("T")[0]}.png`
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()
  }

  // Alternar modo de tela cheia
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen)
  }

  // Alternar simulação de física
  const toggleSimulation = () => {
    setIsSimulating(!isSimulating)
  }

  // Componente de informações do nó selecionado
  const NodeInfoPanel = () => {
    if (!selectedNode) return null

    const node = filteredNodes.find((n) => n.id === selectedNode)
    if (!node) return null

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-2 left-2 z-10 bg-white/90 dark:bg-gray-800/90 p-3 rounded-md shadow-md border max-w-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  node.type === "empresa" && "bg-blue-500",
                  node.type === "cliente" && "bg-green-500",
                  node.type === "fornecedor" && "bg-amber-500",
                  node.type === "banco" && "bg-purple-500",
                  node.type === "parceiro" && "bg-pink-500",
                )}
              />
              <h4 className="font-medium">{node.label}</h4>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedNode(null)}>
              <MinusCircle className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tipo:</span>
              <span className="font-medium capitalize">{node.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor:</span>
              <span className="font-medium">{node.value.toLocaleString("pt-BR")}</span>
            </div>
            {node.centrality !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Centralidade:</span>
                <span className="font-medium">{(node.centrality * 100).toFixed(1)}%</span>
              </div>
            )}
            {node.riskScore !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risco:</span>
                <Badge variant={node.riskScore >= 0.7 ? "destructive" : node.riskScore >= 0.4 ? "warning" : "outline"}>
                  {node.riskScore >= 0.7 ? "Alto" : node.riskScore >= 0.4 ? "Médio" : "Baixo"}
                </Badge>
              </div>
            )}
          </div>

          <div className="mt-2 pt-2 border-t">
            <h5 className="text-xs font-medium mb-1">Conexões</h5>
            <div className="space-y-1">
              {filteredEdges
                .filter((e) => e.from === node.id || e.to === node.id)
                .slice(0, 3)
                .map((edge, i) => {
                  const isOutgoing = edge.from === node.id
                  const connectedNodeId = isOutgoing ? edge.to : edge.from
                  const connectedNode = filteredNodes.find((n) => n.id === connectedNodeId)

                  return (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        {isOutgoing ? "→" : "←"}
                        <span>{connectedNode?.label}</span>
                      </div>
                      <span>{edge.label}</span>
                    </div>
                  )
                })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Componente de informações da conexão selecionada
  const EdgeInfoPanel = () => {
    if (!selectedEdge) return null

    const sourceNode = filteredNodes.find((n) => n.id === selectedEdge.from)
    const targetNode = filteredNodes.find((n) => n.id === selectedEdge.to)

    if (!sourceNode || !targetNode) return null

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-2 right-2 z-10 bg-white/90 dark:bg-gray-800/90 p-3 rounded-md shadow-md border max-w-xs"
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Transação</h4>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setSelectedEdge(null)}>
              <MinusCircle className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">De:</span>
              <span className="font-medium">{sourceNode.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Para:</span>
              <span className="font-medium">{targetNode.label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Valor:</span>
              <span className="font-medium">{selectedEdge.label}</span>
            </div>
            {selectedEdge.type && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <span className="font-medium capitalize">{selectedEdge.type}</span>
              </div>
            )}
            {selectedEdge.riskScore !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Risco:</span>
                <Badge
                  variant={
                    selectedEdge.riskScore >= 0.7
                      ? "destructive"
                      : selectedEdge.riskScore >= 0.4
                        ? "warning"
                        : "outline"
                  }
                >
                  {selectedEdge.riskScore >= 0.7 ? "Alto" : selectedEdge.riskScore >= 0.4 ? "Médio" : "Baixo"}
                </Badge>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Componente de filtros
  const FilterPanel = () => {
    if (!filterVisible) return null

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute top-12 left-2 z-10 bg-white/90 dark:bg-gray-800/90 p-3 rounded-md shadow-md border"
        >
          <h4 className="font-medium mb-3">Filtros</h4>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nível de Risco</label>
              <div className="flex items-center gap-2">
                <span className="text-xs">Baixo</span>
                <Slider
                  value={[riskThreshold]}
                  min={0}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => setRiskThreshold(value[0])}
                  className="w-32"
                />
                <span className="text-xs">Alto</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Valor Mínimo</label>
              <div className="flex items-center gap-2">
                <span className="text-xs">0</span>
                <Slider
                  value={[valueThreshold]}
                  min={0}
                  max={100000}
                  step={5000}
                  onValueChange={(value) => setValueThreshold(value[0])}
                  className="w-32"
                />
                <span className="text-xs">100k</span>
              </div>
              <div className="text-xs text-right">R$ {valueThreshold.toLocaleString("pt-BR")}</div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Opções de Visualização</label>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showLabels"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showLabels" className="text-xs">
                  Mostrar rótulos
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showValues"
                  checked={showValues}
                  onChange={(e) => setShowValues(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="showValues" className="text-xs">
                  Mostrar valores
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Simulação</label>
              <div className="flex items-center gap-2">
                <Button
                  variant={isSimulating ? "default" : "outline"}
                  size="sm"
                  onClick={toggleSimulation}
                  className="text-xs h-7"
                >
                  {isSimulating ? "Pausar" : "Iniciar"}
                </Button>
                {isSimulating && (
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSimulationSpeed(Math.max(0.5, simulationSpeed - 0.5))}
                      className="h-7 w-7 p-0"
                    >
                      <MinusCircle className="h-3 w-3" />
                    </Button>
                    <span className="text-xs">{simulationSpeed}x</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSimulationSpeed(Math.min(3, simulationSpeed + 0.5))}
                      className="h-7 w-7 p-0"
                    >
                      <PlusCircle className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Componente de legenda
  const LegendPanel = () => {
    if (!legendVisible) return null

    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute top-12 right-2 z-10 bg-white/90 dark:bg-gray-800/90 p-2 rounded-md shadow-sm border"
        >
          <div className="text-xs font-medium mb-1">Legenda</div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
              <span className="text-xs">Sua Empresa</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
              <span className="text-xs">Clientes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
              <span className="text-xs">Fornecedores</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
              <span className="text-xs">Bancos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ec4899]"></div>
              <span className="text-xs">Parceiros</span>
            </div>
            <div className="flex items-center gap-2 mt-1 pt-1 border-t border-gray-200">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
              <span className="text-xs">Alto Risco</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    )
  }

  // Componente de estatísticas
  const StatsPanel = () => {
    return (
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 bg-white/80 dark:bg-gray-800/80 px-3 py-1 rounded-full shadow-sm border text-xs flex items-center gap-4">
        <div>Nós: {filteredNodes.length}</div>
        <div>Conexões: {filteredEdges.length}</div>
        <div>Zoom: {zoom}%</div>
        {realTimeUpdate && (
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Tempo real
          </div>
        )}
      </div>
    )
  }

  // Componente de barra de ferramentas
  const Toolbar = () => {
    return (
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 bg-white/90 dark:bg-gray-800/90 p-1 rounded-full shadow-sm border flex items-center gap-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-8 w-8">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Aumentar zoom</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-8 w-8">
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Diminuir zoom</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleReset} className="h-8 w-8">
                <RotateCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Resetar visualização</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setLegendVisible(!legendVisible)} className="h-8 w-8">
                <Search className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mostrar/ocultar legenda</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={() => setFilterVisible(!filterVisible)} className="h-8 w-8">
                <Filter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mostrar/ocultar filtros</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleExport} className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Exportar visualização</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-8 w-8">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tela cheia</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    )
  }

  // Componente de pesquisa
  const SearchBar = () => {
    return (
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar nó..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-4 py-1 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 w-40"
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative border rounded-md overflow-hidden transition-all duration-300",
        fullscreen ? "fixed inset-0 z-50 border-0 rounded-none" : "",
        className,
      )}
      style={{ height: fullscreen ? "100vh" : "600px" }}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 border-4 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Carregando visualização...</p>
          </div>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <Card className="w-96">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                  <span className="text-red-600 dark:text-red-300 text-xl">!</span>
                </div>
                <h3 className="text-lg font-medium">Erro ao carregar visualização</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
                <Button variant="outline" className="mt-2" onClick={handleReset}>
                  Tentar novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
          <SearchBar />
          <Toolbar />
          <FilterPanel />
          <LegendPanel />
          <NodeInfoPanel />
          <EdgeInfoPanel />
          <StatsPanel />

          <div ref={containerRef} className="w-full h-full">
            <canvas
              ref={canvasRef}
              className="w-full h-full cursor-grab"
              style={{ width: "100%", height: "100%" }}
              onMouseMove={handleMouseMove}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            />
          </div>
        </>
      )}
    </div>
  )
}
