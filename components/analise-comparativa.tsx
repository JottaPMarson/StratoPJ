"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { AlertTriangle, TrendingUp, TrendingDown } from "lucide-react"

interface AnaliseComparativaProps {
  periodo: { inicio: Date; fim: Date }
}

// Dados simulados para os gráficos
const dadosRadar = [
  { atributo: "Centralidade", empresa: 75, setor: 65, benchmark: 80 },
  { atributo: "Densidade", empresa: 60, setor: 55, benchmark: 70 },
  { atributo: "Reciprocidade", empresa: 85, setor: 70, benchmark: 75 },
  { atributo: "Eficiência", empresa: 70, setor: 60, benchmark: 85 },
  { atributo: "Resiliência", empresa: 65, setor: 50, benchmark: 75 },
  { atributo: "Diversificação", empresa: 55, setor: 65, benchmark: 80 },
]

const dadosBarras = [
  { metrica: "Fluxo de Caixa", empresa: 72, setor: 65, benchmark: 80 },
  { metrica: "Prazo Médio", empresa: 65, setor: 60, benchmark: 75 },
  { metrica: "Concentração", empresa: 58, setor: 62, benchmark: 45 },
  { metrica: "Risco", empresa: 45, setor: 55, benchmark: 40 },
  { metrica: "Crescimento", empresa: 68, setor: 60, benchmark: 75 },
]

export function AnaliseComparativa({ periodo }: AnaliseComparativaProps) {
  const [setorComparacao, setSetorComparacao] = useState("varejo")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <p className="text-sm font-medium">
            Sua empresa está <span className="text-amber-500">15% abaixo</span> da média do setor em termos de
            diversificação de fornecedores.
          </p>
        </div>

        <Select value={setorComparacao} onValueChange={setSetorComparacao}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Setor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="varejo">Varejo</SelectItem>
            <SelectItem value="servicos">Serviços</SelectItem>
            <SelectItem value="industria">Indústria</SelectItem>
            <SelectItem value="tecnologia">Tecnologia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Comparativo de Métricas de Rede</CardTitle>
            <CardDescription>Comparação com média do setor e benchmark</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                empresa: {
                  label: "Sua Empresa",
                  color: "hsl(var(--chart-1))",
                },
                setor: {
                  label: "Média do Setor",
                  color: "hsl(var(--chart-2))",
                },
                benchmark: {
                  label: "Benchmark",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dadosRadar}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="atributo" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Sua Empresa"
                    dataKey="empresa"
                    stroke="var(--color-empresa)"
                    fill="var(--color-empresa)"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Média do Setor"
                    dataKey="setor"
                    stroke="var(--color-setor)"
                    fill="var(--color-setor)"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name="Benchmark"
                    dataKey="benchmark"
                    stroke="var(--color-benchmark)"
                    fill="var(--color-benchmark)"
                    fillOpacity={0.6}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Indicadores Financeiros Comparativos</CardTitle>
            <CardDescription>Comparação com média do setor e benchmark</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                empresa: {
                  label: "Sua Empresa",
                  color: "hsl(var(--chart-1))",
                },
                setor: {
                  label: "Média do Setor",
                  color: "hsl(var(--chart-2))",
                },
                benchmark: {
                  label: "Benchmark",
                  color: "hsl(var(--chart-3))",
                },
              }}
              className="h-[400px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosBarras}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metrica" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar dataKey="empresa" fill="var(--color-empresa)" />
                  <Bar dataKey="setor" fill="var(--color-setor)" />
                  <Bar dataKey="benchmark" fill="var(--color-benchmark)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insights Comparativos</CardTitle>
          <CardDescription>Principais diferenças em relação ao setor e benchmark</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
                <h3 className="font-medium">Pontos Fortes</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span>Reciprocidade</span>
                  <Badge variant="outline" className="bg-emerald-50">
                    +15%
                  </Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Fluxo de Caixa</span>
                  <Badge variant="outline" className="bg-emerald-50">
                    +7%
                  </Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Crescimento</span>
                  <Badge variant="outline" className="bg-emerald-50">
                    +8%
                  </Badge>
                </li>
              </ul>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-rose-500" />
                <h3 className="font-medium">Pontos Fracos</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between">
                  <span>Diversificação</span>
                  <Badge variant="outline" className="bg-rose-50">
                    -25%
                  </Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Resiliência</span>
                  <Badge variant="outline" className="bg-rose-50">
                    -10%
                  </Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Concentração</span>
                  <Badge variant="outline" className="bg-rose-50">
                    -4%
                  </Badge>
                </li>
              </ul>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h3 className="font-medium">Oportunidades</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></span>
                  <span>Diversificar base de fornecedores</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></span>
                  <span>Melhorar resiliência da rede</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5"></span>
                  <span>Reduzir concentração de clientes</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
