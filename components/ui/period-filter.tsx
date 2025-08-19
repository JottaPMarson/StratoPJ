"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PeriodFilterProps {
  onPeriodChange?: (period: string | { from: Date; to: Date }) => void
  className?: string
}

export function PeriodFilter({ onPeriodChange, className }: PeriodFilterProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30d")
  const [date, setDate] = useState<{ from: Date; to: Date }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })
  const [isOpen, setIsOpen] = useState(false)

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value)

    let from = new Date()
    const to = new Date()

    switch (value) {
      case "7d":
        from = new Date(new Date().setDate(new Date().getDate() - 7))
        break
      case "30d":
        from = new Date(new Date().setDate(new Date().getDate() - 30))
        break
      case "90d":
        from = new Date(new Date().setDate(new Date().getDate() - 90))
        break
      case "1y":
        from = new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        break
      case "custom":
        return // Não faz nada, deixa o usuário selecionar
    }

    if (value !== "custom") {
      setDate({ from, to })
      onPeriodChange?.(value)
    }
  }

  const handleDateChange = (range: { from?: Date; to?: Date }) => {
    if (range.from && range.to) {
      setDate({ from: range.from, to: range.to })
      onPeriodChange?.({ from: range.from, to: range.to })
    }
  }

  const formatPeriodLabel = () => {
    if (selectedPeriod === "custom") {
      return `${format(date.from, "dd/MM/yyyy")} - ${format(date.to, "dd/MM/yyyy")}`
    }

    const labels = {
      "7d": "Últimos 7 dias",
      "30d": "Últimos 30 dias",
      "90d": "Últimos 90 dias",
      "1y": "Último ano",
    }

    return labels[selectedPeriod as keyof typeof labels]
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("justify-between w-[240px]", className)}>
          <span className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {formatPeriodLabel()}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 border-b">
          <Tabs defaultValue={selectedPeriod} onValueChange={handlePeriodChange}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
              <TabsTrigger value="1y">1A</TabsTrigger>
              <TabsTrigger value="custom">Personalizado</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {selectedPeriod === "custom" && (
          <Calendar
            mode="range"
            selected={date}
            onSelect={(range) => handleDateChange(range || { from: new Date(), to: new Date() })}
            locale={ptBR}
            numberOfMonths={2}
            initialFocus
          />
        )}
        <div className="p-3 border-t flex justify-end">
          <Button size="sm" onClick={() => setIsOpen(false)} className="bg-santander-600 hover:bg-santander-700">
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
