"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, BarChart2, Download, HelpCircle, Info, Network } from "lucide-react"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Dados simulados para métricas SNA
const metricasSNA = {
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
  densidade: 0.35,
  reciprocidade: 0.28,
  transitividade: 0.45,
  diametro: 3,
  distanciaMedia: 1.8,
}

// Dados simulados para alertas de risco
const alertasRisco = [
  {
    id: 1,
    tipo: "Concentração de Clientes",
    descricao: "60% da receita depende de apenas 2 clientes",
    impacto: "alto",
    recomendacao: "Diversificar base de clientes para reduzir dependência",
    nodes: ["cliente1", "cliente2"],
  },
  {
    id: 2,
    tipo: "Fornecedor Crítico",
    descricao: "Fornecedor X representa 40% dos pagamentos",
    impacto: "médio",
    recomendacao: "Buscar fornecedores alternativos para reduzir dependência",
    nodes: ["fornecedor1"],
  },
  {
    id: 3,
    tipo: "Conexão Indireta",
    descricao: "Cliente A e Fornecedor X possuem relação direta",
    impacto: "baixo",
    recomendacao: "Monitorar esta relação para evitar conflitos de interesse",
    nodes: ["cliente1", "fornecedor1"],
  },
  {
    id: 4,
    tipo: "Cliente de Alto Risco",
    descricao: "Cliente C apresenta histórico de atrasos nos pagamentos",
    impacto: "alto",
    recomendacao: "Revisar termos de pagamento e considerar garantias adicionais",
    nodes: ["cliente3"],
  },
]

// Dados simulados para tendências
const tendenciasSNA = [
  {
    metrica: "Centralidade",
    valores: [0.38, 0.42, 0.45, 0.48, 0.52, 0.55],
    tendencia: "crescente",
    interpretacao: "Aumento da concentração de relacionamentos em poucos nós",
  },
  {
    metrica: "Modularidade",
    valores: [0.52, 0.48, 0.45, 0.42, 0.4, 0.38],
    tendencia: "decrescente",
    interpretacao: "Redução da estrutura de comunidades na rede",
  },
  {
    metrica: "Coesão",
    valores: [0.32, 0.34, 0.35, 0.36, 0.37, 0.38],
    tendencia: "crescente",
    interpretacao: "Aumento gradual da interconexão entre os nós da rede",
  },
]

export function MetricasSNA() {
  const [selectedMetrica, setSelectedMetrica] = useState(null)
  const [isExporting, setIsExporting] = useState(false)

  const getImpactColor = (impact) => {
    if (impact === "baixo") return "bg-green-500"
    if (impact === "médio") return "bg-amber-500"
    if (impact === "alto") return "bg-red-500"
    return "bg-gray-500"
  }

  const getTendenciaColor = (tendencia) => {
    if (tendencia === "crescente") return "text-green-600"
    if (tendencia === "decrescente") return "text-red-600"
    return "text-blue-600"
  }

  const getTendenciaIcon = (tendencia) => {
    if (tendencia === "crescente") return "↗"
    if (tendencia === "decrescente") return "↘"
    return "→"
  }

  const exportarDados = () => {
    setIsExporting(true)

    // Simulando o tempo de processamento da exportação
    setTimeout(() => {
      setIsExporting(false)

      // Simulação de download
      const link = document.createElement("a")
      link.href = "#"
      link.setAttribute("download", `metricas_sna_${new Date().toISOString().slice(0, 10)}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }, 2000)
  }

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-santander-600" />
                Métricas de Análise de Redes Sociais (SNA)
              </CardTitle>
              <CardDescription>
                Indicadores que medem a estrutura e características da sua rede de relacionamentos financeiros
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={exportarDados} disabled={isExporting}>
              {isExporting ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Dados
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>O que são métricas SNA?</AlertTitle>
            <AlertDescription>
              As métricas de Análise de Redes Sociais (SNA) ajudam a entender a estrutura e dinâmica das conexões
              financeiras da sua empresa com clientes, fornecedores e instituições financeiras. Estas métricas são
              fundamentais para identificar riscos e oportunidades nos seus relacionamentos comerciais.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="metricas" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="metricas">Métricas Principais</TabsTrigger>
              <TabsTrigger value="alertas">Alertas de Risco</TabsTrigger>
              <TabsTrigger value="tendencias">Tendências</TabsTrigger>
            </TabsList>

            <TabsContent value="metricas" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        Centralidade
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Mede a importância de cada nó na rede com base em suas conexões diretas e indiretas.
                              Valores mais altos indicam nós mais centrais e influentes.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Badge className="bg-santander-600">
                        {(
                          Object.values(metricasSNA.centralidade).reduce((a, b) => a + b, 0) /
                          Object.values(metricasSNA.centralidade).length
                        ).toFixed(2)}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(metricasSNA.centralidade)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 5)
                        .map(([nodeId, value], index) => (
                          <div
                            key={nodeId}
                            className="flex items-center justify-between cursor-pointer hover:bg-muted/50 p-2 rounded-md transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${nodeId === "empresa" ? "bg-santander-600" : nodeId.includes("cliente") ? "bg-green-500" : nodeId.includes("fornecedor") ? "bg-red-500" : "bg-blue-500"}`}
                              ></div>
                              <span className="text-sm font-medium">
                                {nodeId === "empresa" ? "Sua Empresa" : nodeId}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-muted rounded-full h-2">
                                <div
                                  className="bg-santander-600 h-2 rounded-full"
                                  style={{ width: `${value * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium">{(value * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        Modularidade
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Indica a qualidade da divisão da rede em comunidades ou grupos. Valores mais altos indicam
                              uma estrutura de comunidade mais definida.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Badge className="bg-santander-600">{metricasSNA.modularidade.toFixed(2)}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="relative w-32 h-32">
                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--muted)" strokeWidth="10" />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="10"
                            strokeDasharray={`${2 * Math.PI * 45 * metricasSNA.modularidade} ${2 * Math.PI * 45 * (1 - metricasSNA.modularidade)}`}
                            strokeDashoffset="0"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold">{(metricasSNA.modularidade * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4 text-center">
                        {metricasSNA.modularidade < 0.3
                          ? "Baixa modularidade: rede pouco estruturada em comunidades"
                          : metricasSNA.modularidade < 0.6
                            ? "Modularidade média: algumas comunidades identificáveis"
                            : "Alta modularidade: rede bem estruturada em comunidades distintas"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        Coesão
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              Mede o quão conectados estão os nós da rede entre si. Valores mais altos indicam uma rede
                              mais densa e interconectada.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Badge className="bg-santander-600">{metricasSNA.coesao.toFixed(2)}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="relative w-32 h-32">
                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="var(--muted)" strokeWidth="10" />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="10"
                            strokeDasharray={`${2 * Math.PI * 45 * metricasSNA.coesao} ${2 * Math.PI * 45 * (1 - metricasSNA.coesao)}`}
                            strokeDashoffset="0"
                            transform="rotate(-90 50 50)"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold">{(metricasSNA.coesao * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-4 text-center">
                        {metricasSNA.coesao < 0.3
                          ? "Baixa coesão: rede fragmentada com poucas conexões"
                          : metricasSNA.coesao < 0.6
                            ? "Coesão média: rede moderadamente conectada"
                            : "Alta coesão: rede densamente conectada"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Métricas Adicionais</CardTitle>
                  <CardDescription>Outros indicadores importantes para análise da rede</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium flex items-center gap-1">
                          Densidade
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Proporção de conexões existentes em relação ao total possível</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <span className="text-sm font-medium">{metricasSNA.densidade}</span>
                      </div>
                      <Progress value={metricasSNA.densidade * 100} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium flex items-center gap-1">
                          Reciprocidade
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Proporção de conexões mútuas na rede</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <span className="text-sm font-medium">{metricasSNA.reciprocidade}</span>
                      </div>
                      <Progress value={metricasSNA.reciprocidade * 100} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium flex items-center gap-1">
                          Transitividade
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Tendência de formação de triângulos na rede</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <span className="text-sm font-medium">{metricasSNA.transitividade}</span>
                      </div>
                      <Progress value={metricasSNA.transitividade * 100} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium flex items-center gap-1">
                          Distância Média
                          <Tooltip>
                            <TooltipTrigger>
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Número médio de passos entre quaisquer dois nós</p>
                            </TooltipContent>
                          </Tooltip>
                        </h3>
                        <span className="text-sm font-medium">{metricasSNA.distanciaMedia}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">1</span>
                        <Progress
                          value={(metricasSNA.distanciaMedia / 6) * 100}
                          className="h-2 flex-1"
                          indicatorClassName="bg-blue-500"
                        />
                        <span className="text-xs text-muted-foreground">6</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Interpretação das Métricas</CardTitle>
                  <CardDescription>O que estas métricas significam para o seu negócio</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border p-4 bg-muted/30">
                    <h3 className="font-medium">Centralidade</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sua empresa possui uma centralidade de 100%, o que é esperado já que ela é o ponto focal da rede.
                      O Cliente A (75%) e o Fornecedor X (68%) possuem alta centralidade, indicando que são parceiros
                      estratégicos importantes. Considere fortalecer esses relacionamentos, mas também diversificar para
                      reduzir dependências.
                    </p>
                  </div>

                  <div className="rounded-lg border p-4 bg-muted/30">
                    <h3 className="font-medium">Modularidade</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      A modularidade de 42% indica que sua rede tem algumas comunidades identificáveis, mas não está
                      fortemente segmentada. Isso pode ser positivo para a flexibilidade do negócio, mas também sugere
                      que você poderia desenvolver ecossistemas mais coesos em torno de linhas de negócio específicas.
                    </p>
                  </div>

                  <div className="rounded-lg border p-4 bg-muted/30">
                    <h3 className="font-medium">Coesão</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      A coesão de 38% indica uma rede moderadamente conectada. Isso sugere que existem oportunidades
                      para criar mais conexões entre seus parceiros de negócio, potencialmente gerando sinergias e novas
                      oportunidades de negócio. Considere organizar eventos de networking ou programas de parceria para
                      aumentar a coesão da rede.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alertas" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-santander-600" />
                    Alertas de Risco na Rede
                  </CardTitle>
                  <CardDescription>
                    Pontos de atenção identificados na análise da sua rede de relacionamentos financeiros
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {alertasRisco.map((risco) => (
                    <div key={risco.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          {risco.tipo}
                        </h3>
                        <Badge className={getImpactColor(risco.impacto)}>
                          Impacto {risco.impacto.charAt(0).toUpperCase() + risco.impacto.slice(1)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{risco.descricao}</p>
                      <div className="bg-muted/30 p-3 rounded-md">
                        <p className="text-sm font-medium">Recomendação:</p>
                        <p className="text-sm">{risco.recomendacao}</p>
                      </div>
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Nós envolvidos:</span>
                          <div className="flex gap-1">
                            {risco.nodes.map((node) => (
                              <Badge key={node} variant="outline">
                                {node}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <BarChart2 className="mr-2 h-4 w-4" />
                    Visualizar na Rede
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estratégias de Mitigação</CardTitle>
                  <CardDescription>Recomendações para reduzir os riscos identificados</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Diversificação de Clientes</h3>
                      <p className="text-sm text-muted-foreground">
                        Desenvolva estratégias para ampliar sua base de clientes, reduzindo a dependência de poucos
                        clientes de alto valor. Considere explorar novos mercados ou segmentos.
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Múltiplos Fornecedores</h3>
                      <p className="text-sm text-muted-foreground">
                        Identifique fornecedores alternativos para insumos críticos, estabelecendo relacionamentos com
                        múltiplas fontes para reduzir riscos de fornecimento.
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <h3 className="font-medium mb-2">Monitoramento de Conexões</h3>
                      <p className="text-sm text-muted-foreground">
                        Implemente um sistema de monitoramento para acompanhar mudanças nas relações entre seus
                        parceiros de negócio, identificando potenciais conflitos de interesse.
                      </p>
                    </div>
                  </div>

                  <Alert className="bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-900/30">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Atenção</AlertTitle>
                    <AlertDescription>
                      A concentração de 60% da receita em apenas 2 clientes representa um risco significativo para a
                      continuidade do negócio. Recomendamos priorizar a diversificação da base de clientes.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tendencias" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tendências das Métricas SNA</CardTitle>
                  <CardDescription>Evolução das métricas ao longo dos últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {tendenciasSNA.map((tendencia, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium flex items-center gap-2">
                            {tendencia.metrica}
                            <Tooltip>
                              <TooltipTrigger>
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{tendencia.interpretacao}</p>
                              </TooltipContent>
                            </Tooltip>
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${getTendenciaColor(tendencia.tendencia)}`}>
                              {getTendenciaIcon(tendencia.tendencia)} {tendencia.tendencia}
                            </span>
                            <Badge variant="outline">
                              {(
                                ((tendencia.valores[tendencia.valores.length - 1] - tendencia.valores[0]) /
                                  tendencia.valores[0]) *
                                100
                              ).toFixed(1)}
                              %
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 h-8">
                          {tendencia.valores.map((valor, i) => (
                            <div key={i} className="flex flex-col items-center flex-1">
                              <div className="w-full px-1">
                                <div
                                  className="bg-santander-600 rounded-sm"
                                  style={{ height: `${valor * 100}px`, maxHeight: "40px" }}
                                ></div>
                              </div>
                              <span className="text-xs text-muted-foreground mt-1">M{i + 1}</span>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <p className="text-sm text-muted-foreground">
                    As tendências são calculadas com base nos dados dos últimos 6 meses. Valores mais recentes têm maior
                    peso na análise.
                  </p>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Network className="mr-2 h-4 w-4" />
            Visualizar Métricas na Rede
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
