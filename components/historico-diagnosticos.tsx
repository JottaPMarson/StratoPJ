"use client"

import { useState } from "react"
import { CalendarIcon, Download, Filter, Search } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Dados simulados para o histórico de diagnósticos
const historicoData = [
  {
    id: 1,
    data: new Date(2023, 10, 15),
    pontuacao: 78,
    classificacao: "Saudável",
    alertas: 2,
    metricas: {
      liquidez: 1.8,
      endividamento: 0.35,
      rentabilidade: 0.12,
      centralidade: 0.65,
      modularidade: 0.42,
    },
  },
  {
    id: 2,
    data: new Date(2023, 9, 15),
    pontuacao: 72,
    classificacao: "Saudável",
    alertas: 3,
    metricas: {
      liquidez: 1.6,
      endividamento: 0.38,
      rentabilidade: 0.1,
      centralidade: 0.62,
      modularidade: 0.4,
    },
  },
  {
    id: 3,
    data: new Date(2023, 8, 15),
    pontuacao: 65,
    classificacao: "Atenção",
    alertas: 5,
    metricas: {
      liquidez: 1.4,
      endividamento: 0.42,
      rentabilidade: 0.08,
      centralidade: 0.58,
      modularidade: 0.38,
    },
  },
  {
    id: 4,
    data: new Date(2023, 7, 15),
    pontuacao: 60,
    classificacao: "Atenção",
    alertas: 6,
    metricas: {
      liquidez: 1.3,
      endividamento: 0.45,
      rentabilidade: 0.07,
      centralidade: 0.55,
      modularidade: 0.35,
    },
  },
  {
    id: 5,
    data: new Date(2023, 6, 15),
    pontuacao: 55,
    classificacao: "Risco",
    alertas: 8,
    metricas: {
      liquidez: 1.1,
      endividamento: 0.52,
      rentabilidade: 0.05,
      centralidade: 0.48,
      modularidade: 0.3,
    },
  },
  {
    id: 6,
    data: new Date(2023, 5, 15),
    pontuacao: 50,
    classificacao: "Risco",
    alertas: 10,
    metricas: {
      liquidez: 0.9,
      endividamento: 0.58,
      rentabilidade: 0.03,
      centralidade: 0.42,
      modularidade: 0.25,
    },
  },
]

export function HistoricoDiagnosticos() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [isExporting, setIsExporting] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar dados com base na data selecionada e termo de busca
  const filteredData = historicoData.filter((item) => {
    const matchesSearch = item.classificacao.toLowerCase().includes(searchTerm.toLowerCase())

    if (!date) return matchesSearch

    const itemMonth = item.data.getMonth()
    const itemYear = item.data.getFullYear()
    const selectedMonth = date.getMonth()
    const selectedYear = date.getFullYear()

    return itemMonth === selectedMonth && itemYear === selectedYear && matchesSearch
  })

  // Função para exportar dados
  const exportarDados = (formato: string) => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulação de progresso de exportação
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  // Função para carregar mais dados históricos
  const carregarMaisDados = () => {
    setIsLoading(true)
    // Simulação de carregamento
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Histórico de Diagnósticos</CardTitle>
              <CardDescription>Visualize e compare diagnósticos financeiros anteriores</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="w-[200px] pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filtrar</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Filtrar por período</h4>
                    <div className="pt-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "MMMM yyyy", { locale: ptBR }) : <span>Selecione o mês</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={ptBR} />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="tabela" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="tabela">Tabela</TabsTrigger>
              <TabsTrigger value="grafico">Gráfico de Tendência</TabsTrigger>
            </TabsList>

            <TabsContent value="tabela" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Pontuação</TableHead>
                      <TableHead>Classificação</TableHead>
                      <TableHead>Alertas</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{format(item.data, "dd/MM/yyyy")}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{item.pontuacao}</span>
                              <Progress
                                value={item.pontuacao}
                                className="h-2 w-[60px]"
                                indicatorClassName={cn(
                                  item.pontuacao >= 70
                                    ? "bg-green-500"
                                    : item.pontuacao >= 60
                                      ? "bg-yellow-500"
                                      : "bg-red-500",
                                )}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                item.classificacao === "Saudável"
                                  ? "bg-green-100 text-green-800"
                                  : item.classificacao === "Atenção"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800",
                              )}
                            >
                              {item.classificacao}
                            </div>
                          </TableCell>
                          <TableCell>{item.alertas}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Detalhes
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Nenhum registro encontrado para o período selecionado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {filteredData.length > 0 && (
                <div className="flex justify-center">
                  <Button variant="outline" onClick={carregarMaisDados} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <LoadingIndicator className="mr-2" />
                        Carregando...
                      </>
                    ) : (
                      "Carregar mais"
                    )}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="grafico" className="space-y-4">
              <div className="rounded-md border p-4 h-[300px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">Gráfico de tendência de pontuação ao longo do tempo</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    (Implementação do gráfico de linha mostrando a evolução da pontuação)
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Label>Exportar dados</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Exportar dados permite salvar o histórico de diagnósticos em diferentes formatos para análise
                    externa.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex gap-2">
            {isExporting ? (
              <div className="w-full max-w-xs">
                <Progress value={exportProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1 text-right">{exportProgress}%</p>
              </div>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={() => exportarDados("csv")}>
                  <Download className="mr-2 h-4 w-4" />
                  CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportarDados("xlsx")}>
                  <Download className="mr-2 h-4 w-4" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportarDados("pdf")}>
                  <Download className="mr-2 h-4 w-4" />
                  PDF
                </Button>
              </>
            )}
          </div>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
