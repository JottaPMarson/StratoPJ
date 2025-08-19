"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"
import {
  User,
  Bell,
  Shield,
  Palette,
  Save,
  Trash2,
  LogOut,
  Check,
  AlertCircle,
  Eye,
  Type,
  Languages,
  Keyboard,
  Contrast,
  Accessibility,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ConfiguracoesPage() {
  const router = useRouter()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false)
  const [notificacoesEmail, setNotificacoesEmail] = useState(true)
  const [notificacoesApp, setNotificacoesApp] = useState(true)
  const [notificacoesRelatorios, setNotificacoesRelatorios] = useState(true)
  const [notificacoesAlertas, setNotificacoesAlertas] = useState(true)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState(false)

  // Configurações de acessibilidade
  const [highContrast, setHighContrast] = useState(false)
  const [animations, setAnimations] = useState(true)
  const [fontSize, setFontSize] = useState(100)
  const [keyboardNavigation, setKeyboardNavigation] = useState(true)
  const [screenReader, setScreenReader] = useState(false)
  const [colorBlindMode, setColorBlindMode] = useState("none")

  const handleSaveSettings = () => {
    // Simulando salvamento
    setSaveSuccess(false)
    setSaveError(false)

    setTimeout(() => {
      setSaveSuccess(true)

      // Esconder a mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }, 1000)
  }

  const handleLogout = () => {
    // Simulando logout
    setTimeout(() => {
      router.push("/login")
    }, 1000)
  }

  // Aplicar tamanho de fonte
  const applyFontSize = (size: number) => {
    document.documentElement.style.fontSize = `${size}%`
  }

  // Aplicar modo de alto contraste
  const applyHighContrast = (enabled: boolean) => {
    if (enabled) {
      document.documentElement.classList.add("high-contrast")
    } else {
      document.documentElement.classList.remove("high-contrast")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">Gerencie suas preferências e configurações da conta</p>
        </div>
      </div>

      {saveSuccess && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <Alert className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/30">
            <Check className="h-4 w-4" />
            <AlertTitle>Sucesso</AlertTitle>
            <AlertDescription>Suas configurações foram salvas com sucesso.</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {saveError && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>
              Ocorreu um erro ao salvar suas configurações. Por favor, tente novamente.
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      <Tabs defaultValue="perfil" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full md:w-auto">
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="aparencia" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="acessibilidade" className="flex items-center gap-2">
            <Accessibility className="h-4 w-4" />
            <span className="hidden sm:inline">Acessibilidade</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="perfil" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-santander-600" />
                Informações do Perfil
              </CardTitle>
              <CardDescription>Gerencie suas informações pessoais e da empresa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Dados Pessoais</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" defaultValue="João Silva" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" type="email" defaultValue="joao.silva@empresa.com.br" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cargo">Cargo</Label>
                    <Input id="cargo" defaultValue="Diretor Financeiro" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input id="telefone" defaultValue="(11) 98765-4321" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Dados da Empresa</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="empresa">Nome da Empresa</Label>
                    <Input id="empresa" defaultValue="Empresa Exemplo Ltda." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setor">Setor</Label>
                    <Select defaultValue="tecnologia">
                      <SelectTrigger id="setor">
                        <SelectValue placeholder="Selecione o setor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tecnologia">Tecnologia</SelectItem>
                        <SelectItem value="varejo">Varejo</SelectItem>
                        <SelectItem value="servicos">Serviços</SelectItem>
                        <SelectItem value="industria">Indústria</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="porte">Porte da Empresa</Label>
                    <Select defaultValue="medio">
                      <SelectTrigger id="porte">
                        <SelectValue placeholder="Selecione o porte" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pequeno">Pequeno</SelectItem>
                        <SelectItem value="medio">Médio</SelectItem>
                        <SelectItem value="grande">Grande</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancelar</Button>
              <Button className="bg-santander-600 hover:bg-santander-700" onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-red-600">Zona de Perigo</CardTitle>
              <CardDescription>Ações que podem resultar em perda de dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-red-200 p-4 bg-red-50 dark:bg-red-900/10 dark:border-red-900/20">
                <h3 className="font-medium text-red-600 dark:text-red-400">Excluir Conta</h3>
                <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                  Esta ação excluirá permanentemente sua conta e todos os dados associados. Esta ação não pode ser
                  desfeita.
                </p>
                <Button
                  variant="outline"
                  className="mt-4 border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => setOpenDeleteDialog(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir Minha Conta
                </Button>
              </div>
            </CardContent>
          </Card>

          <ConfirmationDialog
            open={openDeleteDialog}
            onOpenChange={setOpenDeleteDialog}
            title="Excluir conta"
            description="Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita e todos os seus dados serão perdidos permanentemente."
            onConfirm={() => console.log("Conta excluída")}
            confirmText="Excluir Conta"
            cancelText="Cancelar"
            variant="destructive"
          />
        </TabsContent>

        <TabsContent value="notificacoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-santander-600" />
                Preferências de Notificações
              </CardTitle>
              <CardDescription>Controle como e quando deseja receber notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Canais de Notificação</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Notificações por E-mail</Label>
                      <p className="text-sm text-muted-foreground">Receba atualizações importantes por e-mail</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificacoesEmail}
                      onCheckedChange={setNotificacoesEmail}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="app-notifications">Notificações no Aplicativo</Label>
                      <p className="text-sm text-muted-foreground">Receba alertas e mensagens dentro do sistema</p>
                    </div>
                    <Switch id="app-notifications" checked={notificacoesApp} onCheckedChange={setNotificacoesApp} />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Tipos de Notificação</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="report-notifications">Relatórios</Label>
                      <p className="text-sm text-muted-foreground">Notificações sobre relatórios gerados e agendados</p>
                    </div>
                    <Switch
                      id="report-notifications"
                      checked={notificacoesRelatorios}
                      onCheckedChange={setNotificacoesRelatorios}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="alert-notifications">Alertas Financeiros</Label>
                      <p className="text-sm text-muted-foreground">
                        Alertas sobre mudanças significativas nos indicadores financeiros
                      </p>
                    </div>
                    <Switch
                      id="alert-notifications"
                      checked={notificacoesAlertas}
                      onCheckedChange={setNotificacoesAlertas}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-santander-600 hover:bg-santander-700" onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Preferências
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-santander-600" />
                Segurança da Conta
              </CardTitle>
              <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Alterar Senha</h3>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Button className="mt-2 bg-santander-600 hover:bg-santander-700">Atualizar Senha</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Sessões Ativas</h3>
                <div className="rounded-md border">
                  <div className="grid grid-cols-3 border-b bg-muted/50">
                    <div className="p-2 font-medium">Dispositivo</div>
                    <div className="p-2 font-medium">Localização</div>
                    <div className="p-2 font-medium">Última Atividade</div>
                  </div>
                  <div>
                    <div className="grid grid-cols-3 border-b">
                      <div className="p-2">Chrome / Windows</div>
                      <div className="p-2">São Paulo, Brasil</div>
                      <div className="p-2">Agora</div>
                    </div>
                    <div className="grid grid-cols-3">
                      <div className="p-2">Safari / iPhone</div>
                      <div className="p-2">São Paulo, Brasil</div>
                      <div className="p-2">Há 2 dias</div>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="mt-2">
                  Encerrar Todas as Sessões
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-sm font-medium">Autenticação de Dois Fatores</h3>
                    <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança à sua conta</p>
                  </div>
                  <Button className="bg-santander-600 hover:bg-santander-700">Configurar</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sair de Todos os Dispositivos</CardTitle>
              <CardDescription>Encerre todas as sessões ativas em todos os dispositivos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Esta ação encerrará todas as sessões ativas em todos os dispositivos, exceto o dispositivo atual. Você
                precisará fazer login novamente em todos os outros dispositivos.
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setOpenLogoutDialog(true)}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair de Todos os Dispositivos
              </Button>
            </CardContent>
          </Card>

          <ConfirmationDialog
            open={openLogoutDialog}
            onOpenChange={setOpenLogoutDialog}
            title="Sair de todos os dispositivos"
            description="Tem certeza que deseja encerrar todas as sessões ativas em outros dispositivos? Você precisará fazer login novamente em todos eles."
            onConfirm={handleLogout}
            confirmText="Sair de Todos"
            cancelText="Cancelar"
          />
        </TabsContent>

        <TabsContent value="aparencia" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-santander-600" />
                Aparência e Idioma
              </CardTitle>
              <CardDescription>Personalize a interface do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Tema</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-md p-3 cursor-pointer hover:border-santander-600 transition-colors">
                    <div className="space-y-2">
                      <div className="h-20 bg-white rounded-md border"></div>
                      <p className="text-sm font-medium text-center">Claro</p>
                    </div>
                  </div>
                  <div className="border rounded-md p-3 cursor-pointer hover:border-santander-600 transition-colors">
                    <div className="space-y-2">
                      <div className="h-20 bg-gray-900 rounded-md border border-gray-700"></div>
                      <p className="text-sm font-medium text-center">Escuro</p>
                    </div>
                  </div>
                  <div className="border rounded-md p-3 cursor-pointer hover:border-santander-600 transition-colors">
                    <div className="space-y-2">
                      <div className="h-20 bg-gradient-to-b from-white to-gray-900 rounded-md border"></div>
                      <p className="text-sm font-medium text-center">Sistema</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Idioma</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="language">Selecione o Idioma</Label>
                    <Select defaultValue="pt-BR">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Selecione o idioma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Formato de Data</Label>
                    <Select defaultValue="dd/mm/yyyy">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Selecione o formato" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">DD/MM/AAAA</SelectItem>
                        <SelectItem value="mm/dd/yyyy">MM/DD/AAAA</SelectItem>
                        <SelectItem value="yyyy-mm-dd">AAAA-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button className="bg-santander-600 hover:bg-santander-700" onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Preferências
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="acessibilidade" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="h-5 w-5 text-santander-600" />
                Configurações de Acessibilidade
              </CardTitle>
              <CardDescription>Personalize a experiência para melhorar a acessibilidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Contrast className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor="high-contrast">Alto Contraste</Label>
                      <p className="text-sm text-muted-foreground">Aumenta o contraste para melhor visibilidade</p>
                    </div>
                  </div>
                  <Switch
                    id="high-contrast"
                    checked={highContrast}
                    onCheckedChange={(checked) => {
                      setHighContrast(checked)
                      applyHighContrast(checked)
                    }}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="font-size">Tamanho da Fonte</Label>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">A</span>
                    <Slider
                      id="font-size"
                      min={80}
                      max={150}
                      step={5}
                      value={[fontSize]}
                      onValueChange={(value) => {
                        setFontSize(value[0])
                        applyFontSize(value[0])
                      }}
                      className="flex-1"
                    />
                    <span className="text-lg font-bold">A</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Tamanho atual: {fontSize}%</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor="animations">Animações</Label>
                      <p className="text-sm text-muted-foreground">Ativa ou desativa animações da interface</p>
                    </div>
                  </div>
                  <Switch id="animations" checked={animations} onCheckedChange={setAnimations} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Keyboard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor="keyboard-navigation">Navegação por Teclado</Label>
                      <p className="text-sm text-muted-foreground">
                        Habilita atalhos e navegação aprimorada por teclado
                      </p>
                    </div>
                  </div>
                  <Switch
                    id="keyboard-navigation"
                    checked={keyboardNavigation}
                    onCheckedChange={setKeyboardNavigation}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    <Label>Modo Daltônico</Label>
                  </div>
                  <RadioGroup
                    value={colorBlindMode}
                    onValueChange={setColorBlindMode}
                    className="grid grid-cols-2 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="none" />
                      <Label htmlFor="none">Nenhum</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="protanopia" id="protanopia" />
                      <Label htmlFor="protanopia">Protanopia (vermelho)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="deuteranopia" id="deuteranopia" />
                      <Label htmlFor="deuteranopia">Deuteranopia (verde)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tritanopia" id="tritanopia" />
                      <Label htmlFor="tritanopia">Tritanopia (azul)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5 flex items-center gap-2">
                    <Accessibility className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <Label htmlFor="screen-reader">Compatibilidade com Leitor de Tela</Label>
                      <p className="text-sm text-muted-foreground">Otimiza a interface para leitores de tela</p>
                    </div>
                  </div>
                  <Switch id="screen-reader" checked={screenReader} onCheckedChange={setScreenReader} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  setHighContrast(false)
                  setAnimations(true)
                  setFontSize(100)
                  setKeyboardNavigation(true)
                  setScreenReader(false)
                  setColorBlindMode("none")
                  applyFontSize(100)
                  applyHighContrast(false)
                }}
              >
                Restaurar Padrões
              </Button>
              <Button className="bg-santander-600 hover:bg-santander-700" onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Preferências
              </Button>
            </CardFooter>
          </Card>

          <Alert>
            <Accessibility className="h-4 w-4" />
            <AlertTitle>Atalhos de Teclado</AlertTitle>
            <AlertDescription>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Navegação principal</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + 1-9</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Ir para Dashboard</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + D</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Abrir menu de ajuda</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + H</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pesquisar</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs">Alt + S</kbd>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}
