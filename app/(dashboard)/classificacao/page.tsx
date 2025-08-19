"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PeriodFilter } from "@/components/ui/period-filter"
import { LoadingIndicator } from "@/components/ui/loading-indicator"
import { TooltipInfo } from "@/components/ui/tooltip-info"
import { Download, Filter, BarChart3, TrendingUp, ArrowRight, Info, FileText, CheckCircle } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { motion } from "framer-motion"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Dados simulados para os gráficos
const estagioData = {
  atual: "Expansão",
  pontuacao: 68,
  historico: [
    { mes: "Jan", estagio: "Início", pontuacao: 32 },
    { mes: "Fev", estagio: "Início", pontuacao: 38 },
    { mes: "Mar", estagio: "Início", pontuacao: 45 },
    { mes: "Abr", estagio: "Expansão", pontuacao: 52 },
    { mes: "Mai", estagio: "Expansão", pontuacao: 60 },
    { mes: "Jun", estagio: "Expansão", pontuacao: 68 },
  ],
  indicadores: [
    { nome: "Crescimento de Receita", valor: 75 },
    { nome: "Margem de Lucro", valor: 60 },
    { nome: "Diversificação de Clientes", valor: 45 },
    { nome: "Eficiência Operacional", valor: 70 },
    { nome: "Capacidade de Investimento", valor: 55 },
  ],
  caracteristicas: {
    inicio: [
      "Receita baixa e instável",
      "Poucos clientes",
      "Foco em sobrevivência",
      "Estrutura organizacional simples",
      "Decisões centralizadas",
    ],
    expansao: [
      "Crescimento acelerado de receita",
      "Aumento da base de clientes",
      "Necessidade de capital para crescimento",
      "Contratação de pessoal",
      "Processos em desenvolvimento",
    ],
    maturidade: [
      "Crescimento estável",
      "Base de clientes consolidada",
      "Processos bem definidos",
      "Estrutura organizacional robusta",
      "Foco em eficiência",
    ],
    declinio: [
      "Queda na receita",
      "Perda de clientes",
      "Margens reduzidas",
      "Corte de custos",
      "Necessidade de reinvenção",
    ],
  },
  recomendacoes: [
    {
      titulo: "Estruturar Processos de Vendas",
      descricao: "Implemente um CRM e defina processos claros para prospecção e conversão de clientes.",
      prioridade: "alta",
    },
    {
      titulo: "Diversificar Base de Clientes",
      descricao: "Reduza a dependência de poucos clientes grandes, buscando novos mercados e segmentos.",
      prioridade: "média",
    },
    {
      titulo: "Planejar Expansão Geográfica",
      descricao: "Avalie a possibilidade de expandir para novas regiões para ampliar seu mercado.",
      prioridade: "baixa",
    },
  ],
}

export default function ClassificacaoPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const getEstagioColor = (estagio) => {
    switch (estagio) {
      case "Início":
        return "text-blue-500"
      case "Expansão":
        return "text-green-500"
      case "Maturidade":
        return "text-amber-500"
      case "Declínio":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }

  const getEstagioBgColor = (estagio) => {
    switch (estagio) {
      case "Início":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
      case "Expansão":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "Maturidade":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
      case "Declínio":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    }
  }

  const getPriorityColor = (prioridade) => {
    switch (prioridade) {
      case "alta":
        return "bg-red-500"
      case "média":
        return "bg-amber-500"
      case "baixa":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight">Classificação de Estágio</h1>
          <div className="flex items-center gap-2">
            <PeriodFilter />
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filtrar</span>
            </Button>
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Classificação Automática</AlertTitle>
          <AlertDescription>
            Nossa análise classifica sua empresa em um dos quatro estágios: Início, Expansão, Maturidade ou Declínio.
            Esta classificação é baseada em diversos indicadores financeiros e comportamentais.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-santander-600" />
                Estágio Atual da Empresa
              </CardTitle>
              <CardDescription>Classificação baseada na análise dos dados financeiros</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center justify-center text-center">
                <Badge className={`text-lg py-1.5 px-4 ${getEstagioBgColor(estagioData.atual)}`}>
                  {estagioData.atual}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Sua empresa está na fase de <span className="font-medium">{estagioData.atual}</span>, caracterizada
                  por crescimento acelerado e expansão de mercado.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Início</span>
                  <span>Expansão</span>
                  <span>Maturidade</span>
                  <span>Declínio</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-santander-600 h-2.5 rounded-full"
                    style={{ width: `${estagioData.pontuacao}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0</span>
                  <span>25</span>
                  <span>50</span>
                  <span>75</span>
                  <span>100</span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium mb-2">Características do Estágio Atual</h3>
                  <ul className="space-y-1">
                    {estagioData.caracteristicas.expansao.map((caracteristica, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        {caracteristica}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Próximos Passos</h3>
                  <div className="rounded-lg border p-3 bg-muted/30">
                    <p className="text-sm">
                      Para avançar para o estágio de <span className="font-medium">Maturidade</span>, sua empresa
                      precisa focar em:
                    </p>
                    <ul className="mt-2 space-y-1">
                      <li className="flex items-center gap-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-santander-600" />
                        Consolidar processos operacionais
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-santander-600" />
                        Estabilizar fluxo de caixa
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <ArrowRight className="h-4 w-4 text-santander-600" />
                        Desenvolver gestão estratégica
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar Diagnóstico
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Indicadores-Chave</CardTitle>
              <CardDescription>Métricas que determinam o estágio atual</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {estagioData.indicadores.map((indicador, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{indicador.nome}</span>
                      <TooltipInfo content={`Pontuação baseada na análise de ${indicador.nome.toLowerCase()}`} />
                    </div>
                    <span className="font-medium">{indicador.valor}%</span>
                  </div>
                  <Progress value={indicador.valor} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="historico" className="space-y-4">
          <TabsList>
            <TabsTrigger value="historico">Histórico de Estágios</TabsTrigger>
            <TabsTrigger value="comparativo">Análise Comparativa</TabsTrigger>
            <TabsTrigger value="recomendacoes">Recomendações</TabsTrigger>
          </TabsList>

          <TabsContent value="historico" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolução do Estágio da Empresa</CardTitle>
                <CardDescription>Acompanhe a progressão da sua empresa ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px] relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingIndicator size="lg" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={estagioData.historico}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="mes" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        formatter={(value, name) => [`${value}%`, name === "pontuacao" ? "Pontuação" : name]}
                        labelFormatter={(label) => `Mês: ${label}`}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="pontuacao"
                        name="Pontuação"
                        stroke="#ec0000"
                        strokeWidth={2}
                        dot={{ r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="w-full border rounded-md">
                  <div className="grid grid-cols-3 border-b bg-muted/50">
                    <div className="p-2 font-medium">Mês</div>
                    <div className="p-2 font-medium">Estágio</div>
                    <div className="p-2 font-medium">Pontuação</div>
                  </div>
                  <div>
                    {estagioData.historico.map((item, index) => (
                      <div key={index} className="grid grid-cols-3 border-b last:border-0">
                        <div className="p-2">{item.mes}</div>
                        <div className="p-2">
                          <span className={getEstagioColor(item.estagio)}>{item.estagio}</span>
                        </div>
                        <div className="p-2">{item.pontuacao}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="comparativo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Análise Comparativa</CardTitle>
                <CardDescription>Compare seus indicadores com empresas do mesmo setor</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingIndicator size="lg" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={150} data={estagioData.indicadores}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="nome" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar name="Sua Empresa" dataKey="valor" stroke="#ec0000" fill="#ec0000" fillOpacity={0.5} />
                      <Radar
                        name="Média do Setor"
                        dataKey="mediaSetor"
                        stroke="#60a5fa"
                        fill="#60a5fa"
                        fillOpacity={0.5}
                        data={[
                          { nome: "Crescimento de Receita", mediaSetor: 60 },
                          { nome: "Margem de Lucro", mediaSetor: 55 },
                          { nome: "Diversificação de Clientes", mediaSetor: 65 },
                          { nome: "Eficiência Operacional", mediaSetor: 58 },
                          { nome: "Capacidade de Investimento", mediaSetor: 50 },
                        ]}
                      />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter>
                <div className="w-full rounded-lg border p-4 bg-muted/30">
                  <h3 className="font-medium mb-2">Análise Comparativa</h3>
                  <p className="text-sm text-muted-foreground">
                    Sua empresa se destaca em <span className="font-medium">Crescimento de Receita</span> e{" "}
                    <span className="font-medium">Eficiência Operacional</span>, superando a média do setor. No entanto,
                    a <span className="font-medium">Diversificação de Clientes</span> está abaixo da média, o que pode
                    representar um risco para o negócio. Considere estratégias para ampliar sua base de clientes.
                  </p>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="recomendacoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recomendações Personalizadas</CardTitle>
                <CardDescription>Ações sugeridas com base no estágio atual da sua empresa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {estagioData.recomendacoes.map((recomendacao, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="rounded-lg border p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{recomendacao.titulo}</h3>
                      <Badge className={getPriorityColor(recomendacao.prioridade)}>
                        Prioridade{" "}
                        {recomendacao.prioridade === "alta"
                          ? "Alta"
                          : recomendacao.prioridade === "média"
                            ? "Média"
                            : "Baixa"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{recomendacao.descricao}</p>
                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm">
                        <FileText className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </motion.div>
                ))}

                <div className="rounded-lg border border-dashed p-4 flex flex-col items-center justify-center text-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium">Consultoria Personalizada</h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    Para recomendações mais detalhadas e um plano de ação personalizado, agende uma consultoria com
                    nossos especialistas.
                  </p>
                  <Button className="mt-4 bg-santander-600 hover:bg-santander-700">Agendar Consultoria</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximos Passos</CardTitle>
                <CardDescription>Ações recomendadas para avançar ao próximo estágio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-santander-100">
                      <span className="text-santander-600 font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Estruturar Processos</h3>
                      <p className="text-sm text-muted-foreground">
                        Documente e padronize processos operacionais para suportar o crescimento.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-santander-100">
                      <span className="text-santander-600 font-bold">2</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Diversificar Base de Clientes</h3>
                      <p className="text-sm text-muted-foreground">
                        Reduza a dependência de poucos clientes grandes, buscando novos mercados e segmentos.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-santander-100">
                      <span className="text-santander-600 font-bold">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Investir em Tecnologia</h3>
                      <p className="text-sm text-muted-foreground">
                        Adote soluções tecnológicas que permitam escalar operações sem aumentar custos
                        proporcionalmente.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-santander-100">
                      <span className="text-santander-600 font-bold">4</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Desenvolver Liderança</h3>
                      <p className="text-sm text-muted-foreground">
                        Prepare líderes para gerenciar equipes maiores e processos mais complexos.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-santander-600 hover:bg-santander-700">Criar Plano de Ação</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  )
}
