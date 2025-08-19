"use client"

import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { AssistenteVirtual } from "@/components/assistente-virtual"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Evitar problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <motion.div className="p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>

        {/* Assistente Virtual */}
        <AssistenteVirtual />
      </div>
    </div>
  )
}
