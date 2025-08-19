"use client"

import { useState } from "react"
import { HelpCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function AssistenteVirtual() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Conteúdo do assistente baseado na rota atual
  const getAssistantContent = () => {
    switch (pathname) {
      case "/dashboard":
        return {
          title: "Dashboard",
          description: "Aqui você encontra uma visão geral da saúde financeira da sua empresa.",
          content: (
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-medium">Estágio da Empresa</h3>
                <p className="text-sm text-muted-foreground">
                  Indica a fase atual do ciclo de vida da sua empresa, baseada em indicadores financeiros e de
                  crescimento.
                </p>
              </div>
              <div>
                <h3 className="font-medium">KPIs Principais</h3>
                <p className="text-sm text-muted-foreground">
                  Mostra os indicadores-chave de desempenho: receita total, despesas e saldo atual.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Gráficos</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize a evolução financeira da sua empresa. Você pode interagir com os gráficos para obter mais
                  detalhes.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Ações Recomendadas</h3>
                <p className="text-sm text-muted-foreground">
                  Sugestões personalizadas baseadas na análise dos seus dados financeiros, classificadas por prioridade.
                </p>
              </div>
            </div>
          ),
        }
      case "/enviar-extrato":
        return {
          title: "Envio de Extrato",
          description: "Envie seus dados financeiros para análise.",
          content: (
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-medium">Upload de Arquivo</h3>
                <p className="text-sm text-muted-foreground">
                  Você pode enviar arquivos CSV, JSON ou Excel contendo seus dados financeiros.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Preenchimento Manual</h3>
                <p className="text-sm text-muted-foreground">
                  Alternativamente, você pode inserir seus dados financeiros manualmente através do formulário.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Validação</h3>
                <p className="text-sm text-muted-foreground">
                  Seus dados serão validados automaticamente para garantir a consistência antes do processamento.
                </p>
              </div>
            </div>
          ),
        }
      case "/simulador":
        return {
          title: "Simulador de Cenários",
          description: "Simule diferentes cenários financeiros para sua empresa.",
          content: (
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-medium">Ajuste de Valores</h3>
                <p className="text-sm text-muted-foreground">
                  Use os controles deslizantes para ajustar receitas, despesas e investimentos.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Impacto em Tempo Real</h3>
                <p className="text-sm text-muted-foreground">
                  Veja como suas alterações afetam os resultados financeiros instantaneamente nos gráficos.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Histórico de Simulações</h3>
                <p className="text-sm text-muted-foreground">
                  Acesse simulações anteriores e compare diferentes cenários.
                </p>
              </div>
            </div>
          ),
        }
      case "/analises":
        return {
          title: "Análises",
          description: "Visualize e interprete seus dados financeiros em detalhes.",
          content: (
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-medium">Gráficos Interativos</h3>
                <p className="text-sm text-muted-foreground">
                  Explore seus dados através de visualizações interativas. Clique e passe o mouse sobre os elementos
                  para mais detalhes.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Análise de Rede</h3>
                <p className="text-sm text-muted-foreground">
                  Visualize as conexões entre sua empresa, clientes e fornecedores. Clique nos nós para ver detalhes.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Filtros</h3>
                <p className="text-sm text-muted-foreground">
                  Use os filtros para focar em períodos, categorias ou valores específicos.
                </p>
              </div>
            </div>
          ),
        }
      case "/relatorios":
        return {
          title: "Relatórios",
          description: "Configure e exporte relatórios financeiros personalizados.",
          content: (
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-medium">Tipos de Relatório</h3>
                <p className="text-sm text-muted-foreground">
                  Escolha entre relatório completo ou personalizado com as seções que você precisa.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Formatos de Exportação</h3>
                <p className="text-sm text-muted-foreground">
                  Exporte seus relatórios em PDF para apresentações ou CSV para análises adicionais.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Agendamento</h3>
                <p className="text-sm text-muted-foreground">
                  Configure o envio automático de relatórios por e-mail em intervalos regulares.
                </p>
              </div>
            </div>
          ),
        }
      case "/configuracoes":
        return {
          title: "Configurações",
          description: "Personalize sua experiência no sistema.",
          content: (
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="font-medium">Interface</h3>
                <p className="text-sm text-muted-foreground">Ajuste o tema, idioma e outras preferências visuais.</p>
              </div>
              <div>
                <h3 className="font-medium">Segurança</h3>
                <p className="text-sm text-muted-foreground">Gerencie sua senha e dispositivos conectados.</p>
              </div>
              <div>
                <h3 className="font-medium">Notificações</h3>
                <p className="text-sm text-muted-foreground">
                  Configure como e quando deseja receber alertas e notificações.
                </p>
              </div>
            </div>
          ),
        }
      default:
        return {
          title: "Assistente Virtual",
          description: "Como posso ajudar você hoje?",
          content: (
            <div className="space-y-4 mt-4">
              <p className="text-sm text-muted-foreground">
                Selecione uma das seções do sistema para obter ajuda específica ou explore as funcionalidades
                disponíveis.
              </p>
            </div>
          ),
        }
    }
  }

  const assistantContent = getAssistantContent()

  return (
    <>
      <AnimatePresence>
        {open ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="w-[350px] sm:w-[540px] overflow-y-auto">
              <SheetHeader className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setOpen(false)}
                  aria-label="Fechar assistente"
                >
                  <X className="h-4 w-4" />
                </Button>
                <SheetTitle>{assistantContent.title}</SheetTitle>
                <SheetDescription>{assistantContent.description}</SheetDescription>
              </SheetHeader>
              <div className="mt-6">{assistantContent.content}</div>
              <Button variant="outline" className="mt-6 w-full" onClick={() => setOpen(false)}>
                Fechar Assistente
              </Button>
            </SheetContent>
          </Sheet>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button
              size="icon"
              className="h-14 w-14 rounded-full shadow-lg bg-santander-600 hover:bg-santander-700 transition-all duration-300 hover:scale-105"
              onClick={() => setOpen(true)}
              aria-label="Abrir assistente virtual"
            >
              <HelpCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
