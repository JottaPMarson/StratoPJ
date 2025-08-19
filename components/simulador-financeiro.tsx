"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts"

// Dados financeiros iniciais
const dadosFinanceirosIniciais = {
  receita: 500000,
  custoFixo: 150000,
  custoVariavel: 200000,
  despesasOperacionais: 50000,
  impostos: 30000,
  investimentos: 20000,
}

// Função para calcular o lucro líquido
const calcularLucroLiquido = (
  receita: number,
  custoFixo: number,
  custoVariavel: number,
  despesasOperacionais: number,
  impostos: number,
  investimentos: number,
) => {
  return receita - custoFixo - custoVariavel - despesasOperacionais - impostos - investimentos
}

// Função para calcular a margem líquida
const calcularMargemLiquida = (lucroLiquido: number, receita: number) => {
  return (lucroLiquido / receita) * 100
}

// Função para calcular o ponto de equilíbrio
const calcularPontoDeEquilibrio = (custoFixo: number, custoVariavel: number, receita: number) => {
  return custoFixo / (1 - custoVariavel / receita)
}

// Função para formatar valores como moeda brasileira
const formatarMoeda = (valor: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(valor)
}

export function SimuladorFinanceiro() {
  // Estados para controlar os valores dos sliders
  const [receita, setReceita] = useState(dadosFinanceirosIniciais.receita)
  const [custoFixo, setCustoFixo] = useState(dadosFinanceirosIniciais.custoFixo)
  const [custoVariavel, setCustoVariavel] = useState(dadosFinanceirosIniciais.custoVariavel)
  const [despesasOperacionais, setDespesasOperacionais] = useState(dadosFinanceirosIniciais.despesasOperacionais)
  const [impostos, setImpostos] = useState(dadosFinanceirosIniciais.impostos)
  const [investimentos, setInvestimentos] = useState(dadosFinanceirosIniciais.investimentos)

  // Cálculo do lucro líquido
  const lucroLiquido = calcularLucroLiquido(
    receita,
    custoFixo,
    custoVariavel,
    despesasOperacionais,
    impostos,
    investimentos,
  )

  // Cálculo da margem líquida
  const margemLiquida = calcularMargemLiquida(lucroLiquido, receita)

  // Cálculo do ponto de equilíbrio
  const pontoDeEquilibrio = calcularPontoDeEquilibrio(custoFixo, custoVariavel, receita)

  // Dados para o gráfico de pizza
  const data = [
    { name: "Custo Fixo", value: custoFixo },
    { name: "Custo Variável", value: custoVariavel },
    { name: "Despesas Operacionais", value: despesasOperacionais },
    { name: "Impostos", value: impostos },
    { name: "Investimentos", value: investimentos },
    { name: "Lucro Líquido", value: lucroLiquido > 0 ? lucroLiquido : 0 },
  ]

  // Cores para o gráfico de pizza
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  return (
    <TooltipProvider>
      <div className="container mx-auto py-10">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Simulador Financeiro</CardTitle>
            <CardDescription>Simule diferentes cenários financeiros para sua empresa.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="simulacao" className="w-full">
              <TabsList>
                <TabsTrigger value="simulacao">Simulação</TabsTrigger>
                <TabsTrigger value="resultados">Resultados</TabsTrigger>
                <TabsTrigger value="graficos">Gráficos</TabsTrigger>
              </TabsList>
              <TabsContent value="simulacao">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Slider para Receita */}
                  <div>
                    <Label htmlFor="receita">Receita ({formatarMoeda(receita)})</Label>
                    <Slider
                      id="receita"
                      min={0}
                      max={1000000}
                      step={1000}
                      value={[receita]}
                      onValueChange={(value) => setReceita(value[0])}
                    />
                  </div>

                  {/* Slider para Custo Fixo */}
                  <div>
                    <Label htmlFor="custoFixo">Custo Fixo ({formatarMoeda(custoFixo)})</Label>
                    <Slider
                      id="custoFixo"
                      min={0}
                      max={500000}
                      step={1000}
                      value={[custoFixo]}
                      onValueChange={(value) => setCustoFixo(value[0])}
                    />
                  </div>

                  {/* Slider para Custo Variável */}
                  <div>
                    <Label htmlFor="custoVariavel">Custo Variável ({formatarMoeda(custoVariavel)})</Label>
                    <Slider
                      id="custoVariavel"
                      min={0}
                      max={500000}
                      step={1000}
                      value={[custoVariavel]}
                      onValueChange={(value) => setCustoVariavel(value[0])}
                    />
                  </div>

                  {/* Slider para Despesas Operacionais */}
                  <div>
                    <Label htmlFor="despesasOperacionais">
                      Despesas Operacionais ({formatarMoeda(despesasOperacionais)})
                    </Label>
                    <Slider
                      id="despesasOperacionais"
                      min={0}
                      max={200000}
                      step={1000}
                      value={[despesasOperacionais]}
                      onValueChange={(value) => setDespesasOperacionais(value[0])}
                    />
                  </div>

                  {/* Slider para Impostos */}
                  <div>
                    <Label htmlFor="impostos">Impostos ({formatarMoeda(impostos)})</Label>
                    <Slider
                      id="impostos"
                      min={0}
                      max={100000}
                      step={1000}
                      value={[impostos]}
                      onValueChange={(value) => setImpostos(value[0])}
                    />
                  </div>

                  {/* Slider para Investimentos */}
                  <div>
                    <Label htmlFor="investimentos">Investimentos ({formatarMoeda(investimentos)})</Label>
                    <Slider
                      id="investimentos"
                      min={0}
                      max={100000}
                      step={1000}
                      value={[investimentos]}
                      onValueChange={(value) => setInvestimentos(value[0])}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="resultados">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Resultados Financeiros</h3>
                    <Separator className="my-2" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Receita</CardTitle>
                        <CardDescription>Valor total da receita</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatarMoeda(receita)}</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Lucro Líquido</CardTitle>
                        <CardDescription>Lucro após todas as despesas</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatarMoeda(lucroLiquido)}</div>
                        <Progress value={margemLiquida} className="mt-2" />
                        <p className="text-sm mt-1">Margem Líquida: {margemLiquida.toFixed(2)}%</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Ponto de Equilíbrio</CardTitle>
                        <CardDescription>Valor necessário para cobrir os custos</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{formatarMoeda(pontoDeEquilibrio)}</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="graficos">
                <div>
                  <h3 className="text-lg font-semibold">Gráficos</h3>
                  <Separator className="my-2" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribuição de Custos</CardTitle>
                      <CardDescription>
                        Gráfico de pizza mostrando a distribuição dos custos e do lucro líquido.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => formatarMoeda(value as number)} />
                          <RechartsTooltip formatter={(value) => [formatarMoeda(value as number), ""]} />
                          <Legend />
                          <Bar dataKey="value" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
