"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TooltipInfo } from "@/components/ui/tooltip-info"
import { Download, Calendar, Clock, CheckCircle, Eye, ArrowUpRight, X } from "lucide-react"
import { motion } from "framer-motion"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Badge } from "@/components/ui/badge"

export default function RelatoriosPage() {
  const [selectedSections, setSelectedSections] = useState<string[]>([
    "resumo",
    "fluxo_caixa",
    "indicadores",
    "graficos",
  ])
  const [formato, setFormato] = useState("pdf")
  const [agendado, setAgendado] = useState(false)
  const [periodo, setPeriodo] = useState("ultimo_mes")
  const [email, setEmail] = useState("")
  const [frequencia, setFrequencia] = useState("mensal")
  const [showPreview, setShowPreview] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [customDateRange, setCustomDateRange] = useState(false)
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() - 1)))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [exportProgress, setExportProgress] = useState(0)
  const [previewReady, setPreviewReady] = useState(false)
  const [showExportOptions, setShowExportOptions] = useState(false)

  const previewRef = useRef(null)

  const toggleSection = (section: string) => {
    if (selectedSections.includes(section)) {
      setSelectedSections(selectedSections.filter((s) => s !== section))
    } else {
      setSelectedSections([...selectedSections, section])
    }
  }

  const handleSelectAll = () => {
    const allSections = [
      "resumo",
      "fluxo_caixa",
      "indicadores",
      "graficos",
      "analise_redes",
      "recomendacoes",
      "comparativo_setor",
    ]
    setSelectedSections(allSections)
  }

  const handleDeselectAll = () => {
    setSelectedSections([])
  }

  const handlePeriodoChange = (value) => {
    setPeriodo(value)
    setCustomDateRange(value === "personalizado")
  }

  const handlePreview = () => {
    setPreviewReady(false)
    setShowPreview(true)

    // Simulando o tempo de carregamento da pré-visualização
    setTimeout(() => {
      setPreviewReady(true)
    }, 1500)
  }

  const handleGenerateReport = () => {
    setIsGenerating(true)
    setExportProgress(0)

    // Simulando o progresso da geração do relatório
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setShowSuccess(true)

          // Fechar a mensagem de sucesso após 3 segundos
          setTimeout(() => {
            setShowSuccess(false)
          }, 3000)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const handleScheduleReport = () => {
    setIsGenerating(true)
    setExportProgress(0)

    // Simulando o progresso do agendamento
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setShowSuccess(true)

          // Fechar a mensagem de sucesso após 3 segundos
          setTimeout(() => {
            setShowSuccess(false)
          }, 3000)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const getSectionIcon = (section) => {
    switch (section) {
      case "resumo":
        return "📊"
      case "fluxo_caixa":
        return "💰"
      case "indicadores":
        return "📈"
      case "graficos":
        return "📉"
      case "analise_redes":
        return "🔄"
      case "recomendacoes":
        return "💡"
      case "comparativo_setor":
        return "⚖️"
      default:
        return "📄"
    }
  }

  const getSectionTitle = (section) => {
    switch (section) {
      case "resumo":
        return "Resumo Executivo"
      case "fluxo_caixa":
        return "Fluxo de Caixa"
      case "indicadores":
        return "Indicadores Financeiros"
      case "graficos":
        return "Gráficos e Visualizações"
      case "analise_redes":
        return "Análise de Redes"
      case "recomendacoes":
        return "Recomendações"
      case "comparativo_setor":
        return "Comparativo Setorial"
      default:
        return section
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Relatórios</h1>
        </div>

        {showSuccess && (
          <Alert className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertTitle>{agendado ? "Relatório agendado com sucesso!" : "Relatório gerado com sucesso!"}</AlertTitle>
            </div>
            <AlertDescription>
              {agendado
                ? `O relatório será enviado para ${email} com frequência ${frequencia}.`
                : `O relatório foi gerado no formato ${formato.toUpperCase()} e está disponível para download.`}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="gerar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="gerar">Gerar Relatório</TabsTrigger>
            <TabsTrigger value="historico">Histórico</TabsTrigger>
            <TabsTrigger value="agendados">Agendados</TabsTrigger>
          </TabsList>

          <TabsContent value="gerar" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurar Relatório</CardTitle>
                    <CardDescription>Selecione as seções e o formato do relatório que deseja gerar</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">Seções do Relatório</h3>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm" onClick={handleSelectAll}>
                            Selecionar Todos
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleDeselectAll}>
                            Limpar
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="resumo"
                              checked={selectedSections.includes("resumo")}
                              onCheckedChange={() => toggleSection("resumo")}
                            />
                            <Label htmlFor="resumo" className="flex items-center gap-2">
                              Resumo Executivo
                              <TooltipInfo content="Visão geral dos principais indicadores financeiros" />
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="fluxo_caixa"
                              checked={selectedSections.includes("fluxo_caixa")}
                              onCheckedChange={() => toggleSection("fluxo_caixa")}
                            />
                            <Label htmlFor="fluxo_caixa" className="flex items-center gap-2">
                              Fluxo de Caixa
                              <TooltipInfo content="Detalhamento de entradas e saídas no período" />
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="indicadores"
                              checked={selectedSections.includes("indicadores")}
                              onCheckedChange={() => toggleSection("indicadores")}
                            />
                            <Label htmlFor="indicadores" className="flex items-center gap-2">
                              Indicadores Financeiros
                              <TooltipInfo content="Métricas como ROI, margem de lucro e liquidez" />
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="graficos"
                              checked={selectedSections.includes("graficos")}
                              onCheckedChange={() => toggleSection("graficos")}
                            />
                            <Label htmlFor="graficos" className="flex items-center gap-2">
                              Gráficos e Visualizações
                              <TooltipInfo content="Representações visuais dos dados financeiros" />
                            </Label>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="analise_redes"
                              checked={selectedSections.includes("analise_redes")}
                              onCheckedChange={() => toggleSection("analise_redes")}
                            />
                            <Label htmlFor="analise_redes" className="flex items-center gap-2">
                              Análise de Redes
                              <TooltipInfo content="Mapeamento de relacionamentos comerciais" />
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="recomendacoes"
                              checked={selectedSections.includes("recomendacoes")}
                              onCheckedChange={() => toggleSection("recomendacoes")}
                            />
                            <Label htmlFor="recomendacoes" className="flex items-center gap-2">
                              Recomendações
                              <TooltipInfo content="Sugestões baseadas na análise dos dados" />
                            </Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="comparativo_setor"
                              checked={selectedSections.includes("comparativo_setor")}
                              onCheckedChange={() => toggleSection("comparativo_setor")}
                            />
                            <Label htmlFor="comparativo_setor" className="flex items-center gap-2">
                              Comparativo Setorial
                              <TooltipInfo content="Comparação com médias do setor" />
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-sm font-medium">Formato e Período</h3>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="formato">Formato do Relatório</Label>
                          <Select value={formato} onValueChange={setFormato}>
                            <SelectTrigger id="formato">
                              <SelectValue placeholder="Selecione o formato" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pdf">PDF</SelectItem>
                              <SelectItem value="excel">Excel</SelectItem>
                              <SelectItem value="csv">CSV</SelectItem>
                              <SelectItem value="pptx">PowerPoint</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="periodo">Período</Label>
                          <Select value={periodo} onValueChange={handlePeriodoChange}>
                            <SelectTrigger id="periodo">
                              <SelectValue placeholder="Selecione o período" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ultimo_mes">Último Mês</SelectItem>
                              <SelectItem value="ultimo_trimestre">Último Trimestre</SelectItem>
                              <SelectItem value="ultimo_semestre">Último Semestre</SelectItem>
                              <SelectItem value="ultimo_ano">Último Ano</SelectItem>
                              <SelectItem value="personalizado">Personalizado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {customDateRange && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="grid gap-4 sm:grid-cols-2"
                        >
                          <div className="space-y-2">
                            <Label>Data Inicial</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {startDate ? format(startDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={startDate}
                                  onSelect={setStartDate}
                                  initialFocus
                                  locale={ptBR}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                          <div className="space-y-2">
                            <Label>Data Final</Label>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  {endDate ? format(endDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <CalendarComponent
                                  mode="single"
                                  selected={endDate}
                                  onSelect={setEndDate}
                                  initialFocus
                                  locale={ptBR}
                                  disabled={(date) => date < startDate || date > new Date()}
                                />
                              </PopoverContent>
                            </Popover>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agendar"
                          checked={agendado}
                          onCheckedChange={(checked) => setAgendado(checked === true)}
                        />
                        <Label htmlFor="agendar" className="font-medium">
                          Agendar envio periódico
                        </Label>
                      </div>

                      {agendado && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-4 pl-6"
                        >
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="email">E-mail para envio</Label>
                              <Input
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="frequencia">Frequência</Label>
                              <Select value={frequencia} onValueChange={setFrequencia}>
                                <SelectTrigger id="frequencia">
                                  <SelectValue placeholder="Selecione a frequência" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="semanal">Semanal</SelectItem>
                                  <SelectItem value="quinzenal">Quinzenal</SelectItem>
                                  <SelectItem value="mensal">Mensal</SelectItem>
                                  <SelectItem value="trimestral">Trimestral</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePreview}>
                      <Eye className="mr-2 h-4 w-4" />
                      Pré-visualizar
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowExportOptions(true)}>
                        <Download className="mr-2 h-4 w-4" />
                        Opções de Exportação
                      </Button>
                      <Button
                        className="bg-santander-600 hover:bg-santander-700"
                        onClick={agendado ? handleScheduleReport : handleGenerateReport}
                        disabled={isGenerating || selectedSections.length === 0}
                      >
                        {isGenerating ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                            {agendado ? "Agendando..." : "Gerando..."}
                          </>
                        ) : agendado ? (
                          "Agendar Relatório"
                        ) : (
                          "Gerar Relatório"
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Pré-visualização</CardTitle>
                    <CardDescription>Veja como ficará seu relatório</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
                    <div className="w-full max-w-[200px] aspect-[3/4] bg-muted rounded-md border flex flex-col">
                      <div className="h-1/6 bg-santander-600 rounded-t-md p-2">
                        <div className="h-2 w-20 bg-white rounded-full opacity-70" />
                      </div>
                      <div className="flex-1 p-3 space-y-2">
                        {selectedSections.includes("resumo") && (
                          <div className="h-2 w-full bg-muted-foreground/20 rounded-full" />
                        )}
                        {selectedSections.includes("fluxo_caixa") && (
                          <div className="h-8 w-full bg-muted-foreground/20 rounded-md" />
                        )}
                        {selectedSections.includes("indicadores") && (
                          <div className="h-4 w-full bg-muted-foreground/20 rounded-md" />
                        )}
                        {selectedSections.includes("graficos") && (
                          <div className="h-12 w-full bg-muted-foreground/20 rounded-md" />
                        )}
                        {selectedSections.includes("analise_redes") && (
                          <div className="h-10 w-full bg-muted-foreground/20 rounded-md" />
                        )}
                        {selectedSections.includes("recomendacoes") && (
                          <div className="h-6 w-full bg-muted-foreground/20 rounded-md" />
                        )}
                        {selectedSections.includes("comparativo_setor") && (
                          <div className="h-8 w-full bg-muted-foreground/20 rounded-md" />
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">{selectedSections.length} seções selecionadas</p>
                      <p className="text-xs text-muted-foreground">Formato: {formato.toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Período:{" "}
                        {customDateRange
                          ? `${startDate ? format(startDate, "dd/MM/yyyy") : "?"} a ${endDate ? format(endDate, "dd/MM/yyyy") : "?"}`
                          : periodo.replace("_", " ")}
                      </p>
                    </div>
                  </CardContent>
                  {isGenerating && (
                    <CardFooter>
                      <div className="w-full space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Progresso</span>
                          <span>{exportProgress}%</span>
                        </div>
                        <Progress value={exportProgress} className="h-2" />
                      </div>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historico" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Relatórios</CardTitle>
                <CardDescription>Relatórios gerados anteriormente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 border-b bg-muted/50">
                    <div className="p-2 font-medium">Data</div>
                    <div className="p-2 font-medium">Tipo</div>
                    <div className="p-2 font-medium">Período</div>
                    <div className="p-2 font-medium">Formato</div>
                    <div className="p-2 font-medium">Ações</div>
                  </div>
                  <div>
                    <div className="grid grid-cols-5 border-b">
                      <div className="p-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>15/05/2023</span>
                      </div>
                      <div className="p-2">Relatório Completo</div>
                      <div className="p-2">Último Mês</div>
                      <div className="p-2">
                        <Badge variant="outline">PDF</Badge>
                      </div>
                      <div className="p-2">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Visualizar</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 border-b">
                      <div className="p-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>01/04/2023</span>
                      </div>
                      <div className="p-2">Fluxo de Caixa</div>
                      <div className="p-2">Último Trimestre</div>
                      <div className="p-2">
                        <Badge variant="outline">Excel</Badge>
                      </div>
                      <div className="p-2">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Visualizar</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-5">
                      <div className="p-2 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>15/03/2023</span>
                      </div>
                      <div className="p-2">Análise de Redes</div>
                      <div className="p-2">Último Semestre</div>
                      <div className="p-2">
                        <Badge variant="outline">PDF</Badge>
                      </div>
                      <div className="p-2">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">Visualizar</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Mostrando 3 de 15 relatórios</div>
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="agendados" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatórios Agendados</CardTitle>
                <CardDescription>Relatórios configurados para geração automática</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 border-b bg-muted/50">
                    <div className="p-2 font-medium">Nome</div>
                    <div className="p-2 font-medium">Frequência</div>
                    <div className="p-2 font-medium">Próximo Envio</div>
                    <div className="p-2 font-medium">Destinatário</div>
                    <div className="p-2 font-medium">Ações</div>
                  </div>
                  <div>
                    <div className="grid grid-cols-5 border-b">
                      <div className="p-2">Relatório Mensal</div>
                      <div className="p-2 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Mensal</span>
                      </div>
                      <div className="p-2">01/06/2023</div>
                      <div className="p-2">financeiro@empresa.com</div>
                      <div className="p-2 flex gap-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Visualizar</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">Mostrando 1 de 1 relatórios agendados</div>
                <Button variant="outline" size="sm">
                  Gerenciar Agendamentos
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {showPreview && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div
              className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto"
              ref={previewRef}
            >
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold">Pré-visualização do Relatório</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                {!previewReady ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4" />
                    <p className="text-muted-foreground">Carregando pré-visualização...</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {selectedSections.map((section) => (
                      <div key={section} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{getSectionIcon(section)}</span>
                          <h3 className="text-xl font-bold">{getSectionTitle(section)}</h3>
                        </div>
                        <div className="pl-8 space-y-4">
                          {section === "resumo" && (
                            <div className="space-y-4">
                              <p className="text-muted-foreground">
                                Resumo executivo dos principais indicadores financeiros do período.
                              </p>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="border rounded-lg p-4">
                                  <div className="text-sm text-muted-foreground">Receita Total</div>
                                  <div className="text-2xl font-bold">R$ 125.430,00</div>
                                  <div className="text-sm text-green-500 flex items-center gap-1">
                                    <ArrowUpRight className="h-3 w-3" />
                                    <span>+12,5%</span>
                                  </div>
                                </div>
                                <div className="border rounded-lg p-4">
                                  <div className="text-sm text-muted-foreground">Despesas</div>
                                  <div className="text-2xl font-bold">R$ 98.750,00</div>
                                  <div className="text-sm text-red-500 flex items-center gap-1">
                                    <ArrowUpRight className="h-3 w-3" />
                                    <span>+8,2%</span>
                                  </div>
                                </div>
                                <div className="border rounded-lg p-4">
                                  <div className="text-sm text-muted-foreground">Lucro Líquido</div>
                                  <div className="text-2xl font-bold">R$ 26.680,00</div>
                                  <div className="text-sm text-green-500 flex items-center gap-1">
                                    <ArrowUpRight className="h-3 w-3" />
                                    <span>+15,3%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {section === "fluxo_caixa" && (
                            <div className="space-y-4">
                              <p className="text-muted-foreground">Detalhamento de entradas e saídas no período.</p>
                              <div className="h-64 border rounded-lg p-4 flex items-center justify-center bg-muted/30">
                                <p className="text-muted-foreground">Gráfico de Fluxo de Caixa</p>
                              </div>
                            </div>
                          )}
                          {section === "indicadores" && (
                            <div className="space-y-4">
                              <p className="text-muted-foreground">
                                Principais indicadores financeiros e sua evolução.
                              </p>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="border rounded-lg p-4">
                                  <div className="text-sm text-muted-foreground">ROI</div>
                                  <div className="text-2xl font-bold">18,5%</div>
                                  <div className="text-sm text-green-500 flex items-center gap-1">
                                    <ArrowUpRight className="h-3 w-3" />
                                    <span>+2,3%</span>
                                  </div>
                                </div>
                                <div className="border rounded-lg p-4">
                                  <div className="text-sm text-muted-foreground">Margem de Lucro</div>
                                  <div className="text-2xl font-bold">21,3%</div>
                                  <div className="text-sm text-green-500 flex items-center gap-1">
                                    <ArrowUpRight className="h-3 w-3" />
                                    <span>+1,5%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          {section === "graficos" && (
                            <div className="space-y-4">
                              <p className="text-muted-foreground">Visualizações gráficas dos dados financeiros.</p>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="h-48 border rounded-lg p-4 flex items-center justify-center bg-muted/30">
                                  <p className="text-muted-foreground">Gráfico de Receitas</p>
                                </div>
                                <div className="h-48 border rounded-lg p-4 flex items-center justify-center bg-muted/30">
                                  <p className="text-muted-foreground">Gráfico de Despesas</p>
                                </div>
                              </div>
                            </div>
                          )}
                          {section === "analise_redes" && (
                            <div className="space-y-4">
                              <p className="text-muted-foreground">
                                Análise de relacionamentos comerciais e financeiros.
                              </p>
                              <div className="h-64 border rounded-lg p-4 flex items-center justify-center bg-muted/30">
                                <p className="text-muted-foreground">Visualização da Rede de Relacionamentos</p>
                              </div>
                            </div>
                          )}
                          {section === "recomendacoes" && (
                            <div className="space-y-4">
                              <p className="text-muted-foreground">Recomendações baseadas na análise dos dados.</p>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5 text-green-500">
                                    <CheckCircle className="h-4 w-4" />
                                  </div>
                                  <p>
                                    Considere aumentar o investimento em marketing digital, que mostrou um ROI de 25% no
                                    último trimestre.
                                  </p>
                                </div>
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5 text-green-500">
                                    <CheckCircle className="h-4 w-4" />
                                  </div>
                                  <p>
                                    Revise os contratos com os fornecedores A e B para obter melhores condições de
                                    pagamento.
                                  </p>
                                </div>
                                <div className="flex items-start gap-2">
                                  <div className="mt-0.5 text-green-500">
                                    <CheckCircle className="h-4 w-4" />
                                  </div>
                                  <p>
                                    Implemente um programa de fidelidade para os clientes que representam 80% da sua
                                    receita.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                          {section === "comparativo_setor" && (
                            <div className="space-y-4">
                              <p className="text-muted-foreground">Comparação com médias do setor.</p>
                              <div className="h-64 border rounded-lg p-4 flex items-center justify-center bg-muted/30">
                                <p className="text-muted-foreground">Gráfico Comparativo Setorial</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4 border-t flex justify-end">
                <Button variant="outline" onClick={() => setShowPreview(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        )}

        {showExportOptions && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background rounded-lg shadow-lg w-full max-w-md">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold">Opções de Exportação</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowExportOptions(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>Qualidade da Exportação</Label>
                  <Select defaultValue="media">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a qualidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa (menor tamanho)</SelectItem>
                      <SelectItem value="media">Média (recomendado)</SelectItem>
                      <SelectItem value="alta">Alta (maior tamanho)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Incluir Marca d'água</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="marca_agua" />
                    <Label htmlFor="marca_agua">Adicionar marca d'água com logo da empresa</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Opções de Segurança</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="proteger_senha" />
                    <Label htmlFor="proteger_senha">Proteger com senha</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Metadados</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="incluir_metadados" defaultChecked />
                    <Label htmlFor="incluir_metadados">Incluir metadados do relatório</Label>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t flex justify-between">
                <Button variant="outline" onClick={() => setShowExportOptions(false)}>
                  Cancelar
                </Button>
                <Button
                  className="bg-santander-600 hover:bg-santander-700"
                  onClick={() => {
                    setShowExportOptions(false)
                    handleGenerateReport()
                  }}
                >
                  Aplicar e Exportar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
