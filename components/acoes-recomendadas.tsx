"use client"

import { useState } from "react"
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Download, Info, ThumbsUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Dados simulados para as ações recomendadas
const acoesRecomendadas = [
  {
    id: 1,
    categoria: "Liquidez",
    titulo: "Melhorar o capital de giro",
    descricao:
      "Sua empresa apresenta um índice de liquidez corrente abaixo do ideal para o setor. Recomendamos ações para melhorar o capital de giro.",
    impacto: "alto",
    prazo: "médio",
    dificuldade: "média",
    passos: [
      "Revisar prazos de pagamento com fornecedores",
      "Otimizar gestão de estoque para reduzir capital parado",
      "Implementar política de cobrança mais eficiente",
    ],
    beneficios: [
      "Aumento da capacidade de pagamento de obrigações de curto prazo",
      "Redução do risco de insolvência",
      "Maior flexibilidade financeira para aproveitar oportunidades",
    ],
    metricas: {
      atual: 1.2,
      meta: 1.8,
      referencia: "A média do setor é de 2.0",
    },
  },
  {
    id: 2,
    categoria: "Endividamento",
    titulo: "Reduzir dívidas de curto prazo",
    descricao:
      "O percentual de dívidas de curto prazo está elevado em relação ao total de dívidas, o que pode pressionar o fluxo de caixa.",
    impacto: "alto",
    prazo: "longo",
    dificuldade: "alta",
    passos: [
      "Renegociar dívidas de curto prazo para longo prazo",
      "Priorizar pagamento de dívidas com juros mais altos",
      "Avaliar possibilidade de consolidação de dívidas",
    ],
    beneficios: [
      "Alívio da pressão sobre o fluxo de caixa de curto prazo",
      "Redução dos custos financeiros totais",
      "Melhoria dos indicadores de endividamento",
    ],
    metricas: {
      atual: 65,
      meta: 40,
      referencia: "A média do setor é de 35%",
    },
  },
  {
    id: 3,
    categoria: "Rentabilidade",
    titulo: "Aumentar margem operacional",
    descricao:
      "A margem operacional está abaixo da média do setor, indicando possíveis ineficiências operacionais ou problemas de precificação.",
    impacto: "médio",
    prazo: "médio",
    dificuldade: "média",
    passos: [
      "Revisar estrutura de custos operacionais",
      "Analisar e ajustar política de preços",
      "Identificar e eliminar processos ineficientes",
    ],
    beneficios: [
      "Aumento da lucratividade por venda",
      "Maior capacidade de investimento",
      "Melhoria da competitividade",
    ],
    metricas: {
      atual: 8,
      meta: 15,
      referencia: "A média do setor é de 18%",
    },
  },
  {
    id: 4,
    categoria: "Rede de Relacionamentos",
    titulo: "Diversificar fornecedores",
    descricao:
      "Sua empresa apresenta alta dependência de poucos fornecedores, o que representa um risco para a continuidade operacional.",
    impacto: "médio",
    prazo: "longo",
    dificuldade: "média",
    passos: [
      "Mapear fornecedores alternativos para insumos críticos",
      "Desenvolver relacionamentos com novos fornecedores",
      "Implementar política de gestão de fornecedores",
    ],
    beneficios: ["Redução de riscos operacionais", "Maior poder de negociação", "Possível redução de custos"],
    metricas: {
      atual: 3,
      meta: 8,
      referencia: "Empresas saudáveis do setor trabalham com pelo menos 7 fornecedores principais",
    },
  },
]

export function AcoesRecomendadas() {
  const [openItems, setOpenItems] = useState<number[]>([1])
  const [feedbackSent, setFeedbackSent] = useState<Record<number, boolean>>({})

  const toggleItem = (id: number) => {
    setOpenItems((current) => (current.includes(id) ? current.filter((itemId) => itemId !== id) : [...current, id]))
  }

  const sendFeedback = (id: number, isPositive: boolean) => {
    setFeedbackSent((prev) => ({ ...prev, [id]: true }))
    // Aqui seria implementada a lógica para enviar o feedback ao servidor
  }

  const getImpactColor = (impacto: string) => {
    switch (impacto) {
      case "alto":
        return "bg-red-100 text-red-800"
      case "médio":
        return "bg-yellow-100 text-yellow-800"
      case "baixo":
        return "bg-green-100 text-green-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getDifficultyColor = (dificuldade: string) => {
    switch (dificuldade) {
      case "alta":
        return "bg-red-100 text-red-800"
      case "média":
        return "bg-yellow-100 text-yellow-800"
      case "baixa":
        return "bg-green-100 text-green-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getTimeframeColor = (prazo: string) => {
    switch (prazo) {
      case "curto":
        return "bg-green-100 text-green-800"
      case "médio":
        return "bg-yellow-100 text-yellow-800"
      case "longo":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <TooltipProvider>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Ações Recomendadas</CardTitle>
              <CardDescription>
                Recomendações personalizadas para melhorar a saúde financeira da sua empresa
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Exportar Plano de Ação
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium">Como interpretar as recomendações</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  As ações são classificadas por impacto, prazo e dificuldade de implementação. Priorize ações de alto
                  impacto e baixa dificuldade para resultados mais rápidos.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {acoesRecomendadas.map((acao) => (
              <Collapsible
                key={acao.id}
                open={openItems.includes(acao.id)}
                onOpenChange={() => toggleItem(acao.id)}
                className="border rounded-lg overflow-hidden"
              >
                <CollapsibleTrigger asChild>
                  <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-1.5 h-12 rounded-full",
                          acao.impacto === "alto"
                            ? "bg-red-500"
                            : acao.impacto === "médio"
                              ? "bg-yellow-500"
                              : "bg-green-500",
                        )}
                      />
                      <div>
                        <h3 className="font-medium">{acao.titulo}</h3>
                        <p className="text-sm text-muted-foreground">{acao.categoria}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-2">
                        <Badge variant="outline" className={getImpactColor(acao.impacto)}>
                          Impacto {acao.impacto}
                        </Badge>
                        <Badge variant="outline" className={getTimeframeColor(acao.prazo)}>
                          Prazo {acao.prazo}
                        </Badge>
                        <Badge variant="outline" className={getDifficultyColor(acao.dificuldade)}>
                          Dificuldade {acao.dificuldade}
                        </Badge>
                      </div>
                      {openItems.includes(acao.id) ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Separator />
                  <div className="p-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Descrição do Problema</h4>
                      <p className="text-sm text-muted-foreground">{acao.descricao}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Passos para Implementação</h4>
                        <ul className="space-y-2">
                          {acao.passos.map((passo, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <ArrowRight className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                              <span>{passo}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Benefícios Esperados</h4>
                        <ul className="space-y-2">
                          {acao.beneficios.map((beneficio, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                              <span>{beneficio}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">Métricas e Objetivos</h4>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{acao.metricas.referencia}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Situação Atual</span>
                            <span className="font-medium">
                              {typeof acao.metricas.atual === "number"
                                ? acao.categoria === "Rentabilidade" || acao.categoria === "Endividamento"
                                  ? `${acao.metricas.atual}%`
                                  : acao.metricas.atual
                                : acao.metricas.atual}
                            </span>
                          </div>
                          <Progress
                            value={(acao.metricas.atual / acao.metricas.meta) * 100}
                            className="h-2"
                            indicatorClassName={
                              acao.metricas.atual / acao.metricas.meta >= 0.9
                                ? "bg-green-500"
                                : acao.metricas.atual / acao.metricas.meta >= 0.6
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>Meta</span>
                            <span className="font-medium">
                              {typeof acao.metricas.meta === "number"
                                ? acao.categoria === "Rentabilidade" || acao.categoria === "Endividamento"
                                  ? `${acao.metricas.meta}%`
                                  : acao.metricas.meta
                                : acao.metricas.meta}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div className="h-full w-full bg-green-500 rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-muted-foreground">
                        Esta recomendação foi gerada com base nos dados financeiros analisados.
                      </span>
                    </div>

                    {feedbackSent[acao.id] ? (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
                        Feedback enviado
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground mr-1">Esta recomendação foi útil?</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => sendFeedback(acao.id, true)}
                        >
                          <ThumbsUp className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            As recomendações são atualizadas mensalmente com base nos novos dados financeiros.
          </p>
        </CardFooter>
      </Card>
    </TooltipProvider>
  )
}
