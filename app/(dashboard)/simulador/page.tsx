"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { TooltipInfo } from "@/components/ui/tooltip-info"
import { Download, Save, RefreshCw, ArrowRight, CheckCircle, BarChart2, Info, AlertCircle } from "lucide-react"

// Interfaces para tipagem
interface SimulacaoAnterior {
  receita: number
  despesa: number
  investimento: number
  taxaJuros: number
  periodo: number
  saldoFinal: number
  crescimentoPercentual: string
  projecao: any[]
  taxaCrescimentoReceita?: number
  taxaCrescimentoDespesa?: number
}

interface CenarioSalvo {
  id: number
  nome: string
  descricao: string
  receita: number
  despesa: number
  investimento: number
  taxaJuros: number
  periodo: number
  taxaCrescimentoReceita: number
  taxaCrescimentoDespesa: number
  saldoFinal: number
  crescimentoPercentual: string
  data: string
}

interface ImpactoSimulacao {
  saldoFinalDiferenca: number
  crescimentoDiferenca: number
  mesesPositivos: number
  retornoInvestimentoTotal: number
}
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  ReferenceLine,
} from "recharts"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export default function SimuladorPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [receita, setReceita] = useState(64000)
  const [despesa, setDespesa] = useState(42000)
  const [investimento, setInvestimento] = useState(10000)
  const [taxaJuros, setTaxaJuros] = useState(12)
  const [periodo, setPeriodo] = useState(12)
  const [cenarioAtivo, setCenarioAtivo] = useState("personalizado")
  const [cenariosSalvos, setCenariosSalvos] = useState<CenarioSalvo[]>([])
  const [comparandoCenarios, setComparandoCenarios] = useState(false)
  const [saldoFinal, setSaldoFinal] = useState(0)
  const [crescimentoPercentual, setCrescimentoPercentual] = useState("0")
  const [simulacaoAnterior, setSimulacaoAnterior] = useState<SimulacaoAnterior | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [nomeCenario, setNomeCenario] = useState("")
  const [descricaoCenario, setDescricaoCenario] = useState("")
  const [taxaCrescimentoReceita, setTaxaCrescimentoReceita] = useState(2)
  const [taxaCrescimentoDespesa, setTaxaCrescimentoDespesa] = useState(1.5)
  const [showImpactoDialog, setShowImpactoDialog] = useState(false)
  const [impactoSimulacao, setImpactoSimulacao] = useState<ImpactoSimulacao | null>(null)
  const [isSimulando, setIsSimulando] = useState(false)

  // Referência para o gráfico
  const chartRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Aplicar cenário pré-configurado
  const aplicarCenario = (tipo: string) => {
    // Guardar simulação anterior para comparação
    setSimulacaoAnterior({
      receita,
      despesa,
      investimento,
      taxaJuros,
      periodo,
      saldoFinal,
      crescimentoPercentual,
      projecao: calcularProjecao(
        receita,
        despesa,
        investimento,
        taxaJuros,
        periodo,
        taxaCrescimentoReceita,
        taxaCrescimentoDespesa,
      ),
    })

    setCenarioAtivo(tipo)

    switch (tipo) {
      case "crise":
        setReceita(45000)
        setDespesa(40000)
        setInvestimento(5000)
        setTaxaJuros(8)
        setTaxaCrescimentoReceita(0.5)
        setTaxaCrescimentoDespesa(1.8)
        break
      case "expansao":
        setReceita(80000)
        setDespesa(60000)
        setInvestimento(20000)
        setTaxaJuros(15)
        setTaxaCrescimentoReceita(3.5)
        setTaxaCrescimentoDespesa(2.2)
        break
      case "reducao":
        setReceita(64000)
        setDespesa(32000)
        setInvestimento(15000)
        setTaxaJuros(10)
        setTaxaCrescimentoReceita(1.8)
        setTaxaCrescimentoDespesa(0.8)
        break
      default:
        // Manter valores atuais
        break
    }
  }

  // Calcular projeção financeira com parâmetros específicos
  const calcularProjecao = (
    receitaInicial: number,
    despesaInicial: number,
    investimentoInicial: number,
    taxaJurosParam: number,
    periodoParam: number,
    taxaCrescReceitaParam: number,
    taxaCrescDespesaParam: number,
  ) => {
    const projecao = []
    let saldoAtual = receitaInicial - despesaInicial
    let receitaAcumulada = receitaInicial
    let despesaAcumulada = despesaInicial
    let investimentoAcumulado = investimentoInicial

    for (let i = 0; i < periodoParam; i++) {
      const mes = i + 1

      // Cálculo mais realista de crescimento de receita e despesa
      const receitaMensal: number = i === 0 ? receitaInicial : projecao[i - 1].receita * (1 + taxaCrescReceitaParam / 100)

      const despesaMensal: number = i === 0 ? despesaInicial : projecao[i - 1].despesa * (1 + taxaCrescDespesaParam / 100)

      const saldoMensal = receitaMensal - despesaMensal

      // Cálculo de investimento e retorno
      const retornoInvestimento = investimentoAcumulado * (taxaJurosParam / 100 / 12)
      investimentoAcumulado += retornoInvestimento

      // Acumular valores
      receitaAcumulada += receitaMensal
      despesaAcumulada += despesaMensal
      saldoAtual += saldoMensal + retornoInvestimento

      projecao.push({
        mes: `Mês ${mes}`,
        receita: Math.round(receitaMensal),
        despesa: Math.round(despesaMensal),
        saldo: Math.round(saldoAtual),
        investimento: Math.round(investimentoAcumulado),
        retorno: Math.round(retornoInvestimento),
      })
    }

    return projecao
  }

  // Dados da projeção atual
  const projecaoData = calcularProjecao(
    receita,
    despesa,
    investimento,
    taxaJuros,
    periodo,
    taxaCrescimentoReceita,
    taxaCrescimentoDespesa,
  )

  // Calcular métricas
  useEffect(() => {
    if (projecaoData.length > 0) {
      const finalSaldo = projecaoData[projecaoData.length - 1].saldo
      const saldoInicial = receita - despesa
      const crescimento = (((finalSaldo - saldoInicial) / Math.abs(saldoInicial)) * 100).toFixed(1)

      setSaldoFinal(finalSaldo)
      setCrescimentoPercentual(crescimento)
    }
  }, [projecaoData, receita, despesa])

  // Dados para comparação de cenários
  const dadosComparacao = [
    {
      nome: "Atual",
      saldoFinal: saldoFinal,
      crescimento: Number(crescimentoPercentual),
      cor: "#ec0000",
      receita: receita,
      despesa: despesa,
      investimento: investimento,
    },
  ]

  if (simulacaoAnterior) {
    dadosComparacao.unshift({
      nome: "Anterior",
      saldoFinal: simulacaoAnterior.saldoFinal,
      crescimento: Number(simulacaoAnterior.crescimentoPercentual),
      cor: "#60a5fa",
      receita: simulacaoAnterior.receita,
      despesa: simulacaoAnterior.despesa,
      investimento: simulacaoAnterior.investimento,
    })
  }

  // Calcular retorno sobre investimento
  const retornoInvestimento = (investimento * Math.pow(1 + taxaJuros / 100 / 12, periodo) - investimento).toFixed(2)

  // Salvar cenário atual
  const salvarCenario = () => {
    const novoCenario = {
      id: Date.now(),
      nome: nomeCenario || `Cenário ${cenariosSalvos.length + 1}`,
      descricao: descricaoCenario,
      receita,
      despesa,
      investimento,
      taxaJuros,
      periodo,
      taxaCrescimentoReceita,
      taxaCrescimentoDespesa,
      saldoFinal,
      crescimentoPercentual,
      data: new Date().toLocaleDateString("pt-BR"),
    }

    setCenariosSalvos([...cenariosSalvos, novoCenario])
    setShowSaveDialog(false)
    setNomeCenario("")
    setDescricaoCenario("")
  }

  // Aplicar simulação
  const aplicarSimulacao = () => {
    setIsSimulando(true)

    // Guardar simulação anterior para comparação
    setSimulacaoAnterior({
      receita,
      despesa,
      investimento,
      taxaJuros,
      periodo,
      saldoFinal,
      crescimentoPercentual,
      projecao: [...projecaoData],
    })

    // Calcular impacto da simulação
    setTimeout(() => {
      const novaProjecao = calcularProjecao(
        receita,
        despesa,
        investimento,
        taxaJuros,
        periodo,
        taxaCrescimentoReceita,
        taxaCrescimentoDespesa,
      )

      const impacto = {
        saldoFinalDiferenca: saldoFinal - (simulacaoAnterior?.saldoFinal || 0),
        crescimentoDiferenca: Number(crescimentoPercentual) - (Number(simulacaoAnterior?.crescimentoPercentual) || 0),
        mesesPositivos: novaProjecao.filter((mes) => mes.saldo > 0).length,
        retornoInvestimentoTotal: novaProjecao.reduce((acc, mes) => acc + mes.retorno, 0),
      }

      setImpactoSimulacao(impacto)
      setShowImpactoDialog(true)
      setIsSimulando(false)
    }, 1500)
  }

  // Carregar cenário salvo
  const carregarCenario = (cenario: CenarioSalvo) => {
    // Guardar simulação anterior para comparação
    setSimulacaoAnterior({
      receita,
      despesa,
      investimento,
      taxaJuros,
      periodo,
      saldoFinal,
      crescimentoPercentual,
      projecao: [...projecaoData],
    })

    setReceita(cenario.receita)
    setDespesa(cenario.despesa)
    setInvestimento(cenario.investimento)
    setTaxaJuros(cenario.taxaJuros)
    setPeriodo(cenario.periodo)
    setTaxaCrescimentoReceita(cenario.taxaCrescimentoReceita || 2)
    setTaxaCrescimentoDespesa(cenario.taxaCrescimentoDespesa || 1.5)
    setCenarioAtivo("personalizado")
  }

  // Exportar dados da simulação
  const exportarSimulacao = () => {
    const headers = "Mês,Receita,Despesa,Saldo,Investimento,Retorno\n"
    const csvContent = projecaoData.reduce((acc, row) => {
      return acc + `${row.mes},${row.receita},${row.despesa},${row.saldo},${row.investimento},${row.retorno}\n`
    }, headers)

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `simulacao_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Simulador de Cenários</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => aplicarCenario("personalizado")}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Resetar
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowSaveDialog(true)}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Cenário
            </Button>
            <Button
              variant={comparandoCenarios ? "default" : "outline"}
              size="sm"
              onClick={() => setComparandoCenarios(!comparandoCenarios)}
              className={comparandoCenarios ? "bg-santander-600" : ""}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              Comparar com Anterior
            </Button>
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Simulação Avançada</AlertTitle>
          <AlertDescription>
            Este simulador utiliza algoritmos avançados para calcular projeções financeiras precisas com base nos
            parâmetros fornecidos. Ajuste os valores e visualize o impacto em tempo real.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Parâmetros da Simulação</CardTitle>
                <CardDescription>Ajuste os valores para simular diferentes cenários</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="receita" className="flex items-center gap-1">
                        Receita Mensal (R$)
                        <TooltipInfo content="Valor mensal inicial de receita da empresa" />
                      </Label>
                      <span className="text-sm font-medium">{receita.toLocaleString("pt-BR")}</span>
                    </div>
                    <Slider
                      id="receita"
                      min={10000}
                      max={200000}
                      step={1000}
                      value={[receita]}
                      onValueChange={(value) => setReceita(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="despesa" className="flex items-center gap-1">
                        Despesa Mensal (R$)
                        <TooltipInfo content="Valor mensal inicial de despesas da empresa" />
                      </Label>
                      <span className="text-sm font-medium">{despesa.toLocaleString("pt-BR")}</span>
                    </div>
                    <Slider
                      id="despesa"
                      min={5000}
                      max={150000}
                      step={1000}
                      value={[despesa]}
                      onValueChange={(value) => setDespesa(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="investimento" className="flex items-center gap-1">
                        Investimento Inicial (R$)
                        <TooltipInfo content="Capital inicial investido que gerará retorno ao longo do período" />
                      </Label>
                      <span className="text-sm font-medium">{investimento.toLocaleString("pt-BR")}</span>
                    </div>
                    <Slider
                      id="investimento"
                      min={0}
                      max={100000}
                      step={1000}
                      value={[investimento]}
                      onValueChange={(value) => setInvestimento(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="taxa-juros" className="flex items-center gap-1">
                        Taxa de Juros Anual (%)
                        <TooltipInfo content="Taxa de retorno anual sobre o investimento" />
                      </Label>
                      <span className="text-sm font-medium">{taxaJuros}%</span>
                    </div>
                    <Slider
                      id="taxa-juros"
                      min={1}
                      max={20}
                      step={0.5}
                      value={[taxaJuros]}
                      onValueChange={(value) => setTaxaJuros(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="periodo" className="flex items-center gap-1">
                        Período de Projeção (meses)
                        <TooltipInfo content="Duração da simulação em meses" />
                      </Label>
                      <span className="text-sm font-medium">{periodo}</span>
                    </div>
                    <Slider
                      id="periodo"
                      min={3}
                      max={36}
                      step={1}
                      value={[periodo]}
                      onValueChange={(value) => setPeriodo(value[0])}
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">Parâmetros Avançados</h3>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="taxa-crescimento-receita" className="flex items-center gap-1">
                          Taxa de Crescimento da Receita (% mensal)
                          <TooltipInfo content="Taxa mensal de crescimento da receita" />
                        </Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            id="taxa-crescimento-receita"
                            min={0}
                            max={5}
                            step={0.1}
                            value={[taxaCrescimentoReceita]}
                            onValueChange={(value) => setTaxaCrescimentoReceita(value[0])}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium w-12 text-right">{taxaCrescimentoReceita}%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="taxa-crescimento-despesa" className="flex items-center gap-1">
                          Taxa de Crescimento da Despesa (% mensal)
                          <TooltipInfo content="Taxa mensal de crescimento das despesas" />
                        </Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            id="taxa-crescimento-despesa"
                            min={0}
                            max={5}
                            step={0.1}
                            value={[taxaCrescimentoDespesa]}
                            onValueChange={(value) => setTaxaCrescimentoDespesa(value[0])}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium w-12 text-right">{taxaCrescimentoDespesa}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full bg-santander-600 hover:bg-santander-700"
                  onClick={aplicarSimulacao}
                  disabled={isSimulando}
                >
                  {isSimulando ? (
                    <>
                      <LoadingIndicator size="sm" className="mr-2" />
                      Simulando...
                    </>
                  ) : (
                    "Aplicar Simulação"
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resultados</CardTitle>
                <CardDescription>Métricas calculadas com base nos parâmetros</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Saldo Final</p>
                    <p className="text-2xl font-bold">R$ {saldoFinal.toLocaleString("pt-BR")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Crescimento</p>
                    <p
                      className={`text-2xl font-bold ${Number(crescimentoPercentual) >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {Number(crescimentoPercentual) >= 0 ? "+" : ""}
                      {crescimentoPercentual}%
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Retorno sobre Investimento</p>
                  <p className="text-xl font-bold">
                    R$ {Number.parseFloat(retornoInvestimento).toLocaleString("pt-BR")}
                  </p>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Esta simulação considera crescimento variável de receitas e despesas, além de reinvestimento parcial
                    do saldo.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="grafico" className="space-y-4">
              <TabsList>
                <TabsTrigger value="grafico">Gráfico de Evolução</TabsTrigger>
                <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
                <TabsTrigger value="tabela">Tabela de Dados</TabsTrigger>
                <TabsTrigger value="prontos">Simulações Prontas</TabsTrigger>
                <TabsTrigger value="salvos">Cenários Salvos</TabsTrigger>
              </TabsList>

              <TabsContent value="grafico" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Evolução Financeira Projetada</CardTitle>
                    <CardDescription>Projeção para os próximos {periodo} meses</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] relative" ref={chartRef}>
                    {isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingIndicator size="lg" />
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={projecaoData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--background)",
                              borderColor: "var(--border)",
                              borderRadius: "8px",
                            }}
                            formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, undefined]}
                          />
                          <Legend />
                          <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
                          <Area
                            type="monotone"
                            dataKey="saldo"
                            name="Saldo"
                            stroke="#ec0000"
                            fill="#ec0000"
                            fillOpacity={0.2}
                            activeDot={{ r: 8 }}
                          />
                          <Area
                            type="monotone"
                            dataKey="investimento"
                            name="Investimento"
                            stroke="#4ade80"
                            fill="#4ade80"
                            fillOpacity={0.2}
                          />
                          <Area
                            type="monotone"
                            dataKey="retorno"
                            name="Retorno Mensal"
                            stroke="#60a5fa"
                            fill="#60a5fa"
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      Clique e arraste para ampliar uma área específica
                    </div>
                    <Button variant="outline" size="sm" onClick={exportarSimulacao}>
                      <Download className="mr-2 h-4 w-4" />
                      Exportar CSV
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="comparativo" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Comparativo de Cenários</CardTitle>
                    <CardDescription>
                      {comparandoCenarios
                        ? "Comparação entre cenário atual e anterior"
                        : "Evolução mensal projetada de receitas vs despesas"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px] relative">
                    {isLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <LoadingIndicator size="lg" />
                      </div>
                    ) : comparandoCenarios ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dadosComparacao} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="nome" />
                          <YAxis yAxisId="left" orientation="left" stroke="#ec0000" />
                          <YAxis yAxisId="right" orientation="right" stroke="#60a5fa" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--background)",
                              borderColor: "var(--border)",
                              borderRadius: "8px",
                            }}
                            formatter={(value, name) => {
                              if (name === "saldoFinal") return [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Saldo Final"]
                              if (name === "crescimento") return [`${Number(value).toFixed(1)}%`, "Crescimento"]
                              if (name === "receita") return [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Receita"]
                              if (name === "despesa") return [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Despesa"]
                              if (name === "investimento")
                                return [`R$ ${Number(value).toLocaleString("pt-BR")}`, "Investimento"]
                              return [value, name]
                            }}
                          />
                          <Legend />
                          <Bar yAxisId="left" dataKey="saldoFinal" name="Saldo Final (R$)" fill="#ec0000" />
                          <Bar yAxisId="right" dataKey="crescimento" name="Crescimento (%)" fill="#60a5fa" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={projecaoData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" />
                          <YAxis />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--background)",
                              borderColor: "var(--border)",
                              borderRadius: "8px",
                            }}
                            formatter={(value) => [`R$ ${value.toLocaleString("pt-BR")}`, undefined]}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="receita" name="Receita" stroke="#4ade80" strokeWidth={2} />
                          <Line type="monotone" dataKey="despesa" name="Despesa" stroke="#f87171" strokeWidth={2} />
                          <Line type="monotone" dataKey="saldo" name="Saldo" stroke="#60a5fa" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-sm text-muted-foreground">
                      {comparandoCenarios
                        ? "Comparando cenário atual com anterior"
                        : "Mostrando evolução de receitas e despesas"}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setComparandoCenarios(!comparandoCenarios)}>
                      {comparandoCenarios ? "Ver Evolução Mensal" : "Comparar Cenários"}
                    </Button>
                  </CardFooter>
                </Card>

                {/* Card adicional para análise de impacto */}
                <Card>
                  <CardHeader>
                    <CardTitle>Análise de Impacto</CardTitle>
                    <CardDescription>Impacto das alterações nos parâmetros</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Impacto na Receita</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">
                            {taxaCrescimentoReceita > (simulacaoAnterior?.taxaCrescimentoReceita || 2) ? "+" : ""}
                            {(
                              (taxaCrescimentoReceita - (simulacaoAnterior?.taxaCrescimentoReceita || 2)) *
                              periodo
                            ).toFixed(1)}
                            %
                          </span>
                          <Badge
                            className={
                              taxaCrescimentoReceita > (simulacaoAnterior?.taxaCrescimentoReceita || 2)
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          >
                            {taxaCrescimentoReceita > (simulacaoAnterior?.taxaCrescimentoReceita || 2)
                              ? "Positivo"
                              : "Negativo"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Impacto acumulado ao longo de {periodo} meses
                        </p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Impacto nas Despesas</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">
                            {taxaCrescimentoDespesa < (simulacaoAnterior?.taxaCrescimentoDespesa || 1.5) ? "+" : ""}
                            {(
                              (taxaCrescimentoDespesa - (simulacaoAnterior?.taxaCrescimentoDespesa || 1.5)) *
                              periodo
                            ).toFixed(1)}
                            %
                          </span>
                          <Badge
                            className={
                              taxaCrescimentoDespesa < (simulacaoAnterior?.taxaCrescimentoDespesa || 1.5)
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          >
                            {taxaCrescimentoDespesa < (simulacaoAnterior?.taxaCrescimentoDespesa || 1.5)
                              ? "Positivo"
                              : "Negativo"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Impacto acumulado ao longo de {periodo} meses
                        </p>
                      </div>

                      <div className="rounded-lg border p-4">
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Impacto no Investimento</h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">
                            {taxaJuros > (simulacaoAnterior?.taxaJuros || 12) ? "+" : ""}
                            {(((taxaJuros - (simulacaoAnterior?.taxaJuros || 12)) * investimento) / 100).toLocaleString(
                              "pt-BR",
                            )}
                          </span>
                          <Badge
                            className={taxaJuros > (simulacaoAnterior?.taxaJuros || 12) ? "bg-green-500" : "bg-red-500"}
                          >
                            {taxaJuros > (simulacaoAnterior?.taxaJuros || 12) ? "Positivo" : "Negativo"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Diferença anual no retorno sobre investimento
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tabela" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Dados Detalhados</CardTitle>
                    <CardDescription>Valores mensais projetados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-6 border-b bg-muted/50">
                        <div className="p-2 font-medium">Período</div>
                        <div className="p-2 font-medium">Receita</div>
                        <div className="p-2 font-medium">Despesa</div>
                        <div className="p-2 font-medium">Saldo</div>
                        <div className="p-2 font-medium">Investimento</div>
                        <div className="p-2 font-medium">Retorno</div>
                      </div>
                      <div className="max-h-[300px] overflow-auto">
                        {projecaoData.map((item, index) => (
                          <div key={index} className="grid grid-cols-6 border-b last:border-0">
                            <div className="p-2">{item.mes}</div>
                            <div className="p-2">R$ {item.receita.toLocaleString("pt-BR")}</div>
                            <div className="p-2">R$ {item.despesa.toLocaleString("pt-BR")}</div>
                            <div
                              className="p-2 font-medium"
                              style={{ color: item.saldo >= 0 ? "var(--green-600)" : "var(--red-600)" }}
                            >
                              R$ {item.saldo.toLocaleString("pt-BR")}
                            </div>
                            <div className="p-2">R$ {item.investimento.toLocaleString("pt-BR")}</div>
                            <div className="p-2">R$ {item.retorno.toLocaleString("pt-BR")}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={exportarSimulacao}>
                      <Download className="mr-2 h-4 w-4" />
                      Exportar CSV
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="prontos" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Simulações Pré-configuradas</CardTitle>
                    <CardDescription>Cenários prontos para análise rápida</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${cenarioAtivo === "crise" ? "border-red-500 bg-red-50 dark:bg-red-950/20 dark:text-red-400" : ""}`}
                        onClick={() => aplicarCenario("crise")}
                      >
                        <h3 className="font-medium mb-2 flex items-center">
                          Cenário de Crise
                          {cenarioAtivo === "crise" && <CheckCircle className="ml-2 h-4 w-4 text-green-600" />}
                        </h3>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Receita: R$ 45.000</li>
                          <li>• Despesa: R$ 40.000</li>
                          <li>• Investimento: R$ 5.000</li>
                          <li>• Taxa de Juros: 8%</li>
                          <li>• Crescimento Receita: 0,5%</li>
                          <li>• Crescimento Despesa: 1,8%</li>
                        </ul>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => aplicarCenario("crise")}
                        >
                          Aplicar Cenário
                        </Button>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${cenarioAtivo === "expansao" ? "border-green-500 bg-green-50 dark:bg-green-950/20 dark:text-green-400" : ""}`}
                        onClick={() => aplicarCenario("expansao")}
                      >
                        <h3 className="font-medium mb-2 flex items-center">
                          Expansão Agressiva
                          {cenarioAtivo === "expansao" && <CheckCircle className="ml-2 h-4 w-4 text-green-600" />}
                        </h3>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Receita: R$ 80.000</li>
                          <li>• Despesa: R$ 60.000</li>
                          <li>• Investimento: R$ 20.000</li>
                          <li>• Taxa de Juros: 15%</li>
                          <li>• Crescimento Receita: 3,5%</li>
                          <li>• Crescimento Despesa: 2,2%</li>
                        </ul>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => aplicarCenario("expansao")}
                        >
                          Aplicar Cenário
                        </Button>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${cenarioAtivo === "reducao" ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400" : ""}`}
                        onClick={() => aplicarCenario("reducao")}
                      >
                        <h3 className="font-medium mb-2 flex items-center">
                          Redução de Custos
                          {cenarioAtivo === "reducao" && <CheckCircle className="ml-2 h-4 w-4 text-green-600" />}
                        </h3>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Receita: R$ 64.000</li>
                          <li>• Despesa: R$ 32.000</li>
                          <li>• Investimento: R$ 15.000</li>
                          <li>• Taxa de Juros: 10%</li>
                          <li>• Crescimento Receita: 1,8%</li>
                          <li>• Crescimento Despesa: 0,8%</li>
                        </ul>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => aplicarCenario("reducao")}
                        >
                          Aplicar Cenário
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="salvos" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Cenários Salvos</CardTitle>
                    <CardDescription>Simulações personalizadas salvas anteriormente</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cenariosSalvos.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                          <Save className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium text-lg mb-2">Nenhum cenário salvo</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Salve suas simulações para comparar diferentes cenários e acompanhar o impacto de mudanças nos
                          parâmetros.
                        </p>
                        <Button
                          className="mt-4 bg-santander-600 hover:bg-santander-700"
                          onClick={() => setShowSaveDialog(true)}
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Salvar Cenário Atual
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cenariosSalvos.map((cenario) => (
                          <motion.div
                            key={cenario.id}
                            whileHover={{ scale: 1.01 }}
                            className="rounded-lg border p-4 hover:bg-muted/30 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="font-medium">{cenario.nome}</h3>
                                <p className="text-xs text-muted-foreground">Criado em: {cenario.data}</p>
                              </div>
                              <Badge className="bg-santander-600">
                                Saldo: R$ {cenario.saldoFinal.toLocaleString("pt-BR")}
                              </Badge>
                            </div>

                            {cenario.descricao && (
                              <p className="text-sm text-muted-foreground mb-3">{cenario.descricao}</p>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs mb-3">
                              <div>
                                <span className="text-muted-foreground">Receita:</span>{" "}
                                <span className="font-medium">R$ {cenario.receita.toLocaleString("pt-BR")}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Despesa:</span>{" "}
                                <span className="font-medium">R$ {cenario.despesa.toLocaleString("pt-BR")}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Investimento:</span>{" "}
                                <span className="font-medium">R$ {cenario.investimento.toLocaleString("pt-BR")}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Taxa de Juros:</span>{" "}
                                <span className="font-medium">{cenario.taxaJuros}%</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Período:</span>{" "}
                                <span className="font-medium">{cenario.periodo} meses</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Crescimento:</span>{" "}
                                <span
                                  className={`font-medium ${Number(cenario.crescimentoPercentual) >= 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                  {Number(cenario.crescimentoPercentual) >= 0 ? "+" : ""}
                                  {cenario.crescimentoPercentual}%
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-end">
                              <Button variant="outline" size="sm" onClick={() => carregarCenario(cenario)}>
                                <ArrowRight className="mr-2 h-4 w-4" />
                                Carregar Cenário
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Diálogo para salvar cenário */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Salvar Cenário</DialogTitle>
            <DialogDescription>Salve esta simulação para consulta e comparação futura.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome-cenario">Nome do Cenário</Label>
              <Input
                id="nome-cenario"
                placeholder="Ex: Expansão 2025"
                value={nomeCenario}
                onChange={(e) => setNomeCenario(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricao-cenario">Descrição (opcional)</Label>
              <Input
                id="descricao-cenario"
                placeholder="Breve descrição do cenário"
                value={descricaoCenario}
                onChange={(e) => setDescricaoCenario(e.target.value)}
              />
            </div>
            <div className="rounded-md bg-muted p-3">
              <h4 className="text-sm font-medium mb-2">Resumo do Cenário</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Receita:</span>{" "}
                  <span className="font-medium">R$ {receita.toLocaleString("pt-BR")}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Despesa:</span>{" "}
                  <span className="font-medium">R$ {despesa.toLocaleString("pt-BR")}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Saldo Final:</span>{" "}
                  <span className="font-medium">R$ {saldoFinal.toLocaleString("pt-BR")}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Crescimento:</span>{" "}
                  <span
                    className={`font-medium ${Number(crescimentoPercentual) >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {Number(crescimentoPercentual) >= 0 ? "+" : ""}
                    {crescimentoPercentual}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={salvarCenario} className="bg-santander-600 hover:bg-santander-700">
              Salvar Cenário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para mostrar impacto da simulação */}
      <Dialog open={showImpactoDialog} onOpenChange={setShowImpactoDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Impacto da Simulação</DialogTitle>
            <DialogDescription>Análise do impacto das alterações realizadas nos parâmetros.</DialogDescription>
          </DialogHeader>
          {impactoSimulacao && (
            <div className="space-y-4 py-4">
              <Alert
                className={
                  impactoSimulacao.saldoFinalDiferenca >= 0
                    ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900/30"
                    : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900/30"
                }
              >
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Impacto no Saldo Final</AlertTitle>
                <AlertDescription className="font-medium">
                  {impactoSimulacao.saldoFinalDiferenca >= 0 ? "Aumento" : "Redução"} de R${" "}
                  {Math.abs(impactoSimulacao.saldoFinalDiferenca).toLocaleString("pt-BR")} no saldo final
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Crescimento</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      {impactoSimulacao.crescimentoDiferenca >= 0 ? "+" : ""}
                      {impactoSimulacao.crescimentoDiferenca.toFixed(1)}%
                    </span>
                    <Badge className={impactoSimulacao.crescimentoDiferenca >= 0 ? "bg-green-500" : "bg-red-500"}>
                      {impactoSimulacao.crescimentoDiferenca >= 0 ? "Positivo" : "Negativo"}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Meses Positivos</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold">
                      {impactoSimulacao.mesesPositivos}/{periodo}
                    </span>
                    <Badge className={impactoSimulacao.mesesPositivos > periodo / 2 ? "bg-green-500" : "bg-red-500"}>
                      {impactoSimulacao.mesesPositivos > periodo / 2 ? "Bom" : "Atenção"}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Retorno Total sobre Investimento</h3>
                <p className="text-xl font-bold">
                  R$ {impactoSimulacao.retornoInvestimentoTotal.toLocaleString("pt-BR")}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Retorno acumulado ao longo de {periodo} meses</p>
              </div>

              <div className="rounded-md bg-muted p-3">
                <h4 className="text-sm font-medium mb-2">Recomendação</h4>
                <p className="text-sm">
                  {impactoSimulacao.saldoFinalDiferenca >= 0
                    ? "Esta simulação apresenta resultados positivos. Considere implementar as mudanças propostas para melhorar o desempenho financeiro."
                    : "Esta simulação apresenta resultados negativos. Revise os parâmetros e considere ajustes para melhorar o desempenho financeiro."}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImpactoDialog(false)}>
              Fechar
            </Button>
            <Button
              onClick={() => {
                setShowImpactoDialog(false)
                setShowSaveDialog(true)
              }}
              className="bg-santander-600 hover:bg-santander-700"
            >
              Salvar Cenário
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
