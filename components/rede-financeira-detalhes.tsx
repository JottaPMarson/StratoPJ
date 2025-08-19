"use client"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

interface RedeFinanceiraDetalhesProps {
  periodo: { inicio: Date; fim: Date }
}

export function RedeFinanceiraDetalhes({ periodo }: RedeFinanceiraDetalhesProps) {
  // Dados simulados para métricas da rede
  const metricas = {
    totalNos: 45,
    totalConexoes: 78,
    densidade: 0.38,
    centralidade: 0.72,
    reciprocidade: 0.65,
    diametro: 4,
    componentesConectados: 2,
    coeficienteAgrupamento: 0.58,
    scoreRisco: 68,
    scoreResiliencia: 76,
    scoreEficiencia: 82,
    principaisNos: [
      { nome: "Fornecedor X", tipo: "fornecedor", centralidade: 0.85 },
      { nome: "Cliente A", tipo: "cliente", centralidade: 0.79 },
      { nome: "Banco Alpha", tipo: "banco", centralidade: 0.72 },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Resumo da Rede</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    Resumo das principais métricas da sua rede financeira no período selecionado.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Badge variant="outline">{metricas.totalNos} nós</Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Conexões</span>
            <span className="font-medium">{metricas.totalConexoes}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Densidade</span>
            <span className="font-medium">{metricas.densidade.toFixed(2)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Diâmetro</span>
            <span className="font-medium">{metricas.diametro}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Componentes</span>
            <span className="font-medium">{metricas.componentesConectados}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Scores da Rede</h3>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <span>Resiliência</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Capacidade da rede de manter operações mesmo com a remoção de nós.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="font-medium">{metricas.scoreResiliencia}/100</span>
            </div>
            <Progress value={metricas.scoreResiliencia} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <span>Eficiência</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Eficiência dos fluxos financeiros na rede.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="font-medium">{metricas.scoreEficiencia}/100</span>
            </div>
            <Progress value={metricas.scoreEficiencia} className="h-2" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                <span>Risco</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Nível de risco associado à estrutura da rede.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="font-medium">{metricas.scoreRisco}/100</span>
            </div>
            <Progress value={metricas.scoreRisco} className="h-2" />
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="font-medium">Nós Principais</h3>

        <div className="space-y-2">
          {metricas.principaisNos.map((no, index) => (
            <div key={index} className="flex items-center justify-between bg-muted/40 p-2 rounded-md">
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    no.tipo === "fornecedor"
                      ? "bg-amber-500"
                      : no.tipo === "cliente"
                        ? "bg-emerald-500"
                        : "bg-violet-500"
                  }`}
                ></div>
                <span className="text-sm font-medium">{no.nome}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {no.tipo === "fornecedor" ? "Fornecedor" : no.tipo === "cliente" ? "Cliente" : "Banco"}
                </Badge>
                <span className="text-xs font-medium">{(no.centralidade * 100).toFixed(0)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
