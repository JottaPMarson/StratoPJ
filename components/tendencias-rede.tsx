"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TendenciasRedeProps {
  periodo: { inicio: Date; fim: Date }
}

// Dados simulados para os gráficos
const dadosCrescimento = [
  { mes: "Jan", nos: 32, conexoes: 48, transacoes: 120 },
  { mes: "Fev", nos: 35, conexoes: 52, transacoes: 135 },
  { mes: "Mar", nos: 37, conexoes: 58, transacoes: 142 },
  { mes: "Abr", nos: 38, conexoes: 62, transacoes: 158 },
  { mes: "Mai", nos: 42, conexoes: 70, transacoes: 172 },
  { mes: "Jun", nos: 45, conexoes: 78, transacoes: 185 },
]

const dadosFluxo = [
  { mes: "Jan", entrada: 450000, saida: 380000, saldo: 70000 },
  { mes: "Fev", entrada: 480000, saida: 410000, saldo: 70000 },
  { mes: "Mar", entrada: 520000, saida: 430000, saldo: 90000 },
  { mes: "Abr", entrada: 510000, saida: 460000, saldo: 50000 },
  { mes: "Mai", entrada: 550000, saida: 470000, saldo: 80000 },
  { mes: "Jun", entrada: 580000, saida: 490000, saldo: 90000 },
]

const dadosConcentracao = [
  { mes: "Jan", clientes: 0.68, fornecedores: 0.72, bancos: 0.45 },
  { mes: "Fev", clientes: 0.65, fornecedores: 0.74, bancos: 0.45 },
  { mes: "Mar", clientes: 0.62, fornecedores: 0.71, bancos: 0.48 },
  { mes: "Abr", clientes: 0.6, fornecedores: 0.68, bancos: 0.5 },
  { mes: "Mai", clientes: 0.58, fornecedores: 0.65, bancos: 0.52 },
  { mes: "Jun", clientes: 0.55, fornecedores: 0.62, bancos: 0.55 },
]

const dadosEstabilidade = [
  { mes: "Jan", estabilidade: 72, volatilidade: 28 },
  { mes: "Fev", estabilidade: 75, volatilidade: 25 },
  { mes: "Mar", estabilidade: 78, volatilidade: 22 },
  { mes: "Abr", estabilidade: 76, volatilidade: 24 },
  { mes: "Mai", estabilidade: 80, volatilidade: 20 },
  { mes: "Jun", estabilidade: 82, volatilidade: 18 },
]

export function TendenciasRede({ periodo }: TendenciasRedeProps) {
  const [periodoGrafico, setPeriodoGrafico] = useState("6m")

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Crescimento da Rede</CardTitle>
            <CardDescription>Evolução de nós e conexões ao longo do tempo</CardDescription>
          </div>
          <Select value={periodoGrafico} onValueChange={setPeriodoGrafico}>
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 meses</SelectItem>
              <SelectItem value="6m">6 meses</SelectItem>
              <SelectItem value="1a">1 ano</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              nos: {
                label: "Nós",
                color: "hsl(var(--chart-1))",
              },
              conexoes: {
                label: "Conexões",
                color: "hsl(var(--chart-2))",
              },
              transacoes: {
                label: "Transações",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosCrescimento}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="nos" stroke="var(--color-nos)" strokeWidth={2} />
                <Line type="monotone" dataKey="conexoes" stroke="var(--color-conexoes)" strokeWidth={2} />
                <Line type="monotone" dataKey="transacoes" stroke="var(--color-transacoes)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Fluxo Financeiro</CardTitle>
            <CardDescription>Volume de transações financeiras na rede</CardDescription>
          </div>
          <Badge variant="outline">R$ (mil)</Badge>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              entrada: {
                label: "Entradas",
                color: "hsl(var(--chart-1))",
              },
              saida: {
                label: "Saídas",
                color: "hsl(var(--chart-2))",
              },
              saldo: {
                label: "Saldo",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosFluxo}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="entrada"
                  stroke="var(--color-entrada)"
                  fill="var(--color-entrada)"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="saida"
                  stroke="var(--color-saida)"
                  fill="var(--color-saida)"
                  fillOpacity={0.3}
                />
                <Line type="monotone" dataKey="saldo" stroke="var(--color-saldo)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Índice de Concentração</CardTitle>
            <CardDescription>Concentração por tipo de entidade (0-1)</CardDescription>
          </div>
          <Badge variant="outline">Índice Gini</Badge>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              clientes: {
                label: "Clientes",
                color: "hsl(var(--chart-1))",
              },
              fornecedores: {
                label: "Fornecedores",
                color: "hsl(var(--chart-2))",
              },
              bancos: {
                label: "Bancos",
                color: "hsl(var(--chart-3))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dadosConcentracao}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis domain={[0, 1]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="clientes" stroke="var(--color-clientes)" strokeWidth={2} />
                <Line type="monotone" dataKey="fornecedores" stroke="var(--color-fornecedores)" strokeWidth={2} />
                <Line type="monotone" dataKey="bancos" stroke="var(--color-bancos)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Estabilidade da Rede</CardTitle>
            <CardDescription>Índices de estabilidade e volatilidade</CardDescription>
          </div>
          <Badge variant="outline">Percentual</Badge>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              estabilidade: {
                label: "Estabilidade",
                color: "hsl(var(--chart-1))",
              },
              volatilidade: {
                label: "Volatilidade",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosEstabilidade}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="estabilidade" fill="var(--color-estabilidade)" />
                <Bar dataKey="volatilidade" fill="var(--color-volatilidade)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
