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
  AlertTriangle,
  Lightbulb,
  Rocket,
  Filter,
  Calendar,
  Target,
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
import React, { useState, useEffect, useCallback, useMemo } from "react"
import { ApiService, MetricasDashboard, DadosFinanceiros } from "@/lib/api"
import { motion } from "framer-motion"
import Link from "next/link"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Interfaces para tipagem
interface PieChartProps {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  fill: string
  payload: { name: string; value: number }
  percent: number
  value: number
}

interface TooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
    name: string
    color: string
  }>
  label?: string | number
  formatter?: (value: number) => string
}

interface KpiCardProps {
  title: string
  value: string | number
  change: string
  icon: React.ComponentType<{ className?: string }>
  borderColor: string
  changeColor: string
  hasNotification?: boolean
}

interface AcaoRecomendadaCardProps {
  titulo: string
  descricao: string
  prioridade: string
  icon: React.ComponentType<{ className?: string }>
  iconBgColor: string
  iconColor: string
}

interface StatCardProps {
  title: string
  value: string | number
  icon: {
    component: React.ComponentType<{ className?: string }>
    bgColor: string
    color: string
  }
  description: string
  trend: string
  trendValue: string
}

interface FinancialData {
  [key: string]: {
    receita: number
    despesa: number
    saldo: number
  }
}

// Dados de exemplo para os gráficos
const financialData = [
  { month: "Jan", receita: 45000, despesa: 32000, saldo: 13000 },
  { month: "Fev", receita: 52000, despesa: 34000, saldo: 18000 },
  { month: "Mar", receita: 49000, despesa: 36000, saldo: 13000 },
  { month: "Abr", receita: 63000, despesa: 40000, saldo: 23000 },
  { month: "Mai", receita: 58000, despesa: 45000, saldo: 13000 },
  { month: "Jun", receita: 64000, despesa: 42000, saldo: 22000 },
]

// Função para gerar dados de despesas baseados nos dados reais
const gerarDespesasPorCategoria = (dashboardData: MetricasDashboard | null) => {
  if (!dashboardData) {
    // Dados de exemplo se não houver dados reais
    return [
      { name: "Pessoal", value: 18000 },
      { name: "Marketing", value: 12000 },
      { name: "Operacional", value: 8000 },
      { name: "Tecnologia", value: 4000 },
    ];
  }

  // Calcular distribuição baseada no total de despesas
  const totalDespesas = dashboardData.despesasTotal;
  
  // Distribuição típica de despesas empresariais
  const distribuicao = [
    { name: "Pessoal", percentual: 0.45 },      // 45% - Maior categoria
    { name: "Operacional", percentual: 0.25 },  // 25% - Operações
    { name: "Marketing", percentual: 0.15 },    // 15% - Marketing
    { name: "Tecnologia", percentual: 0.10 },   // 10% - TI
    { name: "Outros", percentual: 0.05 }        // 5% - Outros
  ];

  return distribuicao.map(categoria => ({
    name: categoria.name,
    value: Math.round(totalDespesas * categoria.percentual)
  }));
};

const COLORS = ["#ec0000", "#737373", "#4ade80", "#60a5fa", "#facc15"]

// Componente para o setor ativo no gráfico de pizza
const renderActiveShape = (props: any) => {
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
      <text x={cx} y={cy - 15} dy={8} textAnchor="middle" fill={fill} className="text-xs font-medium">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-xs font-bold">
        {value >= 1000000000 ? `R$ ${(value / 1000000000).toFixed(1)}B` : 
         value >= 1000000 ? `R$ ${(value / 1000000).toFixed(1)}M` : 
         value >= 1000 ? `R$ ${(value / 1000).toFixed(1)}k` : 
         `R$ ${value.toLocaleString("pt-BR")}`}
      </text>
      <text x={cx} y={cy + 15} dy={8} textAnchor="middle" fill={fill} className="text-xs">
        {`(${(percent * 100).toFixed(1)}%)`}
      </text>
    </g>
  )
}

// Componente personalizado para o tooltip dos gráficos
const CustomTooltip = ({ active, payload, label, formatter }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry, index: number) => (
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

// Função para gerar histórico de diagnósticos baseado nos dados reais
const gerarHistoricoDiagnosticos = (dashboardData: MetricasDashboard | null) => {
  if (!dashboardData) {
    // Dados de exemplo se não houver dados reais
    return [
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
    ];
  }

  // Gerar histórico baseado nos dados reais
  const meses = ["Fevereiro 2025", "Março 2025", "Abril 2025"];
  const receitaMensal = dashboardData.receitaTotal / 12;
  const despesaMensal = dashboardData.despesasTotal / 12;
  
  return meses.map((mes, index) => {
    // Variação mensal (80% a 120% do valor base)
    const fatorVariacao = 0.8 + (index * 0.2); // Crescimento progressivo
    const receita = Math.round(receitaMensal * fatorVariacao);
    const despesa = Math.round(despesaMensal * fatorVariacao);
    const lucro = receita - despesa;
    const margemLucro = receita > 0 ? (lucro / receita) * 100 : 0;
    
    // Determinar estágio baseado na margem de lucro
    let stage = "Início";
    let score = 40;
    
    if (margemLucro > 20) {
      stage = "Expansão";
      score = 70 + Math.floor(margemLucro / 2);
    } else if (margemLucro > 10) {
      stage = "Crescimento";
      score = 50 + Math.floor(margemLucro);
    }
    
    return {
      date: mes,
      stage,
      score: Math.min(score, 100),
      revenue: receita,
      expenses: despesa,
      metrics: {
        marginProfit: margemLucro,
        roi: margemLucro * 0.8,
        liquidity: 1.2 + (margemLucro / 50),
        growthRate: margemLucro * 0.6,
      },
    };
  });
};

// Componente para o card de estágio da empresa
function EstagioEmpresaCard({ dashboardData }: { dashboardData: MetricasDashboard | null }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  // Calcular estágio baseado nos dados reais
  const calcularEstagio = () => {
    if (!dashboardData) {
      return {
        stage: "Expansão",
        description: "Fase de crescimento sustentável com aumento de receita e base de clientes",
        progress: 2 // Expansão
      };
    }

    const margemLucro = dashboardData.margemLucro;
    
    if (margemLucro > 25) {
      return {
        stage: "Maturidade",
        description: "Empresa consolidada com alta rentabilidade e estabilidade financeira",
        progress: 3 // Maturidade
      };
    } else if (margemLucro > 15) {
      return {
        stage: "Expansão",
        description: "Fase de crescimento sustentável com aumento de receita e base de clientes",
        progress: 2 // Expansão
      };
    } else if (margemLucro > 5) {
      return {
        stage: "Crescimento",
        description: "Período de desenvolvimento com investimentos em infraestrutura e mercado",
        progress: 1 // Crescimento
      };
    } else {
      return {
        stage: "Início",
        description: "Fase inicial com foco em estabelecimento e primeiros clientes",
        progress: 0 // Início
      };
    }
  };

  const estagioInfo = calcularEstagio();

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
            <h3 className="text-xl font-bold">{estagioInfo.stage}</h3>
            <p className="text-sm text-muted-foreground">
              {estagioInfo.description}
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
            <div className="bg-santander-600 h-2.5 rounded-full" style={{ width: `${(estagioInfo.progress / 3) * 100}%` }}></div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para indicadores de desempenho
function IndicadoresDesempenhoCard({ dashboardData }: { dashboardData: MetricasDashboard | null }) {
  // Calcular métricas baseadas nos dados reais
  const calcularMetricas = () => {
    if (!dashboardData) {
      return {
        margemLucro: 34.4,
        roi: 22.8,
        liquidez: 1.8,
        crescimento: 12.0
      };
    }

    const margemLucro = dashboardData.margemLucro;
    const roi = margemLucro * 0.8; // ROI baseado na margem
    const liquidez = 1.2 + (margemLucro / 50); // Liquidez baseada na margem
    const crescimento = margemLucro * 0.6; // Crescimento baseado na margem

    return {
      margemLucro: Math.round(margemLucro * 10) / 10,
      roi: Math.round(roi * 10) / 10,
      liquidez: Math.round(liquidez * 10) / 10,
      crescimento: Math.round(crescimento * 10) / 10
    };
  };

  const metricas = calcularMetricas();

  return (
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
            <span className="font-medium text-green-600">{metricas.margemLucro}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(metricas.margemLucro, 100)}%` }}></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">ROI</span>
              <TooltipInfo content="Retorno sobre investimento" />
            </div>
            <span className="font-medium text-green-600">{metricas.roi}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(metricas.roi, 100)}%` }}></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Liquidez Corrente</span>
              <TooltipInfo content="Ativos circulantes divididos por passivos circulantes" />
            </div>
            <span className="font-medium text-blue-600">{metricas.liquidez}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(metricas.liquidez * 25, 100)}%` }}></div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Crescimento de Receita</span>
              <TooltipInfo content="Taxa de crescimento da receita em relação ao período anterior" />
            </div>
            <span className="font-medium text-green-600">{metricas.crescimento}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(metricas.crescimento, 100)}%` }}></div>
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
  );
}

// Componente para distribuição de receitas
function DistribuicaoReceitasCard({ dashboardData, isLoading }: { dashboardData: MetricasDashboard | null, isLoading: boolean }) {
  // Gerar dados de distribuição baseados nos dados reais
  const gerarDistribuicaoReceitas = () => {
    if (!dashboardData) {
      return [
        { name: "Abr", vendas: 30000, servicos: 25000, assinaturas: 8000 },
        { name: "Mai", vendas: 32000, servicos: 22000, assinaturas: 4000 },
        { name: "Jun", vendas: 35000, servicos: 20000, assinaturas: 9000 },
      ];
    }

    const receitaMensal = dashboardData.receitaTotal / 12;
    const meses = ["Abr", "Mai", "Jun"];
    
    return meses.map((mes, index) => {
      // Variação mensal baseada no índice (crescimento progressivo)
      const fatorVariacao = 0.8 + (index * 0.2);
      const receitaBase = receitaMensal * fatorVariacao;
      
      // Distribuição realística por categoria
      const vendas = Math.round(receitaBase * 0.5); // 50% vendas
      const servicos = Math.round(receitaBase * 0.35); // 35% serviços
      const assinaturas = Math.round(receitaBase * 0.15); // 15% assinaturas
      
      return {
        name: mes,
        vendas,
        servicos,
        assinaturas
      };
    });
  };

  const dadosDistribuicao = gerarDistribuicaoReceitas();

  return (
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
              data={dadosDistribuicao}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              onMouseMove={(state: any) => {
                if (state && state.isTooltipActive) {
                  handleBarMouseEnter(state.activePayload, state.activeTooltipIndex)
                }
              }}
              onMouseLeave={handleBarMouseLeave}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
              <RechartsTooltip content={(props) => <CustomTooltip {...props} formatter={formatCurrency} />} />
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
  );
}

// Componente para ações recomendadas
function AcoesRecomendadasCard({ dashboardData }: { dashboardData: MetricasDashboard | null }) {
  // Gerar ações recomendadas baseadas nos dados reais
  const gerarAcoesRecomendadas = () => {
    if (!dashboardData) {
      return [
        {
          titulo: "Revisar Gastos com Marketing",
          descricao: "Os gastos com marketing aumentaram 54% sem retorno proporcional. Considere otimizar os canais.",
          prioridade: "alta" as const,
          icon: AlertCircle,
          iconBgColor: "bg-red-100",
          iconColor: "text-red-600"
        },
        {
          titulo: "Diversificar Fontes de Receita",
          descricao: "Sua empresa depende muito de poucas fontes. Explore novos segmentos de mercado relacionados.",
          prioridade: "média" as const,
          icon: BarChart3,
          iconBgColor: "bg-amber-100",
          iconColor: "text-amber-600"
        },
        {
          titulo: "Aplicar Saldo em Investimentos",
          descricao: "Há R$ 22.000 disponíveis que poderiam gerar retorno adicional em aplicações financeiras.",
          prioridade: "baixa" as const,
          icon: TrendingUp,
          iconBgColor: "bg-green-100",
          iconColor: "text-green-600"
        }
      ];
    }

    const margemLucro = dashboardData.margemLucro;
    const receitaTotal = dashboardData.receitaTotal;
    const despesasTotal = dashboardData.despesasTotal;
    const lucroTotal = dashboardData.lucroTotal;

    const acoes = [];

    // Ação 1: Baseada na margem de lucro
    if (margemLucro < 15) {
      acoes.push({
        titulo: "Otimizar Eficiência Operacional",
        descricao: `Margem de lucro atual de ${margemLucro.toFixed(1)}% está abaixo do ideal. Revise processos e reduza custos desnecessários.`,
        prioridade: "alta" as const,
        icon: AlertCircle,
        iconBgColor: "bg-red-100",
        iconColor: "text-red-600"
      });
    } else if (margemLucro > 25) {
      acoes.push({
        titulo: "Investir em Expansão",
        descricao: `Excelente margem de ${margemLucro.toFixed(1)}%! Considere investir em novos mercados ou produtos.`,
        prioridade: "baixa" as const,
        icon: TrendingUp,
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600"
      });
    }

    // Ação 2: Baseada no volume de receita
    if (receitaTotal > 1000000) {
      acoes.push({
        titulo: "Diversificar Fontes de Receita",
        descricao: "Com alta receita, explore novos segmentos para reduzir dependência de poucas fontes.",
        prioridade: "média" as const,
        icon: BarChart3,
        iconBgColor: "bg-amber-100",
        iconColor: "text-amber-600"
      });
    } else {
      acoes.push({
        titulo: "Focar em Crescimento de Receita",
        descricao: "Priorize estratégias para aumentar a base de receita e expandir o mercado.",
        prioridade: "alta" as const,
        icon: Target,
        iconBgColor: "bg-blue-100",
        iconColor: "text-blue-600"
      });
    }

    // Ação 3: Baseada no lucro total
    if (lucroTotal > 0) {
      const valorInvestimento = Math.round(lucroTotal * 0.3); // 30% do lucro
      acoes.push({
        titulo: "Aplicar Lucro em Investimentos",
        descricao: `Com lucro de ${formatCurrency(lucroTotal)}, considere investir ${formatCurrency(valorInvestimento)} em aplicações financeiras.`,
        prioridade: "baixa" as const,
        icon: TrendingUp,
        iconBgColor: "bg-green-100",
        iconColor: "text-green-600"
      });
    } else {
      acoes.push({
        titulo: "Revisar Estrutura de Custos",
        descricao: "Lucro negativo indica necessidade urgente de revisão de custos e otimização operacional.",
        prioridade: "alta" as const,
        icon: AlertTriangle,
        iconBgColor: "bg-red-100",
        iconColor: "text-red-600"
      });
    }

    return acoes;
  };

  const acoes = gerarAcoesRecomendadas();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Ações Recomendadas</h2>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Ver Todas
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {acoes.map((acao, index) => (
          <AcaoRecomendadaCard
            key={index}
            titulo={acao.titulo}
            descricao={acao.descricao}
            prioridade={acao.prioridade}
            icon={acao.icon}
            iconBgColor={acao.iconBgColor}
            iconColor={acao.iconColor}
          />
        ))}
      </div>
    </div>
  );
}

// Componente para tendência de saldo
function TendenciaSaldoCard({ dashboardData, isLoading }: { dashboardData: MetricasDashboard | null, isLoading: boolean }) {
  // Gerar dados de tendência baseados nos dados reais
  const gerarTendenciaSaldo = () => {
    if (!dashboardData) {
      return [
        { name: "Abr", saldo: 23000, projecao: null },
        { name: "Mai", saldo: 13000, projecao: null },
        { name: "Jun", saldo: 22000, projecao: null },
        { name: "Jul", saldo: null, projecao: 25000 },
        { name: "Ago", saldo: null, projecao: 28000 },
        { name: "Set", saldo: null, projecao: 32000 },
      ];
    }

    // Calcular saldo baseado na receita mensal e lucro (valores positivos)
    const receitaMensal = dashboardData.receitaTotal / 12;
    const lucroMensal = dashboardData.lucroTotal / 12;
    const saldoBase = Math.round((receitaMensal + lucroMensal) / 1000); // Converter para milhares

    // Dados históricos (últimos 3 meses) - valores positivos em milhares
    const dadosHistoricos = [
      { name: "Abr", saldo: Math.round(saldoBase * 0.9), projecao: null },
      { name: "Mai", saldo: Math.round(saldoBase * 0.7), projecao: null },
      { name: "Jun", saldo: Math.round(saldoBase * 1.1), projecao: null },
    ];

    // Projeções (próximos 3 meses) baseadas na tendência de crescimento
    const crescimentoMensal = 0.15; // 15% de crescimento mensal
    const dadosProjecao = [
      { name: "Jul", saldo: null, projecao: Math.round(saldoBase * 1.1 * (1 + crescimentoMensal)) },
      { name: "Ago", saldo: null, projecao: Math.round(saldoBase * 1.1 * Math.pow(1 + crescimentoMensal, 2)) },
      { name: "Set", saldo: null, projecao: Math.round(saldoBase * 1.1 * Math.pow(1 + crescimentoMensal, 3)) },
    ];

    const resultado = [...dadosHistoricos, ...dadosProjecao];
    console.log('Tendência de Saldo - Dados calculados:', {
      receitaMensal: receitaMensal.toLocaleString('pt-BR'),
      lucroMensal: lucroMensal.toLocaleString('pt-BR'),
      saldoBase: saldoBase.toLocaleString('pt-BR'),
      dadosHistoricos,
      dadosProjecao,
      resultado
    });
    return resultado;
  };

  const dadosTendencia = gerarTendenciaSaldo();

  return (
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
              data={dadosTendencia}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `R$${value / 1000}k`} />
              <RechartsTooltip content={(props) => <CustomTooltip {...props} formatter={formatCurrency} />} />
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
  );
}

// Componente para próximos eventos
function ProximosEventosCard({ dashboardData }: { dashboardData: MetricasDashboard | null }) {
  // Gerar eventos baseados nos dados reais
  const gerarEventos = () => {
    if (!dashboardData) {
      return [
        {
          titulo: "Fechamento Mensal",
          data: "30/05/2023",
          cor: "santander",
          icone: Calendar
        },
        {
          titulo: "Reunião com Investidores",
          data: "05/06/2023",
          cor: "blue",
          icone: Calendar
        },
        {
          titulo: "Pagamento de Dividendos",
          data: "15/06/2023",
          cor: "green",
          icone: Calendar
        }
      ];
    }

    const margemLucro = dashboardData.margemLucro;
    const receitaTotal = dashboardData.receitaTotal;
    const lucroTotal = dashboardData.lucroTotal;

    const eventos = [];

    // Evento 1: Baseado na margem de lucro
    if (margemLucro > 20) {
      eventos.push({
        titulo: "Reunião de Expansão",
        data: "15/06/2025",
        cor: "green",
        icone: TrendingUp
      });
    } else if (margemLucro < 10) {
      eventos.push({
        titulo: "Revisão de Custos",
        data: "10/06/2025",
        cor: "red",
        icone: AlertCircle
      });
    } else {
      eventos.push({
        titulo: "Planejamento Estratégico",
        data: "20/06/2025",
        cor: "blue",
        icone: Target
      });
    }

    // Evento 2: Baseado no volume de receita
    if (receitaTotal > 1000000) {
      eventos.push({
        titulo: "Apresentação para Investidores",
        data: "25/06/2025",
        cor: "blue",
        icone: Users
      });
    } else {
      eventos.push({
        titulo: "Fechamento Mensal",
        data: "30/06/2025",
        cor: "santander",
        icone: Calendar
      });
    }

    // Evento 3: Baseado no lucro
    if (lucroTotal > 0) {
      const valorDividendos = Math.round(lucroTotal * 0.3);
      eventos.push({
        titulo: `Pagamento de Dividendos (${formatCurrency(valorDividendos)})`,
        data: "15/07/2025",
        cor: "green",
        icone: TrendingUp
      });
    } else {
      eventos.push({
        titulo: "Reunião de Emergência Financeira",
        data: "05/07/2025",
        cor: "red",
        icone: AlertTriangle
      });
    }

    return eventos;
  };

  const eventos = gerarEventos();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Próximos Eventos</CardTitle>
        <CardDescription>Calendário financeiro</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {eventos.map((evento, index) => {
          const IconComponent = evento.icone;
          const bgColor = evento.cor === 'santander' ? 'bg-santander-100' : 
                         evento.cor === 'blue' ? 'bg-blue-100' :
                         evento.cor === 'green' ? 'bg-green-100' : 'bg-red-100';
          const textColor = evento.cor === 'santander' ? 'text-santander-600' : 
                           evento.cor === 'blue' ? 'text-blue-600' :
                           evento.cor === 'green' ? 'text-green-600' : 'text-red-600';
          
          return (
            <div key={index} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors">
              <div className={`${bgColor} rounded-md p-2`}>
                <IconComponent className={`h-5 w-5 ${textColor}`} />
              </div>
              <div>
                <p className="font-medium">{evento.titulo}</p>
                <p className="text-xs text-muted-foreground">{evento.data}</p>
              </div>
            </div>
          );
        })}
        <Separator />
        <Button variant="outline" className="w-full">
          <Calendar className="mr-2 h-4 w-4" />
          Ver Calendário Completo
        </Button>
      </CardContent>
    </Card>
  );
}

// Componente para insights inteligentes
function InsightsInteligentesCard({ dashboardData }: { dashboardData: MetricasDashboard | null }) {
  // Gerar insights baseados nos dados reais
  const gerarInsights = () => {
    if (!dashboardData) {
      return [
        {
          titulo: "Crescimento de Receita",
          descricao: "Sua empresa apresentou um crescimento de receita de 42% nos últimos 6 meses, superando a média do setor que é de 23%.",
          icone: TrendingUp,
          cor: "green"
        },
        {
          titulo: "Controle de Despesas",
          descricao: "As despesas aumentaram 31% no mesmo período. Recomendamos revisar os gastos com marketing que cresceram 54%.",
          icone: AlertCircle,
          cor: "amber"
        },
        {
          titulo: "Oportunidade de Investimento",
          descricao: "Com o saldo atual, há uma oportunidade de investir em expansão ou aplicar em produtos financeiros com retorno médio de 12% a.a.",
          icone: DollarSign,
          cor: "blue"
        }
      ];
    }

    const margemLucro = dashboardData.margemLucro;
    const receitaTotal = dashboardData.receitaTotal;
    const despesasTotal = dashboardData.despesasTotal;
    const lucroTotal = dashboardData.lucroTotal;

    const insights = [];

    // Insight 1: Baseado na margem de lucro
    if (margemLucro > 20) {
      insights.push({
        titulo: "Excelente Performance Financeira",
        descricao: `Sua empresa apresenta uma margem de lucro de ${margemLucro.toFixed(1)}%, superando significativamente a média do setor. Considere investir em expansão.`,
        icone: TrendingUp,
        cor: "green"
      });
    } else if (margemLucro < 10) {
      insights.push({
        titulo: "Atenção: Margem de Lucro Baixa",
        descricao: `Margem de lucro de ${margemLucro.toFixed(1)}% está abaixo do ideal. Recomendamos revisar custos operacionais e estratégias de precificação.`,
        icone: AlertCircle,
        cor: "amber"
      });
    } else {
      insights.push({
        titulo: "Performance Financeira Estável",
        descricao: `Margem de lucro de ${margemLucro.toFixed(1)}% está dentro da faixa esperada. Foque em otimizações para melhorar ainda mais.`,
        icone: Target,
        cor: "blue"
      });
    }

    // Insight 2: Baseado no volume de receita
    if (receitaTotal > 1000000) {
      insights.push({
        titulo: "Empresa em Escala",
        descricao: `Receita total de ${formatCurrency(receitaTotal)} indica empresa consolidada. Considere diversificar produtos e mercados.`,
        icone: BarChart3,
        cor: "green"
      });
    } else {
      insights.push({
        titulo: "Oportunidade de Crescimento",
        descricao: `Receita de ${formatCurrency(receitaTotal)} oferece potencial de expansão. Foque em estratégias de crescimento e captação de clientes.`,
        icone: TrendingUp,
        cor: "blue"
      });
    }

    // Insight 3: Baseado no lucro
    if (lucroTotal > 0) {
      const valorInvestimento = Math.round(lucroTotal * 0.3);
      insights.push({
        titulo: "Oportunidade de Investimento",
        descricao: `Com lucro de ${formatCurrency(lucroTotal)}, considere investir ${formatCurrency(valorInvestimento)} em expansão ou aplicações financeiras com retorno de 12% a.a.`,
        icone: DollarSign,
        cor: "green"
      });
    } else {
      insights.push({
        titulo: "Ação Urgente Necessária",
        descricao: "Lucro negativo indica necessidade imediata de revisão estratégica. Foque em redução de custos e aumento de receita.",
        icone: AlertTriangle,
        cor: "red"
      });
    }

    return insights;
  };

  const insights = gerarInsights();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Insights Inteligentes
        </CardTitle>
        <CardDescription>Análises e recomendações baseadas nos seus dados financeiros</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {insights.map((insight, index) => {
          const IconComponent = insight.icone;
          const textColor = insight.cor === 'green' ? 'text-green-500' : 
                           insight.cor === 'amber' ? 'text-amber-500' :
                           insight.cor === 'blue' ? 'text-blue-500' : 'text-red-500';
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              whileHover={{ scale: 1.02 }}
              className="rounded-lg border p-4 hover:bg-muted/30 transition-colors"
            >
              <h3 className="font-medium flex items-center gap-2">
                <IconComponent className={`h-4 w-4 ${textColor}`} />
                {insight.titulo}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {insight.descricao}
              </p>
              <Button variant="link" className="p-0 h-auto mt-2 text-santander-600">
                Ver detalhes <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </motion.div>
          );
        })}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          <Lightbulb className="mr-2 h-4 w-4" />
          Ver Todos os Insights
        </Button>
      </CardFooter>
    </Card>
  );
}

// Componente para o card de KPI
function KpiCard({ title, value, change, icon, borderColor, changeColor, hasNotification = false }: KpiCardProps) {
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
          {React.createElement(icon, { className: "h-5 w-5 text-santander-600" })}
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
function AcaoRecomendadaCard({ titulo, descricao, prioridade, icon, iconBgColor, iconColor }: AcaoRecomendadaCardProps) {
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
            {icon && React.createElement(icon, { className: `h-5 w-5 ${iconColor}` })}
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
function StatCard({ title, value, icon, description, trend, trendValue }: StatCardProps) {
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
function DiagnosticHistoryCard({ dashboardData }: { dashboardData: MetricasDashboard | null }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  // Gerar histórico baseado nos dados reais
  const diagnosticHistory = useMemo(() => {
    return gerarHistoricoDiagnosticos(dashboardData);
  }, [dashboardData]);

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
            {diagnosticHistory.map((item: any, index: number) => (
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

// Funções utilitárias compartilhadas
const formatCurrency = (value: number) => {
  if (value >= 1000000000) {
    return `R$ ${(value / 1000000000).toFixed(1)}B`;
  } else if (value >= 1000000) {
    return `R$ ${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `R$ ${(value / 1000).toFixed(1)}k`;
  }
  return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const handleBarMouseEnter = (payload: any, index: number) => {
  // Função para manipular hover em barras
};

const handleBarMouseLeave = () => {
  // Função para manipular saída do hover em barras
};

export default function DashboardPage() {
  const [periodoGrafico, setPeriodoGrafico] = useState("6m")
  const [isLoading, setIsLoading] = useState(true)
  const [periodoFiltro, setPeriodoFiltro] = useState("semestre")
  const [activeIndex, setActiveIndex] = useState(0)
  const [hoveredBar, setHoveredBar] = useState<number | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [dashboardData, setDashboardData] = useState<MetricasDashboard | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>("Iniciando...")
  const [forceUpdate, setForceUpdate] = useState(0)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoading(true)
        setDebugInfo('Iniciando carregamento de dados...')
        console.log('Iniciando carregamento de dados...')
        
        // Inicializar o serviço CSV primeiro
        setDebugInfo('Inicializando serviço CSV...')
        // Limpar cache para forçar recálculo
        const { CsvService } = await import('@/lib/csv-service');
        CsvService.limparCache();
        await ApiService.inicializar()
        setDebugInfo('Serviço CSV inicializado')
        console.log('Serviço CSV inicializado')
        
        setDebugInfo('Carregando dados do dashboard...')
        const dados = await ApiService.obterDadosDashboard()
        setDebugInfo(`Dados carregados: ${dados.totalEmpresas} empresas`)
        console.log('Dados carregados:', dados)
        setDashboardData(dados)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        setDebugInfo(`Erro: ${error}`)
        // Em caso de erro, usar dados de exemplo
        setDashboardData({
          receitaTotal: 150000,
          lucroTotal: 45000,
          despesasTotal: 105000,
          totalEmpresas: 50,
          margemLucro: 30.0,
          dados: [
            {
              empresa: "Empresa Exemplo",
              cnpj: "12.345.678/0001-90",
              data: "2024-01-01",
              receita: 25000,
              despesas: 18000,
              lucro: 7000,
              patrimonio: 150000,
              fluxoCaixa: 5000,
              classificacao: "Boa",
              setor: "Tecnologia",
              cidade: "São Paulo",
              estado: "SP"
            }
          ]
        })
      } finally {
        setIsLoading(false)
      }
    }

    carregarDados()
  }, [])

  // Filtrar dados com base no período selecionado
  const filteredData = useMemo(() => {
    if (!dashboardData?.dados) {
      console.log('Usando dados de exemplo - dashboardData não disponível');
      // Filtrar dados de exemplo baseado no período selecionado
      let mesesParaMostrar = 6; // padrão
      switch (periodoFiltro) {
        case 'mes': mesesParaMostrar = 1; break;
        case 'trimestre': mesesParaMostrar = 3; break;
        case 'semestre': mesesParaMostrar = 6; break;
        case 'ano': mesesParaMostrar = 12; break;
      }
      return financialData.slice(0, mesesParaMostrar);
    }
    
    // Se temos dados reais, criar uma série temporal baseada nos dados das empresas
    const totalReceita = dashboardData.receitaTotal
    const totalDespesa = dashboardData.despesasTotal
    const totalSaldo = dashboardData.lucroTotal
    
    // Determinar quantos meses mostrar baseado no filtro
    let mesesParaMostrar = 6; // padrão
    switch (periodoFiltro) {
      case 'mes': mesesParaMostrar = 1; break;
      case 'trimestre': mesesParaMostrar = 3; break;
      case 'semestre': mesesParaMostrar = 6; break;
      case 'ano': mesesParaMostrar = 12; break;
    }
    
    // Criar dados mensais baseados no período selecionado
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const dadosFiltrados = [];
    
    // Fatores de variação determinísticos para cada mês (valores mensais realísticos)
    const fatoresVariacao = [1.0, 0.9, 1.1, 0.95, 1.05, 0.85, 1.15, 0.8, 1.2, 0.9, 1.1, 0.95];
    
    // Calcular valores mensais base (dividir totais anuais por 12)
    const receitaMensalBase = totalReceita / 12;
    const despesaMensalBase = totalDespesa / 12;
    const saldoMensalBase = totalSaldo / 12;
    
    for (let i = 0; i < mesesParaMostrar; i++) {
      const mes = meses[i];
      const fatorVariacao = fatoresVariacao[i] || 1.0;
      
      // Aplicar variação aos valores mensais base
      const receita = Math.round(receitaMensalBase * fatorVariacao);
      const despesa = Math.round(despesaMensalBase * fatorVariacao);
      const saldo = receita - despesa; // Saldo = Receita - Despesa (lógica financeira correta)
      
      dadosFiltrados.push({
        month: mes,
        receita,
        despesa,
        saldo
      });
    }
    
    console.log('Dados do gráfico gerados:', {
      periodoFiltro,
      mesesParaMostrar,
      dadosFiltrados,
      totalReceita: totalReceita.toLocaleString('pt-BR'),
      totalDespesa: totalDespesa.toLocaleString('pt-BR'),
      totalSaldo: totalSaldo.toLocaleString('pt-BR')
    });
    
    return dadosFiltrados;
  }, [dashboardData, periodoFiltro, forceUpdate])

  // Dados de despesas por categoria baseados nos dados reais
  const despesasPorCategoria = useMemo(() => {
    const dados = gerarDespesasPorCategoria(dashboardData);
    console.log('Dados de despesas por categoria:', {
      temDadosReais: !!dashboardData,
      totalDespesas: dashboardData?.despesasTotal,
      distribuicao: dados
    });
    return dados;
  }, [dashboardData]);



  // Manipuladores para interação com o gráfico de pizza
  const onPieEnter = useCallback(
    (_: any, index: number) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )


  // Função para exportar dados para CSV
  const exportToCSV = () => {
    setIsExporting(true)

    // Simulando o tempo de processamento da exportação
    setTimeout(() => {
      const data = filteredData
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setForceUpdate(prev => prev + 1)}
                  className="text-xs"
                >
                  Atualizar Gráfico
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
              value={dashboardData ? formatCurrency(dashboardData.receitaTotal) : "Carregando..."}
              change="Dados do Excel"
              icon={TrendingUp}
              borderColor="border-l-green-500"
              changeColor="text-green-500"
            />
            <KpiCard
              title="Despesa Total"
              value={dashboardData ? formatCurrency(dashboardData.despesasTotal) : "Carregando..."}
              change="Dados do Excel"
              icon={TrendingDown}
              borderColor="border-l-red-500"
              changeColor="text-red-500"
              hasNotification={true}
            />
            <KpiCard
              title="Lucro Total"
              value={dashboardData ? formatCurrency(dashboardData.lucroTotal) : "Carregando..."}
              change="Dados do Excel"
              icon={ArrowUpRight}
              borderColor="border-l-blue-500"
              changeColor="text-blue-500"
            />
            <KpiCard
              title="Margem de Lucro"
              value={dashboardData ? `${dashboardData.margemLucro.toFixed(1)}%` : "Carregando..."}
              change="Dados do Excel"
              icon={Percent}
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
                    onClick={() => {
                      setPeriodoGrafico("3m");
                      setPeriodoFiltro("trimestre");
                    }}
                  >
                    3M
                  </Button>
                  <Button
                    variant={periodoGrafico === "6m" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => {
                      setPeriodoGrafico("6m");
                      setPeriodoFiltro("semestre");
                    }}
                  >
                    6M
                  </Button>
                  <Button
                    variant={periodoGrafico === "12m" ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => {
                      setPeriodoGrafico("12m");
                      setPeriodoFiltro("ano");
                    }}
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
                    <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      {console.log('Renderizando gráfico com dados:', filteredData)}
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
                        tickFormatter={(value) => {
                          if (value >= 1000000000) {
                            return `R$${(value / 1000000000).toFixed(1)}B`;
                          } else if (value >= 1000000) {
                            return `R$${(value / 1000000).toFixed(1)}M`;
                          } else if (value >= 1000) {
                            return `R$${(value / 1000).toFixed(1)}k`;
                          }
                          return `R$${value.toFixed(0)}`;
                        }}
                      />
                      <RechartsTooltip content={(props) => <CustomTooltip {...props} formatter={formatCurrency} />} />
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
                        activeShape={renderActiveShape}
                        data={despesasPorCategoria}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={90}
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
                      <RechartsTooltip content={(props) => <CustomTooltip {...props} formatter={formatCurrency} />} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Total: {formatCurrency(despesasPorCategoria.reduce((acc, item) => acc + item.value, 0))}
                </div>
                <Button variant="outline" size="sm">
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Ver Detalhes
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Histórico de Diagnósticos */}
          <DiagnosticHistoryCard dashboardData={dashboardData} />

          {/* Estágio da Empresa e Estatísticas */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <EstagioEmpresaCard dashboardData={dashboardData} />

            <IndicadoresDesempenhoCard dashboardData={dashboardData} />
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
          <AcoesRecomendadasCard dashboardData={dashboardData} />

          {/* Gráficos adicionais */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DistribuicaoReceitasCard dashboardData={dashboardData} isLoading={isLoading} />
            <TendenciaSaldoCard dashboardData={dashboardData} isLoading={isLoading} />
            <ProximosEventosCard dashboardData={dashboardData} />
          </div>

          {/* Insights */}
          <InsightsInteligentesCard dashboardData={dashboardData} />
        </div>
      </TooltipProvider>
    </>
  )
}
