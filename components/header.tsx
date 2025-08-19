"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, LogOut, Settings, Sun, Moon, ChevronDown, User, Building, Calendar, BarChart3 } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { setTheme, theme } = useTheme()

  const handleLogout = () => {
    router.push("/login")
  }

  const userName = "João Silva"
  const companyName = "Empresa Exemplo Ltda."
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 w-full border-b bg-background shadow-sm">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-santander-600 text-white font-bold">
                SP
              </div>
              <span className="text-xl font-bold">StratoPJ</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-1">{/* Navigation items removed as requested */}</nav>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-santander-600"
                    aria-label="3 notificações não lidas"
                  >
                    3
                  </Badge>
                  <span className="sr-only">Notificações</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-4 py-2 font-medium">
                  <span>Notificações</span>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-muted-foreground">
                    Marcar todas como lidas
                  </Button>
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-auto">
                  <div className="flex gap-3 p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-santander-100">
                      <BarChart3 className="h-4 w-4 text-santander-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Relatório mensal disponível</p>
                      <p className="text-xs text-muted-foreground">O relatório de maio está pronto para visualização</p>
                      <p className="text-xs text-muted-foreground mt-1">Há 2 horas</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Alerta de despesa</p>
                      <p className="text-xs text-muted-foreground">Despesas com marketing acima do orçamento</p>
                      <p className="text-xs text-muted-foreground mt-1">Há 5 horas</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 hover:bg-muted/50 cursor-pointer">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Meta de receita atingida</p>
                      <p className="text-xs text-muted-foreground">Sua empresa atingiu a meta mensal de receita</p>
                      <p className="text-xs text-muted-foreground mt-1">Há 1 dia</p>
                    </div>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <div className="p-2 text-center">
                  <Button variant="ghost" size="sm" className="w-full justify-center text-sm">
                    Ver todas as notificações
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label="Alternar tema"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>{theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 h-9 px-3">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src="/placeholder.svg?height=24&width=24" alt={userName} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden md:inline-block">{userName}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="flex flex-col space-y-1 p-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{userName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{companyName}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/configuracoes" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Configurações</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/configuracoes/perfil" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </TooltipProvider>
  )
}
