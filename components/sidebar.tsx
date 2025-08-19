"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FileUp,
  BarChart2,
  PieChart,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  Network,
  TrendingUp,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkIsMobile()
    window.addEventListener("resize", checkIsMobile)

    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  // Fechar o menu ao navegar em dispositivos móveis
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false)
    }
  }, [pathname, isMobile])

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      active: pathname === "/dashboard",
    },
    {
      label: "Enviar Extrato",
      icon: FileUp,
      href: "/enviar-extrato",
      active: pathname === "/enviar-extrato",
    },
    {
      label: "Classificação",
      icon: TrendingUp,
      href: "/classificacao",
      active: pathname === "/classificacao",
    },
    {
      label: "Simulador",
      icon: BarChart2,
      href: "/simulador",
      active: pathname === "/simulador",
    },
    {
      label: "Análises",
      icon: PieChart,
      href: "/analises",
      active: pathname === "/analises",
    },
    {
      label: "Análise de Rede",
      icon: Network,
      href: "/analises/rede",
      active: pathname === "/analises/rede",
    },
    {
      label: "Relatórios",
      icon: FileText,
      href: "/relatorios",
      active: pathname === "/relatorios",
    },
    {
      label: "Configurações",
      icon: Settings,
      href: "/configuracoes",
      active: pathname === "/configuracoes",
    },
  ]

  return (
    <>
      {/* Botão de menu para mobile */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay para mobile */}
      {isOpen && isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={isMobile ? { x: "-100%" } : false}
        animate={isMobile ? { x: isOpen ? 0 : "-100%" } : {}}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background lg:static",
          isMobile && !isOpen && "pointer-events-none",
          className,
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            {/* Logo and name removed */}
          </Link>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Fechar menu">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-auto py-4">
          <div className="px-2 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">Menu Principal</h2>
            <nav className="space-y-1">
              <TooltipProvider delayDuration={300}>
                {routes.map((route) => (
                  <Tooltip key={route.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={route.href}
                        className={cn(
                          "group flex h-10 w-full items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                          route.active
                            ? "bg-santander-600 text-white"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <route.icon
                          className={cn(
                            "mr-3 h-5 w-5",
                            route.active ? "text-white" : "text-muted-foreground group-hover:text-foreground",
                          )}
                        />
                        <span>{route.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="hidden lg:block">
                      {route.label}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </nav>
          </div>
        </div>

        <div className="mt-auto border-t p-4">
          <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
            <Link href="/">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Link>
          </Button>
        </div>
      </motion.aside>
    </>
  )
}
